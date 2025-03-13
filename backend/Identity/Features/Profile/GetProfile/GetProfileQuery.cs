using Application.Models.ApiResult;
using Application.Models.Photos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Features.Profile.GetProfile
{
    public class GetProfileQuery : IRequest<Result<GetProfileDto>>
    {
        public string Id { get; set; }

    }
}
