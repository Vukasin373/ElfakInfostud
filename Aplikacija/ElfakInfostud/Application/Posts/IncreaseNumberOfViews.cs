using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Posts
{
    public class IncreaseNumberOfViews
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var post =await  _context.Posts.FindAsync(request.Id);
                if(post==null)
                    return null;
                
                post.NumberOfViews++;

                var success = await _context.SaveChangesAsync() > 0;
                if(success)
                    return Result<Unit>.Success(Unit.Value);
                else
                    return Result<Unit>.Failure("Problem with increasing the number of views for post");
            }
        }
    }
}