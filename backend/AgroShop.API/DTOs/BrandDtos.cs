namespace AgroShop.API.DTOs;

public class BrandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? LogoUrl { get; set; }
    public int ProductsCount { get; set; }
}

public class CreateBrandDto
{
    public string Name { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? LogoUrl { get; set; }
}
