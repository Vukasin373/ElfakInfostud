using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatCommentHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatCommentHub(IMediator mediator)
        {
            this._mediator = mediator;
        }


        public async Task SendComment(CreateComment.Command command)
        {
            
            var comment = await _mediator.Send(command);
            await Clients.Group(command.PostId.ToString()).SendAsync("ReceiveComment", comment.Value);

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
            await Groups.AddToGroupAsync(Context.ConnectionId,postId);
            var result = await _mediator.Send(new ListComments.Query{PostId = Guid.Parse(postId)});
            await Clients.Caller.SendAsync("LoadComments",result.Value);
        }
    }
}