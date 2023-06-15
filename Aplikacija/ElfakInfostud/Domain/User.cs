using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
﻿using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class User : IdentityUser
    {
        public string About { get; set; }
        public string Role { get; set; } 
        public string Image { get; set; }
    
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    
    }
}