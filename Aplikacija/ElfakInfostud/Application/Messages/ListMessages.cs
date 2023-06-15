using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class ListMessages
    {
        public class Query : IRequest<Result<List<Message>>>
        {
            public string   ChatName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Message>>>
        {
        private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
         
            _dataContext = dataContext;
            }

            public async Task<Result<List<Message>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var messages = await _dataContext.Messages.Where(p=> p.ChatName == request.ChatName).ToListAsync();

                return Result<List<Message>>.Success(messages);
            }
        }
    }
}