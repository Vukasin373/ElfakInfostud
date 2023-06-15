using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Message
    {
        public int Id { get; set; }
        public string ChatName { get; set; }
        public string Content { get; set; }
        public DateTime Time { get; set; } = DateTime.Now;
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set; }
        public bool Seen { get; set; }
    }
}