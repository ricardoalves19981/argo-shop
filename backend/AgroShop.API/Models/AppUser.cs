using Microsoft.AspNetCore.Identity;

namespace AgroShop.API.Models;

public class AppUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string? FarmOrStoreName { get; set; } // نام مزرعه یا فروشگاه (اختیاری)
    public string? Address { get; set; }
    public string? City { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
