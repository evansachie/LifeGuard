using Application.Models;
using Application.Models.ApiResult;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IAuthService
    {

        Task<AuthResponse> Login(AuthRequest request);

        Task<RegistrationResponse> Register(RegistrationRequest request);

        Task<Result<string>> ForgotPasswordAsync(ForgotPasswordRequest request);

        Task<Result<string>> ResetPasswordAsync(ResetPasswordRequest request);

        Task<GetUserResponse> GetUserById(string id);

    }
}
