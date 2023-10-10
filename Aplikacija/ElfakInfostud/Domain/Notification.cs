using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Notification
    {
        public string Id { get; set; }
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set; }
        public string Comment { get; set; }
        public DateTime  Time   { get; set; } = DateTime.Now;
        public bool isRead { get; set; }
        public Guid PostId { get; set; }
    }
}