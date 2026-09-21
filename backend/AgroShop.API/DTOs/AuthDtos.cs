using System.ComponentModel.DataAnnotations;

namespace AgroShop.API.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "نام و نام خانوادگی الزامی است")]
    [MaxLength(100, ErrorMessage = "نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "شماره موبایل الزامی است")]
    [RegularExpression(@"^09[0-9]{9}$", ErrorMessage = "فرمت شماره موبایل نامعتبر است (مثال: 09123456789)")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "ایمیل الزامی است")]
    [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "رمز عبور الزامی است")]
    [MinLength(6, ErrorMessage = "رمز عبور باید حداقل ۶ کاراکتر باشد")]
    public string Password { get; set; } = string.Empty;

    public string? FarmOrStoreName { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
}

public class LoginDto
{
    [Required(ErrorMessage = "ایمیل یا نام کاربری الزامی است")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "رمز عبور الزامی است")]
    public string Password { get; set; } = string.Empty;
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Address { get; set; }
    public string Role { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}
