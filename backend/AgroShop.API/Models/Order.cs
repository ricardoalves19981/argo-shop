namespace AgroShop.API.Models;

public enum OrderStatus
{
    Pending = 0,      // در انتظار پرداخت
    Paid = 1,         // پرداخت شده و در حال پردازش
    Shipped = 2,      // ارسال شده با باربری/پست
    Delivered = 3,    // تحویل داده شده
    Cancelled = 4     // لغو شده
}

public enum PaymentMethod
{
    Online = 1,       // درگاه بانکی
    CardToCard = 2    // کارت به کارت
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = Guid.NewGuid().ToString("N")[..8].ToUpper(); // شماره سفارش رندوم ۸ رقمی
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;


    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }


    // اطلاعات آدرس ثبت‌شده زمان خرید (حفظ آدرس حتی در صورت تغییر آدرس پروفایل)
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverPhone { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Online;
    public string? PaymentTrackingCode { get; set; }           // کد پیگیری درگاه یا فیش
    public string? AdminNotes { get; set; }                    // یادداشت باربری یا مدیر
                                                               // در کلاس Order.cs
    public string? Authority { get; set; } // برای ذخیره کد رهگیری اولیه درگاه
    public string? RefId { get; set; }     // برای ذخیره کد نهایی تایید شده توسط بانک

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}


