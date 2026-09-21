namespace AgroShop.API.Models;

public class Cart
{
    public int Id { get; set; }
    // برای کاربر لاگین شده UserId پر است، برای مهمان GuestId (تولید شده در فرانت مثل یک GUID)
    public string? UserId { get; set; }
    public string? GuestId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}