using Application.Contracts;
using Infrastructure.EmailService;
using OtpNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.OTPService
{
    public class OTPService : IOTPService
    {
        private readonly IEmailService _emailService;
        private const int TotpStep = 30;
        private static readonly VerificationWindow VerificationWindow = new VerificationWindow(previous: 1, future: 1);

        public OTPService(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public byte[] GenerateSecretKey(int keySize = 20)
        {
            return KeyGeneration.GenerateRandomKey(keySize);
        }

        public string GenerateOtp(byte[] secretKey)
        {
            var totp = new Totp(secretKey, step: TotpStep);
            return totp.ComputeTotp(DateTime.UtcNow);
        }

        public bool ValidateOtp(byte[] secretKey, string providedOtp)
        {
            var totp = new Totp(secretKey, step: TotpStep);
            return totp.VerifyTotp(providedOtp, out long timeStepMatched, VerificationWindow);
        }

        public async Task SendOtpEmailAsync(string email, byte[] secretKey)
        {
            var otp = GenerateOtp(secretKey);
            var appName = "LifeGuard";
            var expiryTime = $"{TotpStep} seconds";
            var subject = $"Your OTP for {appName}";
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{
                            font-family: 'Arial', sans-serif;
                            color: #333;
                            line-height: 1.6;
                        }}
                        .otp {{
                            font-weight: bold;
                            color: #d64;
                        }}
                        .footer {{
                            font-size: 0.9em;
                        }}
                    </style>
                </head>
                <body>
                    <p>Hello,</p>
                    <p>Your One-Time Password (OTP) for <strong>{appName}</strong> is:
                       <span class='otp'>{otp}</span></p>
                    <p>Please use this code to complete your verification process.
                       Note: This code will expire in {expiryTime}.</p>
                    <p>If you did not request this code, please ignore this email or contact support
                       if you feel this is an unauthorized action.</p>
                    <p class='footer'>
                        Thank you,<br>
                        <strong>{appName} Support Team</strong>
                    </p>
                </body>
                </html>";
            await _emailService.SendEmailAsync(email, subject, body);
        }
    }
}
