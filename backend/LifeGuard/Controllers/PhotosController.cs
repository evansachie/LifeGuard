using Application.Contracts.Photos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeGuard.Controllers
{
    public class PhotosController: Controller
    {
        private readonly IMediator _mediator;
        private readonly IUserPhotoService _userPhotoService;

        public PhotosController(IMediator mediator, IUserPhotoService userPhotoService)
        {
            _mediator = mediator;
            _userPhotoService = userPhotoService;
        }

        [Authorize("EmailConfirmed")]
        [HttpPost("{id}/photo")]
        public async Task<IActionResult> AddPhoto(string id, IFormFile file)
        {
            try
            {
                var result = await _userPhotoService.AddUserPhotoAsync(id, file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize("EmailConfirmed")]
        [HttpDelete("{id}/photo")]
        public async Task<IActionResult> DeletePhoto(string id)
        {
            try
            {
                await _userPhotoService.DeleteUserPhotoAsync(id);
                return NoContent(); 

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/photo")]
        public async Task<IActionResult> GetPhoto(string id)
        {
            try
            {

                return Ok(await _userPhotoService.GetUserPhotoAsync(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
