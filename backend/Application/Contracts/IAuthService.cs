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

        Task<Result> Login(AuthRequest request);

        Task<Result> Register(RegistrationRequest request);

        Task<Result<string>> ForgotPasswordAsync(ForgotPasswordRequest request);

        Task<Result<string>> ResetPasswordAsync(ResetPasswordRequest request);

        Task<GetUserResponse?> GetUserById(string id);

        Task<bool> DeleteUser(string id);

    }
}
