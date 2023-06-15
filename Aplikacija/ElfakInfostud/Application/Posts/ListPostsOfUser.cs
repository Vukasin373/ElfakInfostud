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
    public class ListPostsOfUser
    {
        public class Query : IRequest<Result<List<PostDto>>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query,Result<List<PostDto>>>
        {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
            _mapper = mapper;
            _context = context;
            }


            public async Task<Result<List<PostDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                    var posts = await _context.Posts.Include(l=>l.Likes).Where(x => x.Author.UserName == request.Username && x.Approved).ProjectTo<PostDto>(_mapper.ConfigurationProvider).OrderByDescending(x=>x.Date).ToListAsync();
                    
                    if(posts == null) return null;
                    return  Result<List<PostDto>>.Success(posts);
            }
            
        }
    }
}