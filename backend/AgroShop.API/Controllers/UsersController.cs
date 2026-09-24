using AgroShop.API.Data; // نام کانتکست دیتابیس خود را قرار دهید
using AgroShop.API.DTOs.Users;
using AgroShop.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly AppDbContext _context; // برای شمارش سفارش‌ها

    public UsersController(
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager,
        AppDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
    }

    // GET: api/users?pageNumber=1&pageSize=10&search=
    [HttpGet]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        pageSize = pageSize < 1 ? 10 : Math.Min(pageSize, 50);

        var query = _userManager.Users.AsNoTracking().AsQueryable();

        // فیلتر جستجو بر اساس نام، نام کاربری، ایمیل، موبایل یا نام مزرعه/فروشگاه
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(u =>
                u.FullName.Contains(term) ||
                (u.UserName != null && u.UserName.Contains(term)) ||
                (u.Email != null && u.Email.Contains(term)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(term)) ||
                (u.FarmOrStoreName != null && u.FarmOrStoreName.Contains(term)));
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // به دلیل اینکه GetRolesAsync در دیتابیس مستقیم به شکل Queryable در دسترس نیست،
        // نقش‌ها را برای صفحه جاری لود می‌کنیم:
        var userDtos = new List<UserListDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var isLocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;

            // شمارش سفارش‌های ثبت شده کاربر (در صورت وجود جدول Orders)
            var ordersCount = await _context.Orders.CountAsync(o => o.UserId == user.Id);

            userDtos.Add(new UserListDto
            {
                Id = user.Id,
                FullName = user.FullName,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FarmOrStoreName = user.FarmOrStoreName,
                City = user.City,
                Roles = roles,
                IsLockedOut = isLocked,
                CreatedAt = user.CreatedAt,
                OrdersCount = ordersCount
            });
        }

        return Ok(new
        {
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            Data = userDtos
        });
    }

    // PATCH: api/users/{id}/toggle-lock
    // برای مسدود یا فعال‌سازی کاربر با استفاده از LockoutEnd در Identity
    [HttpPatch("{id}/toggle-lock")]
    public async Task<IActionResult> ToggleUserLock(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "کاربر مورد نظر یافت نشد." });

        bool isCurrentlyLocked = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;

        if (isCurrentlyLocked)
        {
            // آنلاک کردن کاربر
            await _userManager.SetLockoutEndDateAsync(user, null);
            return Ok(new { message = "حساب کاربری با موفقیت فعال شد.", isLockedOut = false });
        }
        else
        {
            // مسدود کردن اکانت (مثلاً تا ۲۰۰ سال آینده)
            await _userManager.SetLockoutEnabledAsync(user, true);
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(200));
            return Ok(new { message = "حساب کاربری مسدود شد.", isLockedOut = true });
        }
    }

    // PUT: api/users/{id}/role
    // تغییر یا انتساب نقش کاربر
    [HttpPut("{id}/role")]
    public async Task<IActionResult> ChangeUserRole(string id, [FromBody] UpdateUserRoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Role))
            return BadRequest(new { message = "نقش ارسالی نامعتبر است." });

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "کاربر یافت نشد." });

        if (!await _roleManager.RoleExistsAsync(dto.Role))
        {
            return BadRequest(new { message = $"نقش '{dto.Role}' در سیستم تعریف نشده است." });
        }

        var currentRoles = await _userManager.GetRolesAsync(user);

        // حذف نقش‌های قبلی و اضافه کردن نقش جدید
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return BadRequest(new { message = "خطا در حذف نقش‌های پیشین." });

        var addResult = await _userManager.AddToRoleAsync(user, dto.Role);
        if (!addResult.Succeeded)
            return BadRequest(new { message = "خطا در انتساب نقش جدید." });

        return Ok(new { message = $"نقش کاربر به '{dto.Role}' تغییر یافت.", role = dto.Role });
    }
}
