using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
      [AllowAnonymous]
    public class PhotoUploadController : BaseController
    {
         private readonly IWebHostEnvironment _environment;
         private readonly string _uploadsFolder;
        private readonly ICurrentUser _currentUser;
        private readonly DataContext _context;

        public PhotoUploadController(IWebHostEnvironment environment, ICurrentUser currentUser, DataContext context )
        {
            _context = context;
            _currentUser = currentUser;
            _environment = environment;
            _uploadsFolder = Path.Combine(environment.WebRootPath, "images");
        }

        [HttpPost("uploadImage/{username}")]
        public async Task<IActionResult> Upload(string username,IFormFile image)
        {
            using (var ms = new MemoryStream())
        {
            await image.CopyToAsync(ms);
            var imageData = ms.ToArray();
            var base64String = Convert.ToBase64String(imageData);

          

            var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName==username);
            user.Image = base64String;
            await _context.SaveChangesAsync();
            return Ok(user.Image);
        }
        }

           
    }
}