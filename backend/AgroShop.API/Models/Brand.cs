namespace AgroShop.API.Models;

public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;      // مثلا: سینجنتا، بایر، گل سم
    public string? Country { get; set; }                  // کشور سازنده: ایران، سوئیس، آلمان
    public string? LogoUrl { get; set; }
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
