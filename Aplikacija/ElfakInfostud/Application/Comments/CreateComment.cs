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
    public class CreateComment
    {
        public class Command : IRequest<Result<CommentDto>>
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

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
        private readonly DataContext _dataContext;
        private readonly ICurrentUser _currentUser;
        private readonly IMapper _mapper;
            public Handler(DataContext dataContext, ICurrentUser currentUser, IMapper mapper )
            {
            _mapper = mapper;
            _currentUser = currentUser;
            _dataContext = dataContext;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(x=> x.UserName == _currentUser.GetUsername());
                if(user==null) return null;
            
                var post = await _dataContext.Posts.FindAsync(request.PostId);
                if(post == null) return null;

                var comment = new Comment{
                    Content = request.Content,
                    Post = post,
                    User = user
                };

                post.Comments.Add(comment);
                var success = await _dataContext.SaveChangesAsync() > 0;
                if(success)
                    return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
                return Result<CommentDto>.Failure("Problem adding comment");
            }
        }
    }
}