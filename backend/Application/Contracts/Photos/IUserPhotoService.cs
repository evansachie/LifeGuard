using Application.Models.ApiResult;
using Application.Models.Photos;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Photos
{
    public interface IUserPhotoService
    {
        Task<Result> AddUserPhotoAsync(string userId, IFormFile file);
        Task<Result?> DeleteUserPhotoAsync(string userId);
        Task<Result> GetUserPhotoAsync(string userId);   
    }
}
