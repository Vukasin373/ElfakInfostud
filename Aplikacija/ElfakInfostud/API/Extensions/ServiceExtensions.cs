using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Posts;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(option => {
            option.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(option => {
             option.AddPolicy("CorsPolicy", policy => {
            policy.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:3000");
            });
        });
        services.AddMediatR(typeof(ListPost.Handler));
        services.AddAutoMapper(typeof(EntityMapper).Assembly);
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<CreatePost>();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser,CurrentUser>();
        services.AddSignalR();

        return services;
        }
    }
}