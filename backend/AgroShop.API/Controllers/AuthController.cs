using System.Security.Claims;
using AgroShop.API.Constants;
using AgroShop.API.DTOs;
using AgroShop.API.Models;
using AgroShop.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AgroShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<AppUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var emailExists = await _userManager.FindByEmailAsync(dto.Email);
        if (emailExists != null)
            return BadRequest(new { message = "این ایمیل قبلاً در سیستم ثبت شده است." });

        var user = new AppUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            City = dto.City,
            Address = dto.Address,
            FarmOrStoreName = dto.FarmOrStoreName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        await _userManager.AddToRoleAsync(user, UserRoles.Customer);

        var token = await _tokenService.CreateTokenAsync(user);

        return Ok(new
        {
            user = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                City = user.City,
                Address = user.Address,
                Role = UserRoles.Customer
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { message = "ایمیل یا رمز عبور اشتباه است." });

        var roles = await _userManager.GetRolesAsync(user);
        var mainRole = roles.Contains(UserRoles.Admin)
            ? UserRoles.Admin
            : (roles.FirstOrDefault() ?? UserRoles.Customer);

        var token = await _tokenService.CreateTokenAsync(user);

        var isHttps = Request.IsHttps;

        var tokenCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/"
        };

        Response.Cookies.Append("agro_token", token, tokenCookieOptions);

        return Ok(new
        {
            user = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                City = user.City,
                Address = user.Address,
                Role = mainRole
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "کاربر یافت نشد." });

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            City = user.City,
            Address = user.Address,
            Role = roles.Contains(UserRoles.Admin)
                ? UserRoles.Admin
                : (roles.FirstOrDefault() ?? UserRoles.Customer)
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var isHttps = Request.IsHttps;

        Response.Cookies.Delete("agro_token", new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Path = "/"
        });

        return Ok(new { message = "با موفقیت خارج شدید" });
    }
}
