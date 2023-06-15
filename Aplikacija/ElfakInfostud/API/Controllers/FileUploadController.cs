using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FileUploadController : BaseController
    {
        private readonly IWebHostEnvironment _environment;
         private readonly string _uploadsFolder;

        public FileUploadController(IWebHostEnvironment environment )
        {
            _environment = environment;
            _uploadsFolder = Path.Combine(environment.WebRootPath, "uploads");
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, [FromForm] string folder)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file");
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath, folder);
            Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok("File uploaded successfully");
        }

            [HttpGet("vrati/{imeFoldera}/{imeFajla}")]
            public IActionResult GetFile(string imeFoldera, string imeFajla)
            {
                string filePath = Path.Combine(imeFoldera, imeFajla);

                return File(filePath, "application/pdf", imeFajla);
            }

            [HttpGet("fajlovi/{imeFoldera}")]
            public IActionResult GetFileNames(string imeFoldera)
            {
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imeFoldera);
                string[] fileNames = Directory.GetFiles(uploadsFolder).Select(Path.GetFileName).ToArray();

                return Ok(fileNames);
            }
    }
}