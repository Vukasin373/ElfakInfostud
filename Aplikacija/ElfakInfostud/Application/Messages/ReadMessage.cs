using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class ReadMessage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
            public string ChatName { get; set; }
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
                var message = await _context.Messages.FirstOrDefaultAsync(x=>x.Id == request.Id);
                message.Seen = true;
                var success = await _context.SaveChangesAsync() > 0;
                if(success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem reading message");
            }
        }
    }
}