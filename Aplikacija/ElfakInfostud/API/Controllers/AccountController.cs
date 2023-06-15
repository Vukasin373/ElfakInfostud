using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
     
        public AccountController(UserManager<User> userManager, TokenService tokenService )
        {   
            _tokenService = tokenService;
            _userManager = userManager;
        }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if( await _userManager.Users.AnyAsync(x=>x.Email == registerDto.Email)){
            ModelState.AddModelError("email", "Email is taken");
             return ValidationProblem();
         }

        if(await _userManager.Users.AnyAsync(x=>x.UserName == registerDto.Username)){
                  ModelState.AddModelError("username", "Username is taken");
                    return ValidationProblem();
        }

        var user = new User 
        {
            UserName = registerDto.Username,
            Email = registerDto.Email,
            Role = "User"
        };

        var result = await _userManager.CreateAsync(user,registerDto.Password);
        if(result.Succeeded){
            var userDto = createUserDto(user);
            return userDto;
        }

        return BadRequest(result.Errors);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user =await  _userManager.Users.FirstOrDefaultAsync(x=>x.Email == loginDto.Email);
        if(user==null)
        {
            return Unauthorized();
        }

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if(result)
            return createUserDto(user);

        return Unauthorized();
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetLoggedUser() 
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));
        return createUserDto(user);
    }

    public UserDto createUserDto(User user)
    {
        var userDto = new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            Role = user.Role,
            Image = user.Image,
            About = user.About
        };
        return userDto;
    }
  }
}