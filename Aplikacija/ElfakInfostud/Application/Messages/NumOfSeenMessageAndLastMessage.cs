using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Messages
{
    public class NumOfSeenMessageAndLastMessage
    {
        public int Num { get; set; }
        public Message LastMessage { get; set; }
    }
}