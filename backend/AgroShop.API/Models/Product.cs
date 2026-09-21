namespace AgroShop.API.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;           // نام تجاری فارسی
    public string? TechnicalName { get; set; }                 // نام ژنریک یا فرمول (مانکوزب ۸۰٪ WP)
    public string Description { get; set; } = string.Empty;    // توضیحات
    public decimal Price { get; set; }                         // قیمت اصلی (تومان)
    public decimal? DiscountPrice { get; set; }                // قیمت تخفیف خورده
    public int StockQuantity { get; set; }                     // موجودی
    public string Unit { get; set; } = "بسته";                 // کیلوگرم، لیتر، قوطی، گالن ۲۰ لیتری
    public bool IsActive { get; set; } = true;

    // فیلدهای تخصصی کشاورزی
    public string? ActiveIngredient { get; set; }              // ماده موثره
    public string? Formulation { get; set; }                   // نوع فرمولاسیون: EC, WP, SC, SL
    public string? TargetPests { get; set; }                   // آفات هدف (کرم سیب، شته، قارچ سفیدک)
    public string? SuitableCrops { get; set; }                 // محصولات هدف (پسته، مرکبات، گوجه‌فرنگی)
    public string? UsageInstruction { get; set; }              // دستور و دوز مصرف (مثلا: ۲ در هزار)
    public int? PreHarvestIntervalDays { get; set; }          // دوره کارنس (روز)
    public string? RegistrationCode { get; set; }              // شماره ثبت کود یا سم در سازمان حفظ نباتات

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ارتباطات
    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public int? BrandId { get; set; }
    public Brand? Brand { get; set; }

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}