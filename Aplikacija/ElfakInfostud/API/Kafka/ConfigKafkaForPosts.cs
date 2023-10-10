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
    public class ConfigKafkaForPosts
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
                _logger.LogInformation("Starting to configure Kafka for posts...");
                var posts =await _context.Posts.Where(p=>p.Author.UserName == request.Username).ToListAsync();

            foreach (var post in posts)
            {
                var topicName ="notifications_"+ post.Id.ToString();
                _logger.LogInformation($"Starting to consume from topic: {topicName}...");
                // skloni await
                   await _kafkaService.ConsumeNotification(topicName);
                _logger.LogInformation($"Consuming from topic: {topicName} started.");
            }
            return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}