namespace AgroShop.API.DTOs.Account;

// نمایش اطلاعات کاربر در داشبورد
public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? FarmOrStoreName { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ورودی ویرایش اطلاعات پروفایل
public class UpdateProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? FarmOrStoreName { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
}

// خلاصه سفارش‌ها در داشبورد کاربر
public class UserOrderSummaryDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty; // e.g. Pending, Processing, Shipped, Delivered
    public int ItemsCount { get; set; }
}

// آمار بالای صفحه داشبورد
public class UserDashboardOverviewDto
{
    public UserProfileDto Profile { get; set; } = new();
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public List<UserOrderSummaryDto> RecentOrders { get; set; } = new();
}
