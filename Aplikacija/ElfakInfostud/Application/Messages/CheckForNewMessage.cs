using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class CheckForNewMessage
    {
        public class Query : IRequest<Result<int>>
        {

        }

        public class Handler : IRequestHandler<Query,Result<int>>
        {
             private readonly DataContext _context;
             private readonly ICurrentUser _currentUser;
            
            public Handler(DataContext context, ICurrentUser currentUser)
            {
            _currentUser = currentUser;
            _context = context;
            }

            public async Task<Result<int>> Handle(Query request, CancellationToken cancellationToken)
            {
                var numberOfUnseenMessages = await _context.Messages.CountAsync(x=> !x.Seen && x.ReceiverUsername == _currentUser.GetUsername());
            
                return Result<int>.Success(numberOfUnseenMessages);
            }
        
        }
    }
}