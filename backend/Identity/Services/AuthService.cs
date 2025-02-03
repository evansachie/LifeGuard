using DotNetEnv;
using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Sprache;
using System.Net;
using System.Security.Claims;
using System.Text;
using Application.Contracts;
using Application.Models;
using Application.Models.ApiResult;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
//using Microsoft.IdentityModel.Tokens;

namespace Identity.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IOTPService _oTPService;


        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailService emailService, IOTPService oTPService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _oTPService = oTPService;
        }

        public async Task<AuthResponse> Login(AuthRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                throw new Exception($"User with {request.Email} not found");
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, false);

            if (!result.Succeeded)
            {
                throw new Exception($"Credentials for {request.Email} not valid");
            }

            JwtSecurityToken jwtSecurityToken = await GenerateToken(user);


            AuthResponse response = new AuthResponse
            {
                Id = user.Id,
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                Email = user.Email,
                UserName = user.UserName
            };

            return response;




        }


        private async Task<JwtSecurityToken> GenerateToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var roleClaims = new List<Claim>();
            foreach (var claim in roles)
            {
                roleClaims.Add(new Claim(ClaimTypes.Role, claim));
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id)

            }
            .Union(userClaims).Union(roleClaims);

            Env.Load("../.env.local");
            var jwt_key = Environment.GetEnvironmentVariable("JWT_KEY");
            var jwt_issuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var jwt_audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            var jwt_duration_in_minutes = Environment.GetEnvironmentVariable("JWT_DURATIONINMINUTES");

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt_key));
            var signingCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
               issuer: jwt_issuer,
               audience: jwt_audience,
               claims: claims,
               expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt_duration_in_minutes)),
               signingCredentials: signingCredentials);


            return jwtSecurityToken;


        }


        public async Task<RegistrationResponse> Register(RegistrationRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                throw new Exception($"Username {request.Name} already exists.");
            }

            var user = new ApplicationUser
            {
                Email = request.Email,
                Name = request.Name,
                UserName = request.Email,
                EmailConfirmed = false,
                PasswordHash = new PasswordHasher<ApplicationUser>().HashPassword(null, request.Password)
            };

            var existingEmail = await _userManager.FindByEmailAsync(request.Email);

            if (existingEmail != null)
            {
                throw new Exception($"Email {request.Email} already exists.");
            }
            else
            {
                var result = await _userManager.CreateAsync(user);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Student");

                    await _userManager.UpdateAsync(user);

                    await _oTPService.SendOtpEmailAsync(user.Email, user.SecretKey);

                    return new RegistrationResponse { UserId = user.Id };
                }
                else
                {
                    throw new Exception(string.Join(",", result.Errors.Select(e => e.Description)));
                }

            }


        }


        public async Task<Result<string>> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
            {
                return new Result<string>(false, ResultStatusCode.NotFound, string.Empty, "User not found or email not confirmed.");
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            Console.WriteLine("token " + token);

            var mainResetUrl = Environment.GetEnvironmentVariable("RESET_URL");
            var resetUrl = $"{mainResetUrl}/reset-password?email={user.Email}&token={WebUtility.UrlEncode(token)}";

            var message = $"<p>Please reset your password by clicking <a href='{resetUrl}'>here</a>.</p>";
            await _emailService.SendEmailAsync(user.Email, "Reset Password", message);

            return new Result<string>(true, ResultStatusCode.Success, token, "Password reset email sent");
        }


        public async Task<Result<string>> ResetPasswordAsync(Application.Models.ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return new Result<string>(false, ResultStatusCode.BadRequest, "New password cannot be the same as old password");
            }

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Result<string>(false, ResultStatusCode.BadRequest, "User does not exist");
            }
            var identityResult = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

            if (!identityResult.Succeeded)
            {
                return new Result<string>(false, ResultStatusCode.BadRequest, string.Join(", ", identityResult.Errors.Select(e => e.Description)));
            }


            return new Result<string>(true, ResultStatusCode.Success, "Password Reset Successfully");



        }

        public async Task<GetUserResponse> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                throw new Exception("User does not exist.");
            }

            return new GetUserResponse
            {
                UserName = user.Name,
                Email = user.Email
            };
            
        }
    }
}
