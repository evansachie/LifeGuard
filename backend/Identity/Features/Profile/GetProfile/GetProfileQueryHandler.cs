using Application.Models.ApiResult;
using Application.Models.Photos;
using Identity.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Features.Profile.GetProfile
{
    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, Result<GetProfileDto>>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public GetProfileQueryHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<GetProfileDto>> Handle(GetProfileQuery query, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(query.Id);
            if (user == null)
            {
                throw new Exception("User does not exist");
            }

            var result = new GetProfileDto()
            {
                Age = user.Age,
                Gender = user.Gender,
                Weight = user.Weight,
                Height = user.Height,
                PhoneNumber = user.PhoneNumber,
                Bio = user.Bio



            };

            return new Result<GetProfileDto>(true, ResultStatusCode.Success, result, "Successful");



        }
    }
}
