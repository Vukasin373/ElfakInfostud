using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class GetAllChatPartners
    {
        public class Query : IRequest<Result<List<ChatPartner>>>
        {
            
        }

        public class Handler : IRequestHandler<Query, Result<List<ChatPartner>>>
        {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;
        private readonly IMapper _mapper;
            public Handler(DataContext context, ICurrentUser currentUser, IMapper mapper )
            {
            _mapper = mapper;
            _currentUser = currentUser;
            _context = context;
            }

            public async Task<Result<List<ChatPartner>>> Handle(Query request, CancellationToken cancellationToken)
            {
            var chatUsernames = await _context.Messages
             .Where(m => m.SenderUsername == _currentUser.GetUsername() || m.ReceiverUsername == _currentUser.GetUsername())
            .Select(m => m.SenderUsername == _currentUser.GetUsername() ? m.ReceiverUsername : m.SenderUsername)
            .Distinct()
            .ToListAsync();

            var chatPartners = new List<ChatPartner>();
            foreach (var username  in chatUsernames)
            {
                var profile = await _context.Users.ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider).SingleOrDefaultAsync(x=> x.Username == username);
                var message = await _context.Messages.Where(m => 
                (m.SenderUsername == username && m.ReceiverUsername == _currentUser.GetUsername()) ||
                (m.SenderUsername == _currentUser.GetUsername() && m.ReceiverUsername == username))
                .OrderByDescending(m => m.Time)
                .FirstOrDefaultAsync();
                var chatPartner = new ChatPartner
                {
                    LastMessage = message,
                    Profile = profile
                };
                chatPartners.Add(chatPartner);
            }
            if(chatPartners.Count>1)
                chatPartners = chatPartners.OrderByDescending(cp => cp.LastMessage?.Time).ToList();

            return Result<List<ChatPartner>>.Success(chatPartners);
            }
        }
    }
}