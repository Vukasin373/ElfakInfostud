using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Messages;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessageController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetChatName(string user1, string user2)
        {
            return GetResult( await Mediator.Send(new GetChatName.Query{Username1 = user1, Username2 = user2}));
        }

        [HttpGet("inbox")]
        public async Task<IActionResult> GetAllUsernameChat()
        {
            return GetResult( await Mediator.Send(new GetAllChatPartners.Query{}));
        }   

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete()
        {
            return GetResult( await Mediator.Send(new DeleteMessage.Command{}));
        }   

        [HttpPut("readMessage/{id}")]
        public async Task<IActionResult> ReadMessage(int id)
        {
            return GetResult(await Mediator.Send(new ReadMessage.Command { Id = id}));
        }

        [HttpPut("readAllMessages/{username}")]
        public async Task<IActionResult> ReadAllMessages(string username)
        {
            return GetResult(await Mediator.Send(new ReadAllMessages.Command { Username = username}));
        }

        [HttpGet("checkForNewMessage")]
        public async Task<IActionResult> CheckForNewMessage()
        {
            return GetResult(await Mediator.Send(new CheckForNewMessage.Query{}));
        }
    }
}