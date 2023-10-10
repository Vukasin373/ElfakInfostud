using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace API.SignalR
{
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var username = httpContext.Request.Query["username"];

            _logger.LogInformation($"*************************User {username} connected with connection ID {Context.ConnectionId}");

            await Groups.AddToGroupAsync(Context.ConnectionId, username);
        }

        public async Task SendNotification(Notification notification)
        {
            _logger.LogInformation($"///////////////////////////Sending notification to user {notification.ReceiverUsername}");

            await Clients.Group(notification.ReceiverUsername).SendAsync("ReceiveNotification", notification);
        }
    }
}
