using Application.Contracts;
using Application.Models.ApiResult;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Identity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Identity.Features.VerifyOTP;

namespace SmartShuttleIdentity.Features.VerifyOTP
{
    public class VerifyOTPCommandHandler : IRequestHandler<VerifyOTPCommand, Result>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOTPService _otpService;

        public VerifyOTPCommandHandler(UserManager<ApplicationUser> userManager, IOTPService otpService)
        {
            _userManager = userManager;
            _otpService = otpService;
        }

        public async Task<Result> Handle(VerifyOTPCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Result(false, ResultStatusCode.NotFound, "User not found.");
            }

            if (user.SecretKey == null || user.SecretKey.Length == 0)
            {
                return new Result(false, ResultStatusCode.BadRequest, "User does not have a secret key. Please request a new OTP.");
            }

            var isValid = _otpService.ValidateOtp(user.SecretKey, request.Otp);
            if (!isValid)
            {
                return new Result(false, ResultStatusCode.BadRequest, "Invalid or expired OTP.");
            }


            user.EmailConfirmed = true;
            var identityResult = await _userManager.UpdateAsync(user);
            if (!identityResult.Succeeded)
            {
                return new Result(false, ResultStatusCode.ServerError, "Failed to update user verification status.");
            }


            return new Result(true, ResultStatusCode.Success, "OTP verification successful.");
        }

    }
}
