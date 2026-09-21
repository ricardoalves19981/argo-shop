namespace AgroShop.API.Models;

public class Address
{
    public int Id { get; set; }
    public string Title { get; set; } = "آدرس پیش‌فرض"; // مثلا: مزرعه، منزل، انبار
    public string Province { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalAddress { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string ReceiverPhone { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }
}