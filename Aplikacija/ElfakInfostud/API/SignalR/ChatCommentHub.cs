using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Kafka;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatCommentHub : Hub
    {
        private readonly IMediator _mediator;
        private readonly IKafkaService _kafkaService; 

        public ChatCommentHub(IMediator mediator, IKafkaService kafkaService) 
        {
            this._mediator = mediator;
            this._kafkaService = kafkaService;
        }


        public async Task SendComment(CreateComment.Command command)
        {
            
            var result = await _mediator.Send(command);
            
            if(result.Value.Notification!=null)
                await _kafkaService.ProduceNotification("notifications_"+result.Value.Notification.PostId.ToString(), result.Value.Notification);

            await _kafkaService.ProduceComment("comments_"+result.Value.PostId.ToString(), result.Value.Comment);

            //await Clients.Group(command.PostId.ToString()).SendAsync("ReceiveComment", result.Value.Comment);

        }

        public async Task DeleteComment(int id)
        {
           await _mediator.Send(new DeleteComment.Command{Id = id});
           await Clients.Caller.SendAsync("DeleteComment", id);
        }
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var postId = httpContext.Request.Query["postId"];
            var username = httpContext.Request.Query["username"];
            await Groups.AddToGroupAsync(Context.ConnectionId,postId.ToString());
            //var result = await _mediator.Send(new ListComments.Query{PostId =.Parse(postId)});
            //await Clients.Caller.SendAsync("LoadComments",result.Value);
             await _kafkaService.ConsumeComment("comments_"+postId.ToString(), postId.ToString(), username);
        }
    }
}