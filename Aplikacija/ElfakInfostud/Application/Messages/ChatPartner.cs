using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;

namespace Application.Messages
{
    public class ChatPartner
    {
        public Profile Profile { get; set; }
        public Message LastMessage { get; set; }
    }
}