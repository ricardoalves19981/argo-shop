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
    [AllowAnonymous]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterParams filter)
    {
        // ۱. محدود کردن منطقی شماره صفحه و اندازه صفحه
        const int maxPageSize = 50;
        var pageNumber = filter.PageNumber < 1 ? 1 : filter.PageNumber;
        var pageSize = filter.PageSize < 1 ? 12 : Math.Min(filter.PageSize, maxPageSize);

        // ۲. کوئری تمیز بدون Includeهای مازاد چون در Select فیلدها را می‌آوریم
        var query = _context.Products
            .AsNoTracking()
            .AsQueryable();

        // فیلتر دسته‌بندی با شناسه
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

        // فیلتر جستجو در نام تجاری، نام ژنریک، ماده موثره، آفات هدف و گیاهان هدف
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

        // فیلتر قیمت
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

        // شمارش کل آیتم‌های منطبق با فیلتر
        var totalCount = await query.CountAsync();

        // اجرای Paging و پروجکشن DTO
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
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
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            Data = items
        });
    }


    // GET: api/products/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
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


    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // ۱. پیدا کردن محصول به همراه عکس‌های آن
        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "محصول مورد نظر یافت نشد." });
        }

        // ۲. بررسی وجود دسته‌بندی
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "دسته‌بندی مشخص‌شده معتبر نیست." });
        }

        // ۳. بررسی برند در صورت ارسال
        if (dto.BrandId.HasValue && dto.BrandId.Value > 0)
        {
            var brandExists = await _context.Brands.AnyAsync(b => b.Id == dto.BrandId.Value);
            if (!brandExists)
            {
                return BadRequest(new { message = "برند مشخص‌شده معتبر نیست." });
            }
            product.BrandId = dto.BrandId.Value;
        }
        else
        {
            product.BrandId = null;
        }

        // ۴. به‌روزرسانی فیلدهای عمومی و تخصصی
        product.Name = dto.Name;
        product.TechnicalName = dto.TechnicalName;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.StockQuantity = dto.StockQuantity;
        product.Unit = dto.Unit;
        product.IsActive = dto.IsActive;
        product.CategoryId = dto.CategoryId;

        product.ActiveIngredient = dto.ActiveIngredient;
        product.Formulation = dto.Formulation;
        product.TargetPests = dto.TargetPests;
        product.SuitableCrops = dto.SuitableCrops;
        product.UsageInstruction = dto.UsageInstruction;
        product.PreHarvestIntervalDays = dto.PreHarvestIntervalDays;
        product.RegistrationCode = dto.RegistrationCode;

        // ۵. به‌روزرسانی لیست تصاویر (در صورت ارسال لیست جدید)
        if (dto.ImageUrls != null)
        {
            // حذف تصاویر قبلی از دیتابیس
            _context.ProductImages.RemoveRange(product.Images);

            // افزودن تصاویر جدید
            var isFirst = true;
            foreach (var url in dto.ImageUrls)
            {
                product.Images.Add(new ProductImage
                {
                    Url = url,
                    IsMain = isFirst // اولین عکس به عنوان کاور/اصلی در نظر گرفته می‌شود
                });
                isFirst = false;
            }
        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "محصول با موفقیت به‌روزرسانی شد.", productId = product.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطا در به‌روزرسانی محصول: " + ex.Message });
        }
    }


    // DELETE: api/Products/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound(new { message = "محصول مورد نظر یافت نشد." });

        // اگر محصول در سفارشات باشد و کلید خارجی در دیتابیس تعریف شده باشد:
        var hasOrders = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
        if (hasOrders)
        {
            return BadRequest(new
            {
                message = "این محصول در سفارش‌های ثبت‌شده مشتریان وجود دارد و حذف کامل آن باعث اختلال در سوابق مالی می‌شود. می‌توانید محصول را «غیرفعال» کنید."
            });
        }

        // حذف تصاویر و نظرات وابسته و در نهایت حذف خود محصول
        _context.ProductImages.RemoveRange(product.Images);
        _context.Reviews.RemoveRange(product.Reviews);
        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return Ok(new { message = "محصول با موفقیت حذف شد." });
    }
    // PATCH: api/Products/{id}/toggle-active
    [HttpPatch("{id}/toggle-active")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleActive(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "محصول یافت نشد." });

        product.IsActive = !product.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = product.IsActive ? "محصول فعال شد." : "محصول غیرفعال شد.",
            isActive = product.IsActive
        });
    }

}
