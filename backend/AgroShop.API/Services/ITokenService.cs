using AgroShop.API.Models;
using Microsoft.AspNetCore.Identity;

namespace AgroShop.API.Services;

public interface ITokenService
{
    Task<string> CreateTokenAsync(AppUser user);
}
