namespace AgroShop.API.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AgroShop.API.DTOs;
using AgroShop.API.Services;
using AgroShop.API.Data;
using Microsoft.EntityFrameworkCore;
using AgroShop.API.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;
    private readonly AppDbContext _context;
    private readonly ZarinPalService _zarinPalService;
    private readonly IConfiguration _config;
    public OrdersController(IOrderService orderService, IPaymentService paymentService, AppDbContext context, IConfiguration configuration)
    {
        _orderService = orderService;
        _paymentService = paymentService;
        _context = context;
        _config = configuration;

    }
    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    // GET: api/orders/my-orders
    [HttpGet("my-orders")]
    public async Task<ActionResult<IEnumerable<OrderListDto>>> GetMyOrders()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();


        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderListDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                IsPaid = o.IsPaid,
                CreatedAt = o.OrderDate,
                TotalItemsCount = o.Items.Sum(i => i.Quantity)
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/my-orders/{orderNumber}
    [HttpGet("my-orders/{orderNumber}")]
    public async Task<ActionResult<OrderDetailDto>> GetMyOrderDetails(string orderNumber)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();


        var order = await _context.Orders
            .Where(o => o.UserId == userId && o.OrderNumber == orderNumber)
            .Select(o => new OrderDetailDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                IsPaid = o.IsPaid,
                PaymentDate = o.PaymentDate,
                RefId = o.RefId,
                CreatedAt = o.OrderDate,
                RecipientName = o.ReceiverName,
                PhoneNumber = o.ReceiverPhone,
                Address = o.ShippingAddress,
                PostalCode = o.ShippingPostalCode,
                ShippingTrackingCode = o.PaymentTrackingCode,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName, // خوانده شده از اسنپ‌شات آیتم
                    UnitPrice = i.UnitPrice,     // خوانده شده از اسنپ‌شات آیتم
                    Quantity = i.Quantity
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(new { message = "سفارش یافت نشد." });

        return Ok(order);
    }




    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var order = await _orderService.CreateOrderFromCartAsync(userId, dto);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException dbEx)
        {
            // ریشه اصلی خطای دیتابیس در InnerException قرار دارد
            var rootError = dbEx.InnerException != null ? dbEx.InnerException.Message : dbEx.Message;
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"[DB ERROR]: {rootError}");
            Console.ResetColor();

            return StatusCode(500, new { message = "خطای دیتابیس در ذخیره سفارش", detail = rootError });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }




    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var order = await _orderService.GetOrderByIdAsync(id, userId);
        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost("pay/{orderId}")]
    public async Task<IActionResult> Pay(int orderId)
    {
        var userId = User.FindFirst("sub")?.Value; // یا NameIdentifier بسته به JWT شما

        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId /* && o.UserId == userId */);

        if (order == null)
            return NotFound(new { message = "Order not found." });

        // اگر مبلغ/فیلدها nullable هستند:
        if (order.TotalAmount <= 0)
            return BadRequest(new { message = "Invalid order amount." });

        // callback را از config بگیر (یا بساز)
        var callbackUrl = _config["ZarinPal:CallbackUrl"];
        if (string.IsNullOrWhiteSpace(callbackUrl))
            return StatusCode(500, new { message = "ZarinPal CallbackUrl is not configured." });

        var authority = await _paymentService.RequestPaymentAsync(
            order.Id,
            order.TotalAmount,
            $"Order #{order.Id}",
            callbackUrl
        );

        // مهم: اینجا جلوی NullReference گرفته می‌شود
        if (string.IsNullOrWhiteSpace(authority))
            return BadRequest(new { message = "Payment request failed. Check ZarinPal logs in backend console." });

        order.Authority = authority;
        await _context.SaveChangesAsync();

        var payUrl = _paymentService.GetPaymentGatewayUrl(authority);
        return Ok(new { url = payUrl });
    }

    [AllowAnonymous]
    [HttpGet("verify")]
    public async Task<IActionResult> Verify([FromQuery] string? Authority, [FromQuery] string? Status)
    {
        const string frontendUrl = "http://localhost:3000";

        if (string.IsNullOrEmpty(Authority) || Status != "OK")
        {
            return Redirect($"{frontendUrl}/payment/failed?reason=cancelled");
        }

        // ۱. لود کردن سفارش با لیست Items
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Authority == Authority);

        if (order == null)
        {
            return Redirect($"{frontendUrl}/payment/failed?reason=order-not-found");
        }

        // ۲. جلوگیری از کسر مجدد موجودی در صورت رفرش صفحه
        if (order.IsPaid)
        {
            return Redirect($"{frontendUrl}/payment/success?orderId={order.OrderNumber}&refId={order.RefId}");
        }

        // ۳. اعتبارسنجی درگاه زرین‌پال
        var (isVerified, refId) = await _paymentService.VerifyPaymentAsync(Authority, order.TotalAmount);

        if (isVerified)
        {
            // ۴. به‌روزرسانی وضعیت سفارش
            order.IsPaid = true;
            order.Status = OrderStatus.Paid;
            order.PaymentDate = DateTime.UtcNow;
            order.RefId = refId.ToString();
            order.PaymentTrackingCode = refId.ToString();

            // ۵. کسر موجودی از جدول Products
            if (order.Items != null && order.Items.Any())
            {
                var productIds = order.Items.Select(i => i.ProductId).ToList();
                var products = await _context.Products
                    .Where(p => productIds.Contains(p.Id))
                    .ToListAsync();

                foreach (var item in order.Items)
                {
                    var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                    if (product != null)
                    {
                        // اگر در مدل Product نام فیلد Stock است:
                        product.StockQuantity = Math.Max(0, product.StockQuantity - item.Quantity);

                        // اگر در مدل Product نام دیگری مثل StockQuantity است، آن را بگذارید:
                        // product.StockQuantity = Math.Max(0, product.StockQuantity - item.Quantity);
                    }
                }
            }

            await _context.SaveChangesAsync();

            // ارسال شماره سفارش خوانا (OrderNumber) و RefId به فرانت
            return Redirect($"{frontendUrl}/payment/success?orderId={order.OrderNumber}&refId={refId}");
        }

        return Redirect($"{frontendUrl}/payment/failed?reason=verification-failed");
    }


    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = "سفارش یافت نشد" });

        // تبدیل صریح int به OrderStatus
        order.Status = (AgroShop.API.Models.OrderStatus)dto.Status;

        await _context.SaveChangesAsync();

        return Ok(new { message = "وضعیت سفارش با موفقیت به‌روزرسانی شد" });
    }

    // 1. دریافت همه سفارش‌ها مخصوص پنل ادمین
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User) // در صورت وجود رابطه با کاربر
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                // اگر فیلد OrderNumber ندارید، می‌توانید حذف یا از Id استفاده کنید:
                OrderNumber = o.Id.ToString(),
                CustomerName = o.User != null ? (o.User.FullName ?? o.User.UserName) : "کاربر مهمان",
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.OrderDate
            })
            .ToListAsync();

        return Ok(orders);
    }

    // 2. دریافت جزئیات یک سفارش بر اساس ID برای صفحه جزئیات
    [HttpGet("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(oi => oi.Product) // اگر رابطه با محصول دارید
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "سفارش مورد نظر یافت نشد" });
        }

        var orderDto = new
        {
            order.Id,
            OrderNumber = order.Id.ToString(),
            CustomerName = order.User != null ? (order.User.FullName ?? order.User.UserName) : "کاربر مهمان",
            order.ShippingAddress,
            order.ShippingPostalCode,
            order.TotalAmount,
            order.Status,
            order.OrderDate,
            User = order.User != null ? new
            {
                FullName = order.User.FullName ?? order.User.UserName,
                PhoneNumber = order.User.PhoneNumber,
                Email = order.User.Email
            } : null,
            Items = order.Items.Select(item => new
            {
                item.Id,
                ProductName = item.Product != null ? item.Product.Name : "محصول",
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity,
                TotalPrice = item.UnitPrice * item.Quantity
            }).ToList()
        };

        return Ok(orderDto);
    }

}
