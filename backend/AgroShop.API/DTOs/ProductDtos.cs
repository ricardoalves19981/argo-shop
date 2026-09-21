namespace AgroShop.API.DTOs;

public class ProductListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? TechnicalName { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = "بسته";
    public string? MainImageUrl { get; set; }
    public string? BrandName { get; set; }
    public int? PreHarvestIntervalDays { get; set; }
    public bool IsActive { get; set; }
}

public class ProductDetailDto : ProductListDto
{
    public string Description { get; set; } = string.Empty;
    public string? ActiveIngredient { get; set; }
    public string? Formulation { get; set; }
    public string? TargetPests { get; set; }
    public string? SuitableCrops { get; set; }
    public string? UsageInstruction { get; set; }
    public string? RegistrationCode { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? TechnicalName { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = "بسته";
    public bool IsActive { get; set; } = true;

    public string? ActiveIngredient { get; set; }
    public string? Formulation { get; set; }
    public string? TargetPests { get; set; }
    public string? SuitableCrops { get; set; }
    public string? UsageInstruction { get; set; }
    public int? PreHarvestIntervalDays { get; set; }
    public string? RegistrationCode { get; set; }

    public int CategoryId { get; set; }
    public int? BrandId { get; set; }
    public List<string>? ImageUrls { get; set; }
}

public class ProductFilterParams
{
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Search { get; set; }
    public int? BrandId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStockOnly { get; set; }
    public string? SortBy { get; set; } // price_asc, price_desc, newest
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
