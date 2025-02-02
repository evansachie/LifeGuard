using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Application.Contracts
{
    public interface IOTPService
    {
        public byte[] GenerateSecretKey(int keySize = 20);

        public string GenerateOtp(byte[] secretKey);

        public bool ValidateOtp(byte[] secretKey, string providedOtp);

        public  Task SendOtpEmailAsync(string email, byte[] secretKey);
    }
}
