using AgroShop.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AgroShop.API.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // حتماً این بخش را بررسی کنید:
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany() // یا .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .IsRequired(); // اینجا UserId باید به این کلید خارجی وصل باشد
        // تنظیم دقت قیمت‌ها
        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasPrecision(18, 2);

        // تنظیمات دقت اعشار برای مقادیر مالی در دیتابیس
        modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Product>().Property(p => p.DiscountPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");

        // ۱. دیتای نمونه برندها
        modelBuilder.Entity<Brand>().HasData(
            new Brand { Id = 1, Name = "سینجنتا (Syngenta)", Country = "سوئیس" },
            new Brand { Id = 2, Name = "بایر (Bayer)", Country = "آلمان" },
            new Brand { Id = 3, Name = "گل سم گرگان", Country = "ایران" }
        );

        // ۲. دیتای نمونه دسته‌بندی‌ها
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "کودهای شیمیایی و تقویتی", Slug = "fertilizers" },
            new Category { Id = 2, Name = "سموم قارچ‌کش", Slug = "fungicides" },
            new Category { Id = 3, Name = "سموم حشره‌کش و کنه‌کش", Slug = "insecticides" },
            new Category { Id = 4, Name = "علف‌کش‌ها", Slug = "herbicides" }
        );

        // ۳. دیتای نمونه محصولات تخصصی کشاورزی
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                CategoryId = 1,
                BrandId = 1,
                Name = "کود کامل ۲۰-۲۰-۲۰ هیدروکوپولا",
                TechnicalName = "NPK 20-20-20 + Micro",
                Description = "کود پودری ماکرو با انحلال ۱۰۰٪ در آب، حاوی آهن و منگنز کلاته EDTA مناسب تمام فصول رشد.",
                Price = 850000,
                StockQuantity = 50,
                Unit = "بسته ۲ کیلوگرمی",
                ActiveIngredient = "نیتروژن کل ۲۰٪، فسفر قابل جذب ۲۰٪، پتاسیم محلول ۲۰٪",
                Formulation = "SP",
                SuitableCrops = "پسته، باغات مرکبات، مزارع گوجه‌فرنگی و برنج",
                UsageInstruction = "۲ تا ۳ کیلوگرم در هزار لیتر آب بصورت محلول‌پاشی یا ۱۰ کیلوگرم در هکتار در آبیاری"
            },
            new Product
            {
                Id = 2,
                CategoryId = 2,
                BrandId = 3,
                Name = "قارچ‌کش مانکوزب ۸۰٪",
                TechnicalName = "Mancozeb 80% WP",
                Description = "قارچ‌کش تماسی با اثر حفاظتی علیه طیف گسترده‌ای از بیماری‌های قارچی از جمله سفیدک دروغی و لکه موجی.",
                Price = 320000,
                StockQuantity = 100,
                Unit = "بسته ۱ کیلوگرمی",
                ActiveIngredient = "مانکوزب ۸۰٪",
                Formulation = "WP",
                SuitableCrops = "سیب‌زمینی، گوجه‌فرنگی، انگور و خیار",
                UsageInstruction = "۲ کیلوگرم در هزار لیتر آب با مشاهده اولین علائم",
                PreHarvestIntervalDays = 7
            },
            new Product
            {
                Id = 3,
                CategoryId = 3,
                BrandId = 2,
                Name = "حشره‌کش کنفیدور (ایمیداکلوپراید)",
                TechnicalName = "Imidacloprid 35% SC",
                Description = "حشره‌کش سیستمیک عالی برای کنترل آفات مکنده مانند شته، مگس سفید و زنجرک با ماندگاری بالا.",
                Price = 490000,
                StockQuantity = 40,
                Unit = "بطری نیم لیتری",
                ActiveIngredient = "ایمیداکلوپراید ۳۵۰ گرم بر لیتر",
                Formulation = "SC",
                SuitableCrops = "مرکبات، پسته، پنبه و تنباکو",
                UsageInstruction = "۰.۵ در هزار لیتر آب بصورت سمپاشی برگ‌ها",
                PreHarvestIntervalDays = 14
            }
        );

        // ۴. دیتای نمونه تصاویر محصولات
        modelBuilder.Entity<ProductImage>().HasData(
            new ProductImage { Id = 1, ProductId = 1, Url = "https://placehold.co/600x600/2e7d32/white?text=NPK+20-20-20", IsMain = true },
            new ProductImage { Id = 2, ProductId = 2, Url = "https://placehold.co/600x600/1565c0/white?text=Mancozeb", IsMain = true },
            new ProductImage { Id = 3, ProductId = 3, Url = "https://placehold.co/600x600/c62828/white?text=Confidor", IsMain = true }
        );
    }
}
