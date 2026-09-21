namespace AgroShop.API.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty;    // ثبت نام زمان خرید
    public decimal UnitPrice { get; set; }                     // قیمت در زمان خرید
    public int Quantity { get; set; }
}