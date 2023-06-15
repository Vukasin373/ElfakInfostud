using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts
{
    public class CreatePost
    {
        public class  Command : IRequest<Result<Unit>>
        {
            public Post Post { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Post).SetValidator(new ValidatorPost());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;
            public Handler(DataContext context, ICurrentUser currentUser)
            {
            _currentUser = currentUser;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync<User>(x=> x.UserName == _currentUser.GetUsername());
                if(user==null)
                    return null;
                request.Post.Author = user;
                if(user.Role=="User")
                    request.Post.Approved = false;
                else
                    request.Post.Approved = true;
                    
                _context.Posts.Add(request.Post);
                var success = await _context.SaveChangesAsync() > 0;
                if(success)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed creating post");
            }
        }
    }
}