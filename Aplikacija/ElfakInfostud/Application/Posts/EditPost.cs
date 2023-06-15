using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class EditPost
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Post Post { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;
            public Handler(DataContext context, IMapper mapper, ICurrentUser currentUser)
            {
            _currentUser = currentUser;
            _mapper = mapper;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync<User>(x=> x.UserName== _currentUser.GetUsername());
                if(user==null)
                    return null;
                var post = await _context.Posts.FindAsync(request.Post.Id);
                if(post==null) return null;

                _mapper.Map(request.Post, post);
               if(user.Role=="User")
                    post.Approved = false;
               else
                    post.Approved = true;

                post.Author = user;
                var success = await _context.SaveChangesAsync() > 0;
                if(success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed editing post");
            }
        }
    }
}