namespace AgroShop.API.DTOs;

using AgroShop.API.Models;


public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
public class CreateOrderDto
{
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverPhone { get; set; } = string.Empty;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Online;

    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
}

public class OrderResponseDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string? PaymentTrackingCode { get; set; }

    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverPhone { get; set; } = string.Empty;

    public List<OrderItemDto> Items { get; set; } = new();
}


public class OrderListDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalItemsCount { get; set; }
}

public class OrderDetailDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? RefId { get; set; }
    public DateTime CreatedAt { get; set; }

    // مشخصات ارسال
    public string RecipientName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string? ShippingTrackingCode { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}