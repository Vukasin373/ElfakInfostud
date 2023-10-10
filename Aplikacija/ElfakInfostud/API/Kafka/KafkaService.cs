using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.SignalR;
using Application.Comments;
using Application.Interfaces;
using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Domain;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Persistence;


namespace API.Kafka
{
    public class KafkaService: IKafkaService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IProducer<Null, string> _producer;
        private readonly ConsumerConfig _consumerConfig;
        private readonly ILogger<KafkaService> _logger;
        private readonly IHubContext<NotificationHub> _hubContextNotifications;
        private readonly IHubContext<ChatCommentHub> _hubContextComments;
        public Dictionary<string, TaskCompletionSource<bool>> activeConsumers = new Dictionary<string, TaskCompletionSource<bool>>();
        public Dictionary<string, Task> activeConsumerTasks = new Dictionary<string, Task>();
        public Dictionary<string, CancellationTokenSource> _cancellationTokens = new Dictionary<string, CancellationTokenSource>();
        //public Dictionary<string, CancellationTokenSource> _cancellationTokensComments = new Dictionary<string, CancellationTokenSource>();
   


        public KafkaService(ILogger<KafkaService> logger, ProducerConfig producerConfig, ConsumerConfig consumerConfig, IServiceScopeFactory scopeFactory,IHubContext<NotificationHub> hubContext, IHubContext<ChatCommentHub> hubContextComments)
        {
            _producer = new ProducerBuilder<Null, string>(producerConfig).Build();
            _consumerConfig = consumerConfig;
            _logger = logger;
            _scopeFactory = scopeFactory;  // inicijalizujte scopeFactory
            _hubContextNotifications = hubContext;
            _hubContextComments = hubContextComments;
            
        }

        public async Task ProduceNotification(string topic, Notification notification)
        {
            var notificationJson = JsonConvert.SerializeObject(notification);
            _logger.LogInformation($"Producing notification to topic {topic}: {notification.Comment}");
            await _producer.ProduceAsync(topic, new Message<Null, string> { Value = notificationJson });
        }

        public async Task ConsumeNotification(string topic)
        {
            await this.DisconnectConsumer(topic);
            CancellationTokenSource cts;

            if (!_cancellationTokens.ContainsKey(topic))
            {
                cts = new CancellationTokenSource();
                _cancellationTokens[topic] = cts;
            }
            else
            {
                cts = _cancellationTokens[topic];
            }

            var newConsumerConfig = new ConsumerConfig
            {
                BootstrapServers = _consumerConfig.BootstrapServers,
                GroupId = Guid.NewGuid().ToString(),
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            var consumeTask = Task.Run(async () =>
            {
                _logger.LogInformation($"Starting to consume messages from topic: {topic}");
                using var consumer = new ConsumerBuilder<Null, string>(newConsumerConfig).Build();
                consumer.Subscribe(topic);
                while (!cts.Token.IsCancellationRequested)
                {
                    try
                    {
                    var result = consumer.Consume(cts.Token);
                    var notif = JsonConvert.DeserializeObject<Notification>(result.Message.Value);
                    _logger.LogInformation($"-------------Received notification from topic {topic}: {notif.Comment}");
                    var notification = new Notification
                    {
                        Id = notif.Id,
                        Comment = notif.Comment,
                        ReceiverUsername = notif.ReceiverUsername,
                        SenderUsername = notif.SenderUsername,
                        isRead = false,
                        PostId = notif.PostId,
                        Time = notif.Time

                    };
                    await _hubContextNotifications.Clients.Group(notification.ReceiverUsername).SendAsync("ReceiveNotification", notification);
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation($"Consuming from topic: {topic} canceled.");
                        break;
                    }
                    

                }
                consumer.Close();
                consumer.Dispose();
            });
            activeConsumerTasks[topic] = consumeTask;
        }

        public async Task DisconnectConsumer(string consumerId)
        {
            foreach (var toke in _cancellationTokens.Keys)
                _logger.LogInformation($"?????????????????????????????+++++++++++++++++++++++++topic: {consumerId}");
            
            
            if (_cancellationTokens.TryGetValue(consumerId, out var cts))
            {
                 _logger.LogInformation("-**************************token pronadjen!");
                cts.Cancel();
                _cancellationTokens.Remove(consumerId);
                
                if (activeConsumerTasks.TryGetValue(consumerId, out var task))
                {
                    await task;
                    activeConsumerTasks.Remove(consumerId);
                }
            }

           if (_cancellationTokens.ContainsKey(consumerId))
            _logger.LogInformation($"Pronadjeeeeen: {consumerId}");
            
            _logger.LogInformation($"Disconnected consumer for topic: {consumerId}");
        }

        public async Task CreateTopic(string topicName, bool notif)
        {
            using var adminClient = new AdminClientBuilder(new AdminClientConfig { BootstrapServers = "localhost:9092" }).Build();
            var topicSpec = new TopicSpecification { Name = topicName, NumPartitions = 2, ReplicationFactor = 3 };
            await adminClient.CreateTopicsAsync(new List<TopicSpecification> { topicSpec });
            if(notif){
                await ConsumeNotification(topicName);
            }
        }

        public async Task ProduceComment(string topic, CommentDto comment)
        {
            var commentJson = JsonConvert.SerializeObject(comment);
            _logger.LogInformation($".....................Producing comment to topic {topic}: {comment.Content}");
            await _producer.ProduceAsync(topic, new Message<Null, string> { Value = commentJson });
        }

        public async Task ConsumeComment(string topic, string postId, string username)
        {

            await this.DisconnectConsumer(topic+username);
            CancellationTokenSource cts;

            if (!_cancellationTokens.ContainsKey(topic + username))
            {
                cts = new CancellationTokenSource();
                _cancellationTokens[topic + username] = cts;
            }
            else
            {
                cts = _cancellationTokens[topic + username];
            }
            // var tcs = new TaskCompletionSource<bool>();
            // activeConsumers[topic] = tcs;
            foreach (var toke in _cancellationTokens.Keys)
            {
                
                _logger.LogInformation($"+++++++++++++++++++++++++topic: {topic+username}");
            }


            var newConsumerConfig = new ConsumerConfig
            {
                BootstrapServers = _consumerConfig.BootstrapServers,
                GroupId = Guid.NewGuid().ToString() + username,
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            var consumeTask = Task.Run(async () =>
            {
                _logger.LogInformation($"------------------------Starting to consume comments from topic: {topic}");
                using var consumer = new ConsumerBuilder<Null, string>(newConsumerConfig).Build();
                foreach (var toke in _cancellationTokens.Keys)
                {
                    
                    _logger.LogInformation($"//////////////////////+++++++++++++++++++++++++topic: {topic}");
                }
                consumer.Subscribe(topic);

                while (!cts.Token.IsCancellationRequested)
                {
                    try
                    {
                    var result = consumer.Consume(cts.Token);
                   // var result = consumer.Consume();
                    //_logger.LogInformation($"Received raw message: {result.Message.Value}");
                    var comment = JsonConvert.DeserializeObject<CommentDto>(result.Message.Value);
                    

                    //using var scope = _scopeFactory.CreateScope();  // kreirajte novi scope
                    //var context = scope.ServiceProvider.GetRequiredService<DataContext>();  // preuzmite DbContext unutar scope-a

                   
                    _logger.LogInformation($"-------------Received comment from topic {topic}: {comment.Content}");
                    var commentDto = new CommentDto
                    {
                        Id = comment.Id,
                        Content = comment.Content,
                        Time = comment.Time,
                        CreatorUsername = comment.CreatorUsername,
                        Image = comment.Image,
                    
                    };


                  
                    await _hubContextComments.Clients.Group(postId).SendAsync("ReceiveComment", commentDto);
                    
                        
                    
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation($"Consuming from topic: {topic} canceled.");
                        break;
                    }
                    

                }

                foreach (var toke in _cancellationTokens.Keys)
                {
                    
                    _logger.LogInformation($"-----------------+++++++++++++++++++++++++topic: {topic}");
                }
                    
                consumer.Close();
                consumer.Dispose();
                });
                activeConsumerTasks[topic + username] = consumeTask;
        }
    }
}
