using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Comments
{
    public class CommentNotificationDto
    {
        public CommentDto Comment { get; set; }
        public Notification Notification { get; set; }
        public Guid PostId { get; set; }
    }

}