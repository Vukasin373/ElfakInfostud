using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using FluentValidation;

namespace Application.Posts
{
    public class ValidatorPost : AbstractValidator<Post>
    {
        public ValidatorPost()
        {
            RuleFor(x=>x.Title).NotEmpty();
            RuleFor(x=>x.Category).NotEmpty();
            RuleFor(x=>x.Content).NotEmpty();
           
        }
    }
}