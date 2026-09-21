using AgroShop.API.DTOs.Cart;
using AgroShop.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgroShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private string? GetUserId()
    {
        return User?.Identity?.IsAuthenticated == true
            ? User.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;
    }

    private string? GetGuestId()
    {
        if (Request.Headers.TryGetValue("X-Guest-Id", out var guestIdValue))
        {
            var guestId = guestIdValue.ToString().Trim();
            return string.IsNullOrWhiteSpace(guestId) ? null : guestId;
        }
        return null;
    }

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart(CancellationToken ct)
    {
        var result = await _cartService.GetCartAsync(GetUserId(), GetGuestId(), ct);
        return Ok(result);
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> UpsertItem([FromBody] UpsertCartItemRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _cartService.UpsertItemAsync(GetUserId(), GetGuestId(), request, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("items/{productId:int}")]
    public async Task<ActionResult<CartDto>> RemoveItem([FromRoute] int productId, CancellationToken ct)
    {
        var result = await _cartService.RemoveItemAsync(GetUserId(), GetGuestId(), productId, ct);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<ActionResult<CartDto>> Clear(CancellationToken ct)
    {
        var result = await _cartService.ClearAsync(GetUserId(), GetGuestId(), ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("merge")]
    public async Task<ActionResult<CartDto>> Merge([FromBody] MergeCartRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var result = await _cartService.MergeGuestIntoUserAsync(userId, request.GuestId, ct);
        return Ok(result);
    }
}
