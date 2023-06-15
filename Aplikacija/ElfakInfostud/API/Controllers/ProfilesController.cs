using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ProfilesController : BaseController
    {

    [HttpGet("{username}")]
    public async Task<ActionResult> GetProfile(string username)
    {
          return GetResult(await Mediator.Send(new GetProfile.Query{Username = username}));
    }

        
    [HttpDelete("{username}")]
    public async Task<ActionResult> DeleteUser(string username)
    {
        return GetResult(await Mediator.Send(new DeleteProfile.Command{Username = username}));
    } 

    [HttpPut("{username}")]
    public async Task<ActionResult> PromoteToAdministrator(string username) 
    {
        return GetResult(await Mediator.Send(new PromoteToAdministrator.Command{Username = username}));
    }

     [HttpPut("setAbout/{username}/{about}")]
    public async Task<ActionResult> SetAbout(string username, string about)   
    {
        return GetResult(await Mediator.Send(new SetAbout.Command { About = about, Username = username }));
    }
        
    }
}