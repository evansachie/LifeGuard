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

        public string GenerateOtp(string encryptedSecretKey);

        public bool ValidateOtp(string encryptedSecretKey, string providedOtp);

        public  Task SendOtpEmailAsync(string email, string encryptedSecretKey);
    }
}
