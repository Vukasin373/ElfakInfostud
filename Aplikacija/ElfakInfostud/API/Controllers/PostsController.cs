using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using API.Kafka;
using Application.Posts;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [AllowAnonymous]
    public class PostsController : BaseController
    {

        private readonly IKafkaService _kafkaService;

        public PostsController(IKafkaService kafkaService)
        {
            _kafkaService = kafkaService;
        }


        [HttpPost("createPost")]
        public async Task<IActionResult> CreatePost(Post post)
        {
             var result =  await Mediator.Send(new CreatePost.Command{Post = post});
             if(result.IsSuccess){

                //_kafkaService.CreateTopic(post.Id.ToString());
                await _kafkaService.CreateTopic("notifications_"+post.Id.ToString(),true);
                await _kafkaService.CreateTopic("comments_"+post.Id.ToString(),false);

             }
            return GetResult(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts(string approved, [FromQuery] PostParams param)
        {
            return GetPagedResult( await Mediator.Send(new ListPost.Query{Approved = approved, Params = param}));
        }

        [HttpGet("postoviKorisnika")]
        public async Task<IActionResult> GetPostsOfUser(string username)
        {
            return GetResult( await Mediator.Send(new ListPostsOfUser.Query{Username = username}));
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(Guid id)
        {
            return GetResult(await Mediator.Send(new GetPost.Query{Id = id}));
        }

        [HttpPut("editPost/{id}")]
        public async Task<IActionResult> EditPost(Post post, Guid id)
        {
            return GetResult(await Mediator.Send(new EditPost.Command{Post = post}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            return GetResult(await Mediator.Send(new DeletePost.Command{Id = id}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNumberOfViews(Guid id)
        {
            return GetResult(await Mediator.Send(new IncreaseNumberOfViews.Command {Id = id}));
        }

        [HttpPut("acceptPost/{id}")]
        public async Task<IActionResult> AcceptPost(Guid id )
        {
            return GetResult(await Mediator.Send(new AcceptPost.Command{Id = id}));
        }

        [HttpPost("like/{id}")]
        public async Task<IActionResult> Like(Guid id) 
        {
            return GetResult(await Mediator.Send(new LikePost.Command { PostId = id } ));
        }

     
        [HttpPut("configKafkaForPosts/{username}")]
         public async Task<ActionResult> ConfigKafkaForPosts(string username)
         {
             return GetResult(await Mediator.Send(new ConfigKafkaForPosts.Query { Username = username } ));
         }

        [HttpPut("disconnectConsumersForPosts/{username}")]
         public async Task<ActionResult> DisconnectConsumersForPosts(string username)
         {
             return GetResult(await Mediator.Send(new DisconnectConsumersForPosts.Query { Username = username} ));
         }
         
        [HttpPut("disconnectConsumerForSpecificPost/{username}/{postId}")]
         public async Task<ActionResult> DisconnectConsumersForPosts(string username, string postId)
         {
             return GetResult(await Mediator.Send(new DisconnectConsumerForPost.Query { Username = username, SpecificPostId = postId} ));
         }
         

    }
}