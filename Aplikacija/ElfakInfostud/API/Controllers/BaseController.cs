using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Core;
using MediatR;
using API.Extensions;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator??= HttpContext.RequestServices.GetService<IMediator>();
        
        protected ActionResult GetResult<T>(Result<T> result)
        {
            if(result==null)
                return NotFound();
            if(result.IsSuccess && result.Value!=null)
                return Ok(result.Value);
            if(result.IsSuccess && result.Value ==null)
                return NotFound();
            
            return BadRequest(result.Error);
        }

        protected ActionResult GetPagedResult<T>(Result<PagedList<T>> result)
        {
            if(result==null)
                return NotFound();
            if(result.IsSuccess && result.Value!=null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize, result.Value.TotalCount, result.Value.TotalPages);
                return Ok(result.Value);
            }
            if(result.IsSuccess && result.Value ==null)
                return NotFound();
            
            return BadRequest(result.Error);
        }
    }
}