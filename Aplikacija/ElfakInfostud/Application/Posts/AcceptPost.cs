using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Posts
{
    public class AcceptPost
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
            _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var post = await _dataContext.Posts.FindAsync(request.Id);
                if(post==null) return null;

                post.Approved = true;
                post.Date = DateTime.Now;
                var success = await _dataContext.SaveChangesAsync() > 0;
                if(success)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to accept post");
            }
        }
    }
}