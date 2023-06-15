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
    public class ReadAllMessages
    {
   
        public class Command : IRequest<Result<NumOfSeenMessageAndLastMessage>>
        {
            public string MyUsername { get; set; }
            public string Username { get; set; }
            public string ChatName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<NumOfSeenMessageAndLastMessage>>
        {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;
            public Handler(DataContext context,ICurrentUser currentUser)
            {
            _currentUser = currentUser;
            _context = context;
            }

            public async Task<Result<NumOfSeenMessageAndLastMessage>> Handle(Command request, CancellationToken cancellationToken)
            {
                var loggedUser = await _context.Users.FirstOrDefaultAsync(x=>x.UserName==request.MyUsername);

                var messages = await _context.Messages.Where(x=> x.SenderUsername== request.Username && x.ReceiverUsername==loggedUser.UserName && !x.Seen).ToListAsync();
                foreach (var message in messages) {
                        message.Seen = true;
                }
                    
                
                await _context.SaveChangesAsync() ;

                var lastMessage = await _context.Messages
               .Where(x => 
                 (x.SenderUsername == request.Username && x.ReceiverUsername == loggedUser.UserName) ||
                  (x.SenderUsername == loggedUser.UserName && x.ReceiverUsername == request.Username))
                 .OrderByDescending(x => x.Time)
                 .FirstOrDefaultAsync();
                 
                    var numOfSeenMessageLastMessage = new NumOfSeenMessageAndLastMessage {
                       Num = messages.Count,
                       LastMessage = lastMessage
                    };
                    return Result<NumOfSeenMessageAndLastMessage>.Success(numOfSeenMessageLastMessage);

              
            }
        }
    }
 }
