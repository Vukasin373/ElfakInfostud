using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class GetChatName
    {
        public class Query : IRequest<Result<string>>
        {
            public string Username1 { get; set; }
            public string Username2 { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<string>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
            }

            public async Task<Result<string>> Handle(Query request, CancellationToken cancellationToken)
            {
                /////////////////// PRVOBITNI KOD

                // string name = request.Username1 +"-"+request.Username2;
                // var message = await _context.Messages.FirstOrDefaultAsync(x=>x.ChatName == name);
                // if(message == null)
                // {
                //     name = request.Username2 + "-" + request.Username1;
                    
                // }
                
                // return Result<string>.Success(name);


                ///////////////// ZBOG GRANICNOG SLUCAJA MORA OVAKO

                string name = request.Username1 +"-"+request.Username2;
                var message = await _context.Messages.FirstOrDefaultAsync(x=>x.ChatName == name);
                if(message == null)
                {
                    name = request.Username2 + "-" + request.Username1;
                    message = await _context.Messages.FirstOrDefaultAsync(x=>x.ChatName == name);
                }
                
                if(message == null)
                {
                    if(request.Username1.Length > request.Username2.Length)
                        name = request.Username1 +"-"+request.Username2;
                    
                    else if(request.Username1.Length < request.Username2.Length)
                        name = request.Username2 + "-" + request.Username1;
                    else {
                        for(int i=0;i < request.Username1.Length; i++){
                            if(request.Username1[i] > request.Username2[i]){
                                name =  request.Username1 +"-"+request.Username2;
                                break;
                            }
                            if(request.Username2[i] > request.Username1[i]){
                                name = request.Username2 + "-" + request.Username1;
                                break;
                            }
                        }
                    }
                    
                }

                return Result<string>.Success(name);
                    
            }
        }
    }
}