using DotNetEnv;
using Identity.Models;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Security.Claims;
using System.Text;
using Application.Contracts;
using Application.Models;
using Application.Models.ApiResult;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;



//using Microsoft.IdentityModel.Tokens;

namespace Identity.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IOTPService _oTPService;
        private readonly IEncryptionHelper _encryptionHelper;
        private readonly string _jwtKey;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly string _jwtDurationInMinutes;
        private readonly string _frontEndUrl;

        

        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailService emailService, IOTPService oTPService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _oTPService = oTPService;
            _encryptionHelper = encryptionHelper;

            Env.Load("../.env.local");
            _jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            _jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            _jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            _jwtDurationInMinutes = Environment.GetEnvironmentVariable("JWT_DURATIONINMINUTES");
            _frontEndUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");
            _encryptionHelper = encryptionHelper;
        }

        public async Task<Result> Login(AuthRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return new Result(false, ResultStatusCode.NotFound, $"User with {request.Email} not found");  
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, false);

            if (!result.Succeeded)
            {
                return new Result(false, ResultStatusCode.BadRequest, $"Credentials for {request.Email} not valid");      }

            JwtSecurityToken jwtSecurityToken = await GenerateToken(user);


            AuthResponse response = new AuthResponse
            {
                Id = user.Id,
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                Email = user.Email,
                UserName = user.UserName
            };

            return new Result<AuthResponse>(true, ResultStatusCode.Success, response, "Login Successful");

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
                new Claim("email_verified", user.EmailConfirmed.ToString()),
                new Claim("uid", user.Id)

            }
            .Union(userClaims).Union(roleClaims);

            

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var signingCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
               issuer: _jwtIssuer,
               audience: _jwtAudience,
               claims: claims,
               expires: DateTime.UtcNow.AddMinutes(int.Parse(_jwtDurationInMinutes)),
               signingCredentials: signingCredentials);


            return jwtSecurityToken;


        }


        private byte[] GenerateSecretKey(int keySize)
        {
            var key = new byte[keySize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(key);
            }
            return key;
        }

        public async Task<Result> Register(RegistrationRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return new Result(false, ResultStatusCode.Conflict, $"Username {request.Name} already exists.");
            }

            var user = new ApplicationUser
            {
                Email = request.Email,
                Name = request.Name,
                UserName = request.Email,
                EmailConfirmed = false,
                SecretKey = _encryptionHelper.Encrypt(GenerateSecretKey(32));
                
            };

            var existingEmail = await _userManager.FindByEmailAsync(request.Email);

            if (existingEmail == null)
            {
                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Student");
                    await _userManager.UpdateAsync(user);

                    try 
                    {
                        await _oTPService.SendOtpEmailAsync(user.Email, user.SecretKey);
                        return new Result<RegistrationResponse>(true, ResultStatusCode.Success, new RegistrationResponse 
                        { 
                            UserId = user.Id,
                            EmailVerified = true,
                            AccountCreated = true,
                            Message = "Registration successful! Please verify your email."
                        });
                    }
                    catch (Exception ex)
                    {
                        return new Result<RegistrationResponse>(true, ResultStatusCode.Success, new RegistrationResponse 
                        { 
                            UserId = user.Id,
                            EmailVerified = false,
                            AccountCreated = true,
                            Message = "Account created successfully! Email verification is currently unavailable. You may proceed to login."
                        });
                    }
                }
                else
                {
                    return new Result<RegistrationResponse>(false, ResultStatusCode.BadRequest, new RegistrationResponse 
                    { 
                        AccountCreated = false,
                        Message = string.Join(",", result.Errors.Select(e => e.Description))
                    });
                }
            }
            else
            {
                return new Result(false, ResultStatusCode.Conflict, $"Email {request.Email} already exists.");
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
            

            var mainResetUrl = Environment.GetEnvironmentVariable("RESET_URL");
            var resetUrl = $"{_frontEndUrl}/reset-password?email={user.Email}&token={WebUtility.UrlEncode(token)}";

            var message = $"<p>Please reset your password by clicking <a href='{resetUrl}'>here</a>.</p>";
            await _emailService.SendEmailAsync(user.Email, "Reset Password", message);

            return new Result<string>(true, ResultStatusCode.Success, token, "Password reset email sent");
        }


        public async Task<Result<string>> ResetPasswordAsync(Application.Models.ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return new Result<string>(false, ResultStatusCode.BadRequest, "Both passwords must match");
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

        public async Task<GetUserResponse?> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            return new GetUserResponse
            {
                UserName = user.Name,
                Email = user.Email
            };
            
        }

        public async Task<bool> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            var response = await _userManager.DeleteAsync(user);

            return response.Succeeded;

        }



        public async Task<Result<object>> HandleGoogleLoginAsync(ClaimsPrincipal externalPrincipal, string returnUrl)
        {
            var emailClaim = externalPrincipal.FindFirst(ClaimTypes.Email);
            var nameClaim = externalPrincipal.FindFirst(ClaimTypes.Name);

            if (emailClaim == null)
                return new Result<object>(false, ResultStatusCode.BadRequest, "Google account does not contain an email.");

            var email = emailClaim.Value;
            var name = nameClaim?.Value ?? email;

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    Name = name,
                    EmailConfirmed = true
                };

                var creationResult = await _userManager.CreateAsync(user);

                if (!creationResult.Succeeded)
                {
                    var errors = string.Join(", ", creationResult.Errors.Select(e => e.Description));
                    return new Result<object>(false, ResultStatusCode.BadRequest, errors);
                }
            }

            var jwtToken = await GenerateToken(user);
            var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            var redirectUrl = QueryHelpers.AddQueryString(
                $"{returnUrl}/dashboard",
                new Dictionary<string, string?>
                {
                    ["token"] = token,
                    ["userId"] = user.Id,
                    ["email"] = user.Email,
                    ["userName"] = user.UserName
                });
            

            return new Result<object>(true, ResultStatusCode.Success, null, redirectUrl);
        }
    }
    
}
