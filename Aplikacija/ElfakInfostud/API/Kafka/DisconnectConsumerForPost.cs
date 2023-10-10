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
    public class DisconnectConsumerForPost
    {
        public class Query : IRequest<Result<Unit>>
        {
            public string Username { get; set; }
            public string SpecificPostId { get; set; }
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
               
                var topicName = "comments_"+request.SpecificPostId+request.Username;
                await _kafkaService.DisconnectConsumer(topicName);
                
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}