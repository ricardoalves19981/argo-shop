using AgroShop.API.DTOs.Cart;

namespace AgroShop.API.Services.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(string? userId, string? guestId, CancellationToken ct = default);
    Task<CartDto> UpsertItemAsync(string? userId, string? guestId, UpsertCartItemRequest request, CancellationToken ct = default);
    Task<CartDto> RemoveItemAsync(string? userId, string? guestId, int productId, CancellationToken ct = default);
    Task<CartDto> ClearAsync(string? userId, string? guestId, CancellationToken ct = default);
    Task<CartDto> MergeGuestIntoUserAsync(string userId, string guestId, CancellationToken ct = default);
}
