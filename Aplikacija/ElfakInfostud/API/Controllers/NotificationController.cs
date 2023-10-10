using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Notifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class NotificationController : BaseController
    {
        [HttpPut]
        public async Task<IActionResult> ReadAllNotifications(string username, int newNumOfViewedNotifications)
        {
           return GetResult ( await Mediator.Send(new ReadAllNotifications.Command{Username = username, NewNumOfViewedNotifications = newNumOfViewedNotifications}));
   
        }
    }
}