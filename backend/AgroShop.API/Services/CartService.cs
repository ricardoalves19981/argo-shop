using AgroShop.API.Data; // یا namespace دیتابیس شما
using AgroShop.API.DTOs.Cart;
using AgroShop.API.Models;
using AgroShop.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgroShop.API.Services.Implementations;

public class CartService : ICartService
{
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    private async Task<Cart> GetOrCreateCartEntityAsync(string? userId, string? guestId, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(guestId))
            throw new ArgumentException("شناسه کاربر یا مهمان باید ارسال شود.");

        Cart? cart = null;

        if (!string.IsNullOrWhiteSpace(userId))
        {
            cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .ThenInclude(p => p!.Images)
                .FirstOrDefaultAsync(c => c.UserId == userId, ct);
        }
        else if (!string.IsNullOrWhiteSpace(guestId))
        {
            cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .ThenInclude(p => p!.Images)
                .FirstOrDefaultAsync(c => c.GuestId == guestId, ct);
        }

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                GuestId = string.IsNullOrWhiteSpace(userId) ? guestId : null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync(ct);
        }

        return cart;
    }

    public async Task<CartDto> GetCartAsync(string? userId, string? guestId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(guestId))
            return new CartDto();

        var cart = await GetOrCreateCartEntityAsync(userId, guestId, ct);
        return MapToDto(cart);
    }

    public async Task<CartDto> UpsertItemAsync(string? userId, string? guestId, UpsertCartItemRequest request, CancellationToken ct = default)
    {
        if (request.Quantity <= 0)
            return await RemoveItemAsync(userId, guestId, request.ProductId, ct);

        var product = await _context.Products.FindAsync(new object[] { request.ProductId }, ct);
        if (product == null)
            throw new KeyNotFoundException("محصول مورد نظر یافت نشد.");

        if (product.StockQuantity < request.Quantity)
            throw new InvalidOperationException($"تعداد درخواستی بیشتر از موجودی انبار ({product.StockQuantity}) است.");

        var cart = await GetOrCreateCartEntityAsync(userId, guestId, ct);
        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity = request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        // واکشی مجدد سبد برای اطمینان از لود شدن روابط محصول
        return await GetCartAsync(userId, guestId, ct);
    }

    public async Task<CartDto> RemoveItemAsync(string? userId, string? guestId, int productId, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartEntityAsync(userId, guestId, ct);
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);

        if (item != null)
        {
            cart.Items.Remove(item);
            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);
        }

        return MapToDto(cart);
    }

    public async Task<CartDto> ClearAsync(string? userId, string? guestId, CancellationToken ct = default)
    {
        var cart = await GetOrCreateCartEntityAsync(userId, guestId, ct);
        cart.Items.Clear();
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return MapToDto(cart);
    }

    public async Task<CartDto> MergeGuestIntoUserAsync(string userId, string guestId, CancellationToken ct = default)
    {
        var guestCart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.GuestId == guestId, ct);

        if (guestCart == null || !guestCart.Items.Any())
            return await GetCartAsync(userId, null, ct);

        var userCart = await GetOrCreateCartEntityAsync(userId, null, ct);

        foreach (var guestItem in guestCart.Items)
        {
            var userItem = userCart.Items.FirstOrDefault(i => i.ProductId == guestItem.ProductId);
            if (userItem != null)
            {
                userItem.Quantity += guestItem.Quantity;
            }
            else
            {
                userCart.Items.Add(new CartItem
                {
                    CartId = userCart.Id,
                    ProductId = guestItem.ProductId,
                    Quantity = guestItem.Quantity
                });
            }
        }

        userCart.UpdatedAt = DateTime.UtcNow;
        _context.Carts.Remove(guestCart); // حذف سبد خرید مهمان پس از ادغام
        await _context.SaveChangesAsync(ct);

        return await GetCartAsync(userId, null, ct);
    }

    private static CartDto MapToDto(Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            GuestId = cart.GuestId,
            UpdatedAt = cart.UpdatedAt,
            Items = cart.Items.Select(item => new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                Name = item.Product?.Name ?? string.Empty,
                Price = item.Product?.Price ?? 0,
                DiscountPrice = item.Product?.DiscountPrice,
                StockQuantity = item.Product?.StockQuantity ?? 0,
                Unit = item.Product?.Unit ?? "عدد",
                MainImageUrl = item.Product?.Images?.FirstOrDefault(img => img.IsMain)?.Url
                               ?? item.Product?.Images?.FirstOrDefault()?.Url,
                Quantity = item.Quantity
            }).ToList()
        };
    }
}
