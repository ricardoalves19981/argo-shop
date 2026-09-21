namespace AgroShop.API.Services;

using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;

public interface IPaymentService
{
    Task<string?> RequestPaymentAsync(int orderId, decimal amount, string description, string callbackUrl);
    Task<bool> VerifyPaymentAsync(string authority, decimal amount);
    string GetPaymentGatewayUrl(string authority);
}

public class ZarinPalService : IPaymentService
{
    private readonly string _baseUrl;
    private readonly bool _isSandbox;
    private readonly IConfiguration _config;
    private readonly string _merchantId;
    private readonly HttpClient _httpClient;
    private readonly ILogger<ZarinPalService> _logger;

    public ZarinPalService(IConfiguration config, HttpClient httpClient, ILogger<ZarinPalService> logger)
    {
        _config = config;
        _httpClient = httpClient;
        _logger = logger;

        _merchantId = _config["ZarinPal:MerchantId"] ?? "00000000-0000-0000-0000-000000000000";
        _isSandbox = config.GetValue<bool>("ZarinPal:IsSandbox");

        // نکته مهم: ساب‌دومین سندباکس در زرین‌پال v4
        _baseUrl = _isSandbox ? "https://sandbox.zarinpal.com" : "https://api.zarinpal.com";
    }

    public async Task<string?> RequestPaymentAsync(int orderId, decimal amount, string description, string callbackUrl)
    {
        var url = $"{_baseUrl}/pg/v4/payment/request.json";

        // مبلغ در زرین‌پال باید عدد صحیح باشد
        var intAmount = Convert.ToInt64(amount);

        var payload = new
        {
            merchant_id = _merchantId,
            amount = intAmount,
            description = string.IsNullOrWhiteSpace(description) ? $"Order #{orderId}" : description,
            callback_url = callbackUrl,
            metadata = new { order_id = orderId.ToString() }
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, payload);
            var responseString = await response.Content.ReadAsStringAsync();

            // لاگ در خروجی کنسول برای مشاهده پاسخ دقیق زرین‌پال
            _logger.LogInformation("ZarinPal Response ({StatusCode}): {Response}", response.StatusCode, responseString);

            var result = await response.Content.ReadFromJsonAsync<ZarinPalResponse>();

            if (result?.Data?.Code == 100 && !string.IsNullOrEmpty(result.Data.Authority))
            {
                return result.Data.Authority;
            }

            _logger.LogWarning("ZarinPal Request Failed with code: {Code}", result?.Data?.Code);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while connecting to ZarinPal");
        }

        return null;
    }

    public async Task<bool> VerifyPaymentAsync(string authority, decimal amount)
    {
        var url = $"{_baseUrl}/pg/v4/payment/verify.json";

        var payload = new
        {
            merchant_id = _merchantId,
            amount = Convert.ToInt64(amount),
            authority = authority
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, payload);
            var result = await response.Content.ReadFromJsonAsync<ZarinPalVerifyResponse>();

            return result?.Data?.Code == 100 || result?.Data?.Code == 101;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while verifying ZarinPal payment");
            return false;
        }
    }

    public string GetPaymentGatewayUrl(string authority)
    {
        return $"{_baseUrl}/pg/StartPay/{authority}";
    }
}

// --- ساختارهای داده Response ---
public class ZarinPalResponse
{
    [JsonPropertyName("data")]
    public ZarinPalData? Data { get; set; }

    [JsonPropertyName("errors")]
    public object? Errors { get; set; }
}

public class ZarinPalData
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("authority")]
    public string? Authority { get; set; }

    [JsonPropertyName("fee_type")]
    public string? FeeType { get; set; }

    [JsonPropertyName("fee")]
    public int Fee { get; set; }
}

public class ZarinPalVerifyResponse
{
    [JsonPropertyName("data")]
    public ZarinPalVerifyData? Data { get; set; }

    [JsonPropertyName("errors")]
    public object? Errors { get; set; }
}

public class ZarinPalVerifyData
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("ref_id")]
    public long RefId { get; set; }
}
