namespace AgroShop.API.Services;

using Microsoft.EntityFrameworkCore;
using AgroShop.API.Data;
using AgroShop.API.DTOs;
using AgroShop.API.Models;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponseDto> CreateOrderFromCartAsync(string userId, CreateOrderDto dto)
    {
        Console.WriteLine($"DEBUG: Attempting to create order for UserId: '{userId}'");

        // ۱. دریافت کامل شیء کاربر به جای صرفاً تست وجود آن
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("کاربر معتبر نمی‌باشد (UserId در دیتابیس یافت نشد).");
        }

        if (dto.Items == null || !dto.Items.Any())
            throw new InvalidOperationException("سبد خرید شما خالی است.");

        // ۲. ساخت شیء سفارش با مقداردهی صریح هم UserId و هم User
        var order = new Order
        {
            UserId = user.Id,
            User = user,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            PaymentMethod = dto.PaymentMethod,
            ShippingProvince = dto.ShippingProvince,
            ShippingCity = dto.ShippingCity,
            ShippingAddress = dto.ShippingAddress,
            ShippingPostalCode = dto.ShippingPostalCode,
            ReceiverName = dto.ReceiverName,
            ReceiverPhone = dto.ReceiverPhone
        };

        decimal totalAmount = 0;

        foreach (var item in dto.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);

            if (product == null)
                throw new InvalidOperationException($"محصول با شناسه {item.ProductId} یافت نشد.");

            if (product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"موجودی محصول «{product.Name}» کافی نیست.");

            var effectivePrice = product.DiscountPrice ?? product.Price;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = effectivePrice,
                Quantity = item.Quantity
            });

            totalAmount += effectivePrice * item.Quantity;
        }

        order.TotalAmount = totalAmount;

        _context.Orders.Add(order);

        // لاگ‌های دیباگ دقیق قبل از ذخیره‌سازی
        var entry = _context.Entry(order);
        Console.WriteLine($"DEBUG: Order Entity State: {entry.State}");
        Console.WriteLine($"DEBUG: Final UserId on Order: '{order.UserId}'");
        Console.WriteLine($"DEBUG: User Navigation Object Attached: {order.User != null}");

        await _context.SaveChangesAsync();

        return MapToDto(order);
    }



    public async Task<List<OrderResponseDto>> GetUserOrdersAsync(string userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderResponseDto?> GetOrderByIdAsync(int orderId, string userId)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        return order == null ? null : MapToDto(order);
    }

    private static OrderResponseDto MapToDto(Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status.ToString(),
            PaymentMethod = order.PaymentMethod.ToString(),
            PaymentTrackingCode = order.PaymentTrackingCode,
            ShippingProvince = order.ShippingProvince,
            ShippingCity = order.ShippingCity,
            ShippingAddress = order.ShippingAddress,
            ShippingPostalCode = order.ShippingPostalCode,
            ReceiverName = order.ReceiverName,
            ReceiverPhone = order.ReceiverPhone,
            Items = order.Items.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList()
        };
    }
}
