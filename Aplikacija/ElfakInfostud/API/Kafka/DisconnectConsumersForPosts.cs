using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Confluent.Kafka;
using Confluent.Kafka.Admin;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API.Kafka
{
    public class DisconnectConsumersForPosts
    {
        public class Query : IRequest<Result<Unit>>
        {
            public string Username { get; set; }
          
        }

        public class Handler : IRequestHandler<Query, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IKafkaService _kafkaService;
            private readonly ILogger<Handler> _logger;
            public Handler(ILogger<Handler> _loggerr, DataContext dataContext,IKafkaService kafkaService)
            {
                 _context = dataContext;
                  _kafkaService = kafkaService;
                  _logger = _loggerr;
            }

            public async Task<Result<Unit>> Handle(Query request, CancellationToken cancellationToken)
            {
             

                var posts =await _context.Posts.Include(a=>a.Author).Where(p=>p.Author.UserName == request.Username).ToListAsync();
                _logger.LogInformation("Starting to configure Kafka for posts..."+posts.Count);

                foreach (var post in posts)
                {
                    var topicName = "notifications_"+post.Id.ToString();
                    _logger.LogInformation("-----------------41"+ post.Title+"  ---  "+ post.Author.UserName+"--- "+request.Username+"----"+topicName);
                    await _kafkaService.DisconnectConsumer(topicName);
                    
                }
                
                
                //  var topicName = "comments_"+request.SpecificPostId+request.Username;
                //  _kafkaService.DisconnectConsumer(topicName);
                
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}