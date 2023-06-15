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
    public class DeleteMessage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
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
                var mess = await _context.Messages.FirstOrDefaultAsync(x=> x.Id== request.Id);
                 _context.Messages.Remove(mess);

                 await _context.SaveChangesAsync();

                 return Result<Unit>.Success(Unit.Value);

            
            }
        }
    }
}