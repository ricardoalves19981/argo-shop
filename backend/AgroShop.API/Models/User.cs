using Microsoft.AspNetCore.Identity;

namespace AgroShop.API.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string? NationalCode { get; set; }          // کدملی (برای صدور فاکتور رسمی سموم)
    public bool IsFarmerOrBusiness { get; set; } = false; // جهت تفکیک کشاورز عمده یا خانگی
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}


