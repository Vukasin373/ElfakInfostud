using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options){}

        public DbSet<Post> Posts { get; set; } 
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Like> Likes { get; set; }
        

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Post>().HasOne(a=>a.Author).WithMany(p=>p.Posts).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Comment>().HasOne(p=>p.Post).WithMany(c=>c.Comments).OnDelete(DeleteBehavior.Cascade);
            
            builder.Entity<Like>().HasOne(p=>p.Post).WithMany(l=>l.Likes).OnDelete(DeleteBehavior.Cascade);
        }
       
    }
}