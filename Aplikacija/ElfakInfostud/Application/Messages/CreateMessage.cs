using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class CreateMessage
    {
        public class Command : IRequest<Result<Message>>
        {
            public string Content { get; set; }
            public string ChatName  { get; set; }
            public string SenderUsername { get; set; }
            public string ReceiverUsername { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c=>c.Content).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Message>>
        {
        private readonly DataContext _dataContext;
        private readonly ICurrentUser _currentUser;
   
            public Handler(DataContext dataContext, ICurrentUser currentUser )
            {
           
            _currentUser = currentUser;
            _dataContext = dataContext;
            }

            public async Task<Result<Message>> Handle(Command request, CancellationToken cancellationToken)
            {
                var mess = new Message {
                    Content = request.Content,
                    ChatName = request.ChatName,
                    SenderUsername = request.SenderUsername,
                    ReceiverUsername = request.ReceiverUsername,
                    Seen = false
                };
                _dataContext.Messages.Add(mess);
                var success = await _dataContext.SaveChangesAsync() >0;
                if(success)
                    return Result<Message>.Success(mess);
                return Result<Message>.Failure("Problem adding comment");
            }
        }
    }
}