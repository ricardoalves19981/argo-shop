using AgroShop.API.Data;
using AgroShop.API.DTOs;
using AgroShop.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroShop.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BrandsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BrandsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Brands
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var brands = await _context.Brands
            .AsNoTracking()
            .Select(b => new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
                Country = b.Country,
                LogoUrl = b.LogoUrl,
                ProductsCount = b.Products.Count
            })
            .ToListAsync();

        return Ok(brands);
    }

    // GET: api/Brands/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var brand = await _context.Brands
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
                Country = b.Country,
                LogoUrl = b.LogoUrl,
                ProductsCount = b.Products.Count
            })
            .FirstOrDefaultAsync();

        if (brand == null)
            return NotFound(new { message = "برند یافت نشد." });

        return Ok(brand);
    }

    // POST: api/Brands
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateBrandDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "نام برند الزامی است." });

        var brand = new Brand
        {
            Name = dto.Name,
            Country = dto.Country,
            LogoUrl = dto.LogoUrl
        };

        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = brand.Id }, brand);
    }

    // DELETE: api/Brands/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var brand = await _context.Brands
            .Include(b => b.Products)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (brand == null)
            return NotFound(new { message = "برند یافت نشد." });

        if (brand.Products.Any())
            return BadRequest(new { message = "این برند دارای محصول فعال است و نمی‌توان آن را حذف کرد." });

        _context.Brands.Remove(brand);
        await _context.SaveChangesAsync();

        return Ok(new { message = "برند با موفقیت حذف شد." });
    }

}
