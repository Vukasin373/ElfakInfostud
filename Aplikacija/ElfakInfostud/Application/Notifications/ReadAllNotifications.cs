using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Notifications
{
    public class ReadAllNotifications
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Username { get; set; }
            public int NewNumOfViewedNotifications { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
                this._dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(x=>x.UserName == request.Username);
                if(user==null)
                    return null;
                user.ViewedNotificationsCount = request.NewNumOfViewedNotifications;
                await _dataContext.SaveChangesAsync();

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}