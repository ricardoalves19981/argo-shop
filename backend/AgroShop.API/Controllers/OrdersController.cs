namespace AgroShop.API.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AgroShop.API.DTOs;
using AgroShop.API.Services;
using AgroShop.API.Data;
using Microsoft.EntityFrameworkCore;

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

    private string? GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier);

    // [HttpPost]
    // public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderDto dto)
    // {
    //     var userId = GetUserId();
    //     if (string.IsNullOrEmpty(userId))
    //         return Unauthorized();

    //     try
    //     {
    //         var order = await _orderService.CreateOrderFromCartAsync(userId, dto);
    //         return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    //     }
    //     catch (InvalidOperationException ex)
    //     {
    //         return BadRequest(new { message = ex.Message });
    //     }
    // }

    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var userId = GetUserId();
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


    [HttpGet]
    public async Task<ActionResult<List<OrderResponseDto>>> GetMyOrders()
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
    {
        var userId = GetUserId();
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
    public async Task<IActionResult> Verify(
        [FromQuery] string? Authority,
        [FromQuery] string? Status)
    {
        const string frontendUrl = "http://localhost:3000";

        if (string.IsNullOrWhiteSpace(Authority))
        {
            return Redirect(
                $"{frontendUrl}/payment/failed?reason=invalid-authority");
        }

        // در Callback زرین‌پال، فقط Status=OK باید Verify شود.
        if (!string.Equals(Status, "OK", StringComparison.OrdinalIgnoreCase))
        {
            return Redirect(
                $"{frontendUrl}/payment/failed?reason=cancelled&authority={Uri.EscapeDataString(Authority)}");
        }

        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Authority == Authority);

        if (order == null)
        {
            return Redirect(
                $"{frontendUrl}/payment/failed?reason=order-not-found");
        }

        // از مبلغ ذخیره‌شده سفارش استفاده کنید؛ نه مبلغ ارسالی کاربر.
        var isVerified = await _paymentService.VerifyPaymentAsync(
            Authority,
            order.TotalAmount);

        if (!isVerified)
        {
            return Redirect(
                $"{frontendUrl}/payment/failed?reason=verification-failed");
        }

        order.IsPaid = true;
        order.PaymentDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Redirect(
            $"{frontendUrl}/payment/success?orderId={order.Id}");
    }

}
