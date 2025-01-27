using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public byte[] SecretKey { get; private set; }
        public ApplicationUser()
        {
            SecretKey = GenerateSecretKey(32);
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
    }
}
