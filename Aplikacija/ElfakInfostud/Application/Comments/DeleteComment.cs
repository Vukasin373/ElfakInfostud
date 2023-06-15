using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Comments
{
    public class DeleteComment
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _dataContext;
            public Handler(DataContext dataContext )
            {
            _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var comment = await _dataContext.Comments.FindAsync(request.Id);
                _dataContext.Remove(comment);
                var success  = await _dataContext.SaveChangesAsync() > 0;
                if(success)
                return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem deleting comment");
            }
        }
    }
}