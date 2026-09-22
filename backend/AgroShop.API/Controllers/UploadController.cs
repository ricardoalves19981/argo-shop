using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgroShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // فقط ادمین مجاز به آپلود باشد
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("product-images")]
        public async Task<IActionResult> UploadProductImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "هیچ فایلی ارسال نشده است." });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var uploadedUrls = new List<string>();

            // مسیر ذخیره‌سازی داخل wwwroot/uploads/products
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "products");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var file in files)
            {
                if (file.Length == 0) continue;

                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(ext))
                {
                    return BadRequest(new { message = $"فرمت فایل {file.FileName} مجاز نیست. (فقط jpg, png, webp)" });
                }

                // نام یکتا برای فایل جهت جلوگیری از Overwrite شدن
                var uniqueFileName = $"{Guid.NewGuid()}{ext}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // آدرس قابل دسترسی از سمت مرورگر
                var relativeUrl = $"/uploads/products/{uniqueFileName}";
                uploadedUrls.Add(relativeUrl);
            }

            return Ok(new { urls = uploadedUrls });
        }
    }
}
