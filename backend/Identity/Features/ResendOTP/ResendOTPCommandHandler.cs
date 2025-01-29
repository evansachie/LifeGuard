using Application.Contracts;
using Application.Models.ApiResult;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Identity.Models;

namespace Identity.Features.ResendOTP
{
    public class ResendOTPCommandHandler : IRequestHandler<ResendOTPCommand, Result>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOTPService _otpService;

        public ResendOTPCommandHandler(UserManager<ApplicationUser> userManager, IOTPService otpService)
        {
            _userManager = userManager;
            _otpService = otpService;

        }

        public async Task<Result> Handle(ResendOTPCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Result(false, ResultStatusCode.NotFound, "User not found.");
            }


            if (user.SecretKey == null || user.SecretKey.Length == 0)
            {
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return new Result(false, ResultStatusCode.ServerError, "Failed to generate secret key.");
                }
            }

            var otp = _otpService.GenerateOtp(user.SecretKey);

            try
            {
                await _otpService.SendOtpEmailAsync(user.Email, user.SecretKey);
            }
            catch (Exception)
            {
                // Log the exception as needed
                return new Result(false, ResultStatusCode.ServerError, "Failed to send OTP email.");
            }

            return new Result(true, ResultStatusCode.Success, "OTP has been resent successfully.");
        }

    }
}
