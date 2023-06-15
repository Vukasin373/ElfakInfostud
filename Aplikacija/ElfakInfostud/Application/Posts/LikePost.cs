using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class LikePost
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid  PostId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;
            public Handler(DataContext context,ICurrentUser currentUser)
            {
            _currentUser = currentUser;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
               var user = await _context.Users.FirstOrDefaultAsync(x=> x.UserName==_currentUser.GetUsername() );
               if(user==null) return null;
               var post = await _context.Posts.FirstOrDefaultAsync(x=>x.Id==request.PostId);
               if(post==null) return null;

                var like = await _context.Likes.FirstOrDefaultAsync(p=>p.Post.Id == post.Id && p.User.Id == user.Id);
                if(like==null)
                {

                    var newlike = new Like
                    {
                        Post = post,
                        User = user
                    };
                    _context.Likes.Add(newlike);
                }
                else 
                    _context.Likes.Remove(like);

                var success = await _context.SaveChangesAsync() > 0;

                if(success)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to like/dislike");
            }
        }
    }
}