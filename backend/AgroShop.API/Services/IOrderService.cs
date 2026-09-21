namespace AgroShop.API.Services;

using AgroShop.API.DTOs;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderFromCartAsync(string userId, CreateOrderDto dto);
    Task<List<OrderResponseDto>> GetUserOrdersAsync(string userId);
    Task<OrderResponseDto?> GetOrderByIdAsync(int orderId, string userId);
}
