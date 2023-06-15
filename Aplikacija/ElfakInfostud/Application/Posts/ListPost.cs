using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class ListPost 
    {
        public class Query : IRequest<Result<PagedList<PostDto>>>
        {
            public string Approved { get; set; }
            public PostParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query,Result<PagedList<PostDto>>>
        {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
            _mapper = mapper;
            _context = context;
            }


            public async Task<Result<PagedList<PostDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                    var query = default(IQueryable<PostDto>);
                    
                    if(request.Approved == "true")
                        query =  _context.Posts.Include(l=>l.Likes).Where(x=>x.Approved).ProjectTo<PostDto>(_mapper.ConfigurationProvider).OrderByDescending(x=>x.Date).AsQueryable();
                    else
                       query =  _context.Posts.Include(l=>l.Likes).Where(x=>!x.Approved).ProjectTo<PostDto>(_mapper.ConfigurationProvider).OrderByDescending(x=>x.Date).AsQueryable();
                    
                    if(request.Approved == "true" && request.Params.Kategorija != "svi") {
                        query = query.Where(x => x.Category == request.Params.Kategorija);
                    }
                    
                    if(query == null) return null;
                    return  Result<PagedList<PostDto>>.Success(
                        await PagedList<PostDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                    );
            }
            
        }
    }
}