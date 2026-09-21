using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using AgroShop.API.Data;
using AgroShop.API.Models;
using AgroShop.API.DTOs;

namespace AgroShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterParams filter)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .Where(p => p.IsActive)
            .AsNoTracking()
            .AsQueryable();

        // فیلتر دسته‌بندی با ID
        if (filter.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
        }

        // فیلتر نام دسته‌بندی
        if (!string.IsNullOrWhiteSpace(filter.CategoryName))
        {
            var catTerm = filter.CategoryName.Trim();
            query = query.Where(p => p.Category != null && p.Category.Name.Contains(catTerm));
        }

        // فیلتر جستجو در نام، نام ژنریک، ماده موثره و آفات هدف
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var term = filter.Search.Trim();
            query = query.Where(p =>
                p.Name.Contains(term) ||
                (p.TechnicalName != null && p.TechnicalName.Contains(term)) ||
                (p.ActiveIngredient != null && p.ActiveIngredient.Contains(term)) ||
                (p.TargetPests != null && p.TargetPests.Contains(term)) ||
                (p.SuitableCrops != null && p.SuitableCrops.Contains(term)));
        }

        // فیلتر برند
        if (filter.BrandId.HasValue)
        {
            query = query.Where(p => p.BrandId == filter.BrandId.Value);
        }

        // فیلتر حداقل و حداکثر قیمت
        if (filter.MinPrice.HasValue)
        {
            query = query.Where(p => (p.DiscountPrice ?? p.Price) >= filter.MinPrice.Value);
        }
        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(p => (p.DiscountPrice ?? p.Price) <= filter.MaxPrice.Value);
        }

        // فیلتر موجودی
        if (filter.InStockOnly == true)
        {
            query = query.Where(p => p.StockQuantity > 0);
        }

        // مرتب‌سازی
        query = filter.SortBy switch
        {
            "price_asc" => query.OrderBy(p => p.DiscountPrice ?? p.Price),
            "price_desc" => query.OrderByDescending(p => p.DiscountPrice ?? p.Price),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.Id)
        };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(p => new ProductListDto
            {
                Id = p.Id,
                Name = p.Name,
                TechnicalName = p.TechnicalName,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                StockQuantity = p.StockQuantity,
                Unit = p.Unit,
                MainImageUrl = p.Images
    .OrderByDescending(i => i.IsMain)
    .ThenBy(i => i.Id)
    .Select(i => i.Url)
    .FirstOrDefault(),

                BrandName = p.Brand != null ? p.Brand.Name : null,
                PreHarvestIntervalDays = p.PreHarvestIntervalDays,
                IsActive = p.IsActive
            })
            .ToListAsync();

        return Ok(new
        {
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize),
            Data = items
        });
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var p = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Brand)
            .Include(x => x.Images)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p == null)
            return NotFound(new { message = "محصول مورد نظر یافت نشد." });

        var dto = new ProductDetailDto
        {
            Id = p.Id,
            Name = p.Name,
            TechnicalName = p.TechnicalName,
            Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            Price = p.Price,
            DiscountPrice = p.DiscountPrice,
            StockQuantity = p.StockQuantity,
            Unit = p.Unit,
            BrandName = p.Brand != null ? p.Brand.Name : null,
            MainImageUrl = p.Images
    .OrderByDescending(i => i.IsMain)
    .ThenBy(i => i.Id)
    .Select(i => i.Url)
    .FirstOrDefault(),

            ImageUrls = p.Images
    .OrderByDescending(i => i.IsMain)
    .ThenBy(i => i.Id)
    .Select(i => i.Url)
    .ToList(),

            ActiveIngredient = p.ActiveIngredient,
            Formulation = p.Formulation,
            TargetPests = p.TargetPests,
            SuitableCrops = p.SuitableCrops,
            UsageInstruction = p.UsageInstruction,
            PreHarvestIntervalDays = p.PreHarvestIntervalDays,
            RegistrationCode = p.RegistrationCode,
            CreatedAt = p.CreatedAt,
            IsActive = p.IsActive
        };

        return Ok(dto);
    }

    // POST: api/products
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = new Product
        {
            Name = dto.Name,
            TechnicalName = dto.TechnicalName,
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            StockQuantity = dto.StockQuantity,
            Unit = dto.Unit,
            IsActive = dto.IsActive,
            CategoryId = dto.CategoryId,
            BrandId = dto.BrandId,
            ActiveIngredient = dto.ActiveIngredient,
            Formulation = dto.Formulation,
            TargetPests = dto.TargetPests,
            SuitableCrops = dto.SuitableCrops,
            UsageInstruction = dto.UsageInstruction,
            PreHarvestIntervalDays = dto.PreHarvestIntervalDays,
            RegistrationCode = dto.RegistrationCode,
            CreatedAt = DateTime.UtcNow
        };

        if (dto.ImageUrls != null && dto.ImageUrls.Any())
        {
            var distinct = dto.ImageUrls
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .Distinct()
                .ToList();

            for (var i = 0; i < distinct.Count; i++)
            {
                product.Images.Add(new ProductImage
                {
                    Url = distinct[i],
                    IsMain = i == 0
                });
            }
        }


        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }
}
