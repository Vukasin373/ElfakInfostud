using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Domain;

namespace API.Kafka
{
     public interface IKafkaService
    {
       
        Task ProduceNotification(string topic, Notification notification);
        Task ProduceComment(string topic, CommentDto comment);
        Task  ConsumeNotification(string topic);
        Task  ConsumeComment(string topic,string postId, string username);
        Task DisconnectConsumer(string consumerId);
        Task CreateTopic(string topicName, bool notif);
    }
}