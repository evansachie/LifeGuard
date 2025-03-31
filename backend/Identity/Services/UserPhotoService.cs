using Application.Contracts.Photos;
using Application.Models.ApiResult;
using Application.Models.Photos;
using Identity.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class UserPhotoService : IUserPhotoService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPhotoAccessor _photoAccessor;

        public UserPhotoService(UserManager<ApplicationUser> userManager,IPhotoAccessor photoAccessor)
        {
            _userManager = userManager;
            _photoAccessor = photoAccessor;
        }


        public async Task<Result> AddUserPhotoAsync(string userId, IFormFile file)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
               return new Result(false, ResultStatusCode.NotFound, "User not found");

            var photoResult = await _photoAccessor.AddPhoto(file);

            if (photoResult == null)
                throw new Exception("Problem uploading photo");

            user.PhotoUrl = photoResult.Url;
            user.PhotoPublicId = photoResult.PublicId;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
               return new Result(false, ResultStatusCode.BadRequest,$"Problem updating user \n {result.Errors} ");
            }

            return new Result<PhotoUploadResult> (true, ResultStatusCode.Success, photoResult);

        }


        public async Task<Result?> DeleteUserPhotoAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new Result(false, ResultStatusCode.NotFound, "User not found");

            if (string.IsNullOrEmpty(user.PhotoPublicId))
                return new Result(false, ResultStatusCode.NotFound, "User does not have a photo");

            var deletionResult = await _photoAccessor.DeletePhoto(user.PhotoPublicId);
            if (deletionResult == null)
                return new Result(false, ResultStatusCode.BadRequest, $"Problem deleting photo");


            user.PhotoUrl = null;
            user.PhotoPublicId = null;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return new Result(false, ResultStatusCode.BadRequest, $"Problem updating user \n {result.Errors} ");

            return null;
        }

        public async Task<Result> GetUserPhotoAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return new Result(false, ResultStatusCode.NotFound, "User not found");
            }

            if (string.IsNullOrEmpty(user.PhotoPublicId))
            {
                return new Result(false, ResultStatusCode.NotFound, "User does not have a photo");
            }

            var  result = await _photoAccessor.GetPhoto(user.PhotoPublicId);
            if (result == null)
            {
                return new Result(false, ResultStatusCode.NotFound, "User does not have a photo");
            }

            return new Result<PhotoUploadResult>(true, ResultStatusCode.Success, result);
        }
           
    }
}
