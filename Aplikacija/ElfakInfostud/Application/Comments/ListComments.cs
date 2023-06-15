using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class ListComments
    {
        public class Query : IRequest<Result<List<CommentDto>>>
        {
            public Guid PostId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
            _mapper = mapper;
            _dataContext = dataContext;
            }

            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _dataContext.Comments.Where(p=> p.Post.Id == request.PostId).OrderByDescending(t=>t.Time).ProjectTo<CommentDto>(_mapper.ConfigurationProvider).ToListAsync();

                return Result<List<CommentDto>>.Success(comments);
            }
        }
    }
}