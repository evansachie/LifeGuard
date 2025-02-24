using Application.Contracts.Photos;
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

        public UserPhotoService(UserManager<ApplicationUser> userManager,  IPhotoAccessor photoAccessor)
        {
            _userManager = userManager;
            _photoAccessor = photoAccessor;
        }


        public async Task<PhotoUploadResult> AddUserPhotoAsync(string userId, IFormFile file)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var photoResult = await _photoAccessor.AddPhoto(file);

            if (photoResult == null)
                throw new Exception("Problem uploading photo");

            user.PhotoUrl = photoResult.Url;
            user.PhotoPublicId = photoResult.PublicId;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Problem updating user photo {result.Errors} "); ;
            }

            return photoResult;

        }


        public async Task DeleteUserPhotoAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            if (string.IsNullOrEmpty(user.PhotoPublicId))
                throw new Exception("User does not have a photo");

            var deletionResult = await _photoAccessor.DeletePhoto(user.PhotoPublicId);
            if (deletionResult == null)
                throw new Exception("Problem deleting photo");

            
            user.PhotoUrl = null;
            user.PhotoPublicId = null;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception("Problem updating user photo");
        }

    }
}
