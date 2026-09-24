namespace AgroShop.API.DTOs.Users;

public class UserListDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? FarmOrStoreName { get; set; }
    public string? City { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
    public bool IsLockedOut { get; set; }
    public DateTime CreatedAt { get; set; }
    public int OrdersCount { get; set; }
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty; // e.g. "Admin", "Customer"
}
