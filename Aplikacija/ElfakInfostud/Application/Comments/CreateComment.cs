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
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Comments
{
    public class CreateComment
    {
        public class Command : IRequest<Result<CommentNotificationDto>>
        {
            public string Content { get; set; }
            public Guid PostId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c=>c.Content).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentNotificationDto>>
        {
        private readonly DataContext _dataContext;
        private readonly ICurrentUser _currentUser;
        private readonly IMapper _mapper;
    
        private readonly ILogger<Handler> _logger;
            public Handler(DataContext dataContext, ICurrentUser currentUser, IMapper mapper, ILogger<Handler> _loggerr )
            {
            _mapper = mapper;
            _currentUser = currentUser;
            _dataContext = dataContext;
             _logger = _loggerr;
            }

            public async Task<Result<CommentNotificationDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(x=> x.UserName == _currentUser.GetUsername());
                if(user==null) return null;
            
                var post = await _dataContext.Posts.Include(p=>p.Author).FirstOrDefaultAsync(x=> x.Id == request.PostId);
                if(post == null) return null;

                var comment = new Comment{
                    Id = Guid.NewGuid().ToString(),
                    Content = request.Content,
                    Post = post,
                    User = user
                };

                //post.Comments.Add(comment);
              
                //var success = await _dataContext.SaveChangesAsync() > 0;
                //if(success)
                //{
                    if(user.UserName!= post.Author.UserName)
                    {
                        var notification = new Notification
                        {
                            Id = Guid.NewGuid().ToString(),
                            Comment = comment.Content,
                            ReceiverUsername = post.Author.UserName,
                            SenderUsername = user.UserName,
                            PostId = post.Id
                        };
                        var commentNotificationDto = new CommentNotificationDto
                        {
                            
                            Comment = _mapper.Map<CommentDto>(comment),
                            Notification = notification,
                            PostId = post.Id  
                        };
                        return Result<CommentNotificationDto>.Success(commentNotificationDto);
                    }
                    else
                    {
                        var commentNotificationDto = new CommentNotificationDto
                        {
                            Comment = _mapper.Map<CommentDto>(comment),
                            Notification = null,
                            PostId = post.Id
                        };
                        return Result<CommentNotificationDto>.Success(commentNotificationDto);
                    }
                //}

                
            }
        }
    }
}