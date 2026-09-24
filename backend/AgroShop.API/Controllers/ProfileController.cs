using System.Security.Claims;
using AgroShop.API.Data;
using AgroShop.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroShop.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public ProfileController(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub")
               ?? _userManager.GetUserId(User);
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        try
        {
            // ۱. خواندن شناسه کاربر به روش‌های مختلف برای اطمینان
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue("sub")
                         ?? _userManager.GetUserId(User);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "کاربر شناسایی نشد." });
            }

            // ۲. بررسی وجود کاربر
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "کاربر پیدا نشد." });
            }

            // ۳. دریافت امن سفارش‌ها (حتی اگر هنوز سفارشی وجود ندارد)
            // نکته: اگر نام جدول سفارش‌های شما متفاوت است (مثلا Orders)، آن را تطبیق دهید
            var userOrdersQuery = _context.Orders.Where(o => o.UserId == userId);

            var totalOrders = await userOrdersQuery.CountAsync();

            // جلوگیری از خطای Sum روی دیتابیس در صورت نبود سفارش
            var totalSpent = totalOrders > 0
                ? await userOrdersQuery.SumAsync(o => (decimal?)o.TotalAmount) ?? 0
                : 0;

            // ۳ سفارش اخیر به صورت ایمن
            var recentOrders = await userOrdersQuery
                .OrderByDescending(o => o.OrderDate)
                .Take(3)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    Status = o.Status.ToString()
                })
                .ToListAsync();

            return Ok(new
            {
                fullName = user.FullName ?? user.UserName ?? "کاربر",
                farmOrStoreName = user.FarmOrStoreName ?? "",
                email = user.Email ?? "",
                phoneNumber = user.PhoneNumber ?? "",
                address = user.Address ?? "",
                city = user.City ?? "",
                createdAt = user.CreatedAt,
                totalOrders,
                totalSpent,
                recentOrders
            });
        }
        catch (Exception ex)
        {
            // لاگ خطا در ترمینال بک‌اند برای مشاهده دقیق
            Console.WriteLine($"[ProfileOverview Error]: {ex.Message}");
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new { message = "خطای سرور", error = ex.Message });
        }
    }


    [HttpGet("orders")]
    public async Task<IActionResult> GetMyOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "کاربر احراز هویت نشده است." });

            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 10;

            var query = _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId);

            var totalCount = await query.CountAsync();

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    Status = o.Status.ToString(),
                    // اگر جدول OrderItems دارید و شامل نام محصول است:
                    ItemsCount = o.Items != null ? o.Items.Count : 0,
                    Items = o.Items != null ? o.Items.Select(i => new
                    {
                        i.Id,
                        ProductTitle = i.Product != null ? i.Product.Name : "محصول",
                        i.Quantity,
                        i.UnitPrice
                    }).ToList() : null
                })
                .ToListAsync();

            return Ok(new
            {
                items = orders,
                totalCount,
                pageNumber,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetMyOrders Error]: {ex.Message}");
            return StatusCode(500, new { message = "خطای سرور در دریافت سفارش‌ها", error = ex.Message });
        }
    }

    /// <summary>
    /// دریافت جزئیات یک سفارش خاص کاربر
    /// GET: api/profile/orders/{orderId}
    /// </summary>
    [HttpGet("orders/{orderId}")]
    public async Task<IActionResult> GetMyOrderDetail(int orderId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "کاربر احراز هویت نشده است." });

            var order = await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                return NotFound(new { message = "سفارش مورد نظر یافت نشد." });

            return Ok(new
            {
                order.Id,
                order.OrderDate,
                order.TotalAmount,
                Status = order.Status.ToString(),
                Items = order.Items.Select(i => new
                {
                    i.Id,
                    ProductId = i.ProductId,
                    ProductTitle = i.Product != null ? i.Product.Name : "نامشخص",
                    i.Quantity,
                    i.UnitPrice,
                    TotalPrice = i.UnitPrice * i.Quantity
                })
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetMyOrderDetail Error]: {ex.Message}");
            return StatusCode(500, new { message = "خطای سرور در دریافت جزئیات سفارش", error = ex.Message });
        }
    }

}
