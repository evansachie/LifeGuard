using Application.Contracts.Photos;
using Application.Models.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor()
        {
            var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
            var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
            var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);



        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                    {
                        throw new Exception(uploadResult.Error.Message);
                    }

                    return new PhotoUploadResult
                    {
                        PublicId = uploadResult.PublicId,
                        Url = uploadResult.SecureUrl.AbsoluteUri
                    };
                }
            }

            return null;

        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }


        public async Task<PhotoUploadResult> GetPhoto(string publicId)
        {
            var getResult = await _cloudinary.GetResourceAsync(publicId);

            if (getResult == null)
            {
                return null;
            }
            var Photo = new PhotoUploadResult()
            {
                PublicId = getResult.PublicId,
                Url = getResult.Url,
            };

            return Photo;
        }
    }
}
