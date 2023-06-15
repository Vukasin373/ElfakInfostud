using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.Posts;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class EntityMapper : Profile
    {
        public EntityMapper()
        {
            CreateMap<Post,PostDto>()
            .ForMember(p=>p.AuthorUsername,o=>o.MapFrom(x=>x.Author.UserName))
            .ForMember(p=>p.AuthorImage, o=> o.MapFrom(x=>x.Author.Image))
            .ForMember(p=> p.Likes, o => o.MapFrom(x=>x.Likes.Select(u=>u.User.UserName)));
      
            
            CreateMap<Post,Post>();
            CreateMap<User,Profiles.Profile>();

            CreateMap<Comment,CommentDto>()
            .ForMember(p=>p.CreatorUsername, o=> o.MapFrom(x=>x.User.UserName))
            .ForMember(p=>p.Image, o=> o.MapFrom(i=>i.User.Image));
            
        }
    }
}