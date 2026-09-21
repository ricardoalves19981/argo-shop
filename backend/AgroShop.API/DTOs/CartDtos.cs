namespace AgroShop.API.DTOs.Cart;

public record UpsertCartItemRequest(int ProductId, int Quantity);

public record MergeCartRequest(string GuestId);

public class CartDto
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string? GuestId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice => Items.Sum(x => x.Quantity * (x.DiscountPrice ?? x.Price));
    public int TotalItems => Items.Sum(x => x.Quantity);
    public DateTime UpdatedAt { get; set; }
}

public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Unit { get; set; }
    public string? MainImageUrl { get; set; }
    public int Quantity { get; set; }
    public decimal ItemTotal => Quantity * (DiscountPrice ?? Price);
}
