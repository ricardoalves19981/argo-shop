using AgroShop.API.Data;
using AgroShop.API.DTOs;
using AgroShop.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroShop.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Categories
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ImageUrl = c.ImageUrl,
                ParentId = c.ParentId
            })
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/Categories/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .Include(c => c.SubCategories)
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ImageUrl = c.ImageUrl,
                ParentId = c.ParentId,
                SubCategories = c.SubCategories.Select(sub => new CategoryDto
                {
                    Id = sub.Id,
                    Name = sub.Name,
                    Slug = sub.Slug,
                    ImageUrl = sub.ImageUrl,
                    ParentId = sub.ParentId
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound(new { message = "دسته‌بندی یافت نشد." });

        return Ok(category);
    }

    // POST: api/Categories
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "نام دسته‌بندی الزامی است." });

        var category = new Category
        {
            Name = dto.Name,
            Slug = string.IsNullOrWhiteSpace(dto.Slug)
                ? dto.Name.Trim().Replace(" ", "-").ToLower()
                : dto.Slug.Trim().Replace(" ", "-").ToLower(),
            ImageUrl = dto.ImageUrl,
            ParentId = dto.ParentId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }




    // DELETE: api/Categories/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return NotFound(new { message = "دسته‌بندی یافت نشد." });

        if (category.Products.Any())
            return BadRequest(new { message = "این دسته‌بندی دارای محصول است و امکان حذف مستقیم آن وجود ندارد." });

        if (category.SubCategories.Any())
            return BadRequest(new { message = "این دسته‌بندی دارای زیردسته است. ابتدا زیردسته‌ها را حذف کنید." });

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(new { message = "دسته‌بندی با موفقیت حذف شد." });
    }


}
