using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class PromoteToAdministrator
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
            _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(x=> x.UserName == request.Username);
                if(user==null) return null;
                
                user.Role = "Administrator";
                var success = await _dataContext.SaveChangesAsync() > 0;
                if(success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem promoting user to administrator");
            }
        }
    }
}