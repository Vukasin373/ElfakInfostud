using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.Messages;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatMessageHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatMessageHub(IMediator mediator)
        {
            this._mediator = mediator;
        }


        public async Task SendMessage(CreateMessage.Command command)
        {
            
            var message = await _mediator.Send(command);
            
            await Clients.Group(command.ChatName).SendAsync("ReceiveMessage", message.Value);

        }

        public async Task ReadMessage(ReadMessage.Command command)
        {
            
            var message = await _mediator.Send(command);
            await Clients.Group(command.ChatName).SendAsync("SetToSeen", command.Id);

        }

         public async Task ReadAllMessages(ReadAllMessages.Command command)
        {
            
            var message = await _mediator.Send(command);
            await Clients.Group(command.ChatName).SendAsync("SetToSeenAllMessages", message.Value);

        }
  
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var chatName = httpContext.Request.Query["chatName"];
            await Groups.AddToGroupAsync(Context.ConnectionId,chatName);
            var result = await _mediator.Send(new ListMessages.Query{ChatName = chatName});
            await Clients.Caller.SendAsync("LoadMessages",result.Value);
        }

        public async Task DeleteMessage(int id)
        {
           await _mediator.Send(new DeleteMessage.Command{Id = id});
           await Clients.Caller.SendAsync("DeleteMessage", id);
        }
    }
}