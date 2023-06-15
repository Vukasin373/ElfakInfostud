using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Posts
{
    public class PostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public int  NumberOfViews { get; set; }
        public string AuthorUsername { get; set; }
        public bool Approved { get; set; }
        public string AuthorImage { get; set; }
        public ICollection<string> Likes { get; set; } = new List<string>();
    }
}