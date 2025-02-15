using Application.Models.ApiResult;
using Identity.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace Identity.Features.CompleteProfile
{
    public class CompleteProfileCommandHandler : IRequestHandler<CompleteProfileCommand, Result>
    {

        private readonly UserManager<ApplicationUser> _userManager;

        public CompleteProfileCommandHandler(UserManager<ApplicationUser> userManager)
        {
            this._userManager = userManager;
            
        }

        public async Task<Result> Handle(CompleteProfileCommand request, CancellationToken cancellationtoken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Result(false, ResultStatusCode.BadRequest, "User not Found");


            }

            user.Gender = request.Gender;
            user.Height = request.Height;
            user.Weight = request.Weight;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) 
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return new Result(false, ResultStatusCode.BadRequest, errors);
            }

            return new Result(true, ResultStatusCode.Success, "Profile successfully Updated");
        }
    }
}
