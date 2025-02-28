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
        Task<PhotoUploadResult> AddUserPhotoAsync(string userId, IFormFile file);
        Task DeleteUserPhotoAsync(string userId);
        Task<PhotoUploadResult> GetUserPhotoAsync(string userId);   
    }
}
