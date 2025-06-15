using Application.Contracts;
using Application.Models.ApiResult;
using Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Identity.Features.ResendOTP;
using Identity.Features.VerifyOTP;
using Identity.Features.Profile.GetProfile;
using Identity.Features.Profile.CompleteProfile;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using LifeGuard.Services;
using Microsoft.AspNetCore.Identity;

namespace LifeGuard_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IMediator mediator;
        private readonly IReturnUrlValidator _returnUrlValidator;
        public AccountController(IAuthService authService, IMediator mediator, IReturnUrlValidator returnUrlValidator)
        {
            _authService = authService;
            this.mediator = mediator;
            _returnUrlValidator = returnUrlValidator;

        }

        [Route("/")]
        [HttpGet]
        public IActionResult BaseUrl()
        {
            return Ok("Welcome to LifeGuard");
        }


        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(AuthRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(await _authService.Login(request));
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegistrationResponse>> Register(RegistrationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(await (_authService.Register(request)));
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.ForgotPasswordAsync(request);

                return result.IsSuccess ? Ok(result) : StatusCode((int)result.StatusCode, result);
            }
            catch (Exception e)
            {
                var result = new Result(false, ResultStatusCode.BadRequest, e.Message);
                return StatusCode((int)result.StatusCode, result);
            }
        }

        [HttpPost("ResendOTP")]
        public async Task<ActionResult<Result>> ResendOTP(ResendOTPCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await mediator.Send(command);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode((int)result.StatusCode, result);
            }

        }

        [HttpPost("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(VerifyOTPCommand command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await mediator.Send(command);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode((int)result.StatusCode, result);
            }
        }


        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ResetPasswordAsync(request);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetUserResponse?>> GetUserById(string id)
        {
            var result = await _authService.GetUserById(id);

            if (result == null)
            {
                return NotFound("User Cannot be Found");
            }
            return Ok(await _authService.GetUserById(id));
        }

        [HttpPost("CompleteProfile")]
        public async Task<IActionResult> CompleteProfile(CompleteProfileCommand request)
        {
            var result = await mediator.Send(request);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return StatusCode((int)result.StatusCode, result);
        }


        [HttpGet("GetProfile/{id}")]

        public async Task<IActionResult> GetProfile(string id)
        {
            var result = await mediator.Send(new GetProfileQuery { Id = id });

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return StatusCode((int)result.StatusCode, result);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var result = await _authService.DeleteUser(id);
            if (!result)
            {
                return NotFound("User not found");
            }
            return NoContent();
        }



        [HttpGet("google-login")]
        public IActionResult GoogleLogin([FromQuery] string returnUrl)
        {
            if (string.IsNullOrEmpty(returnUrl) || _returnUrlValidator.ValidUrl(returnUrl))
                returnUrl = _returnUrlValidator.DefaultUrl;
            var properties = new AuthenticationProperties { RedirectUri = Url.Action(nameof(GoogleResponse),null, null, "https") };
            properties.Items["returnUrl"] = returnUrl;
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }


        [HttpGet("signin-google")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return Unauthorized();

            authenticateResult.Properties.Items.TryGetValue("returnUrl", out var returnUrl);
            var result = await _authService.HandleGoogleLoginAsync(authenticateResult.Principal, returnUrl);

            if (!result.IsSuccess)
                return StatusCode((int)result.StatusCode, result.Message);

            return Redirect(result.Message);
        }
        

    }
}
