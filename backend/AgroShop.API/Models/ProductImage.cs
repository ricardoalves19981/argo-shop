namespace AgroShop.API.Models;

public class ProductImage
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; } = false;
    public int ProductId { get; set; }
    public Product? Product { get; set; }
}