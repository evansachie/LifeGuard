using Application.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.EncryptionHelper
{
    public class EncryptionHelper : IEncryptionHelper
    {   
        private  readonly byte[] AesKey = Convert.FromBase64String(Environment.GetEnvironmentVariable("AES_SECRET_KEY"));
          
        public string Encrypt(byte[] data)
        {
            using var aes = Aes.Create();
            aes.Key = AesKey;
            aes.GenerateIV(); 

            using var encryptor = aes.CreateEncryptor();
            using var ms = new MemoryStream();
            ms.Write(aes.IV, 0, aes.IV.Length); 

            using var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
            cs.Write(data, 0, data.Length);
            cs.FlushFinalBlock();

            return Convert.ToBase64String(ms.ToArray());
        }

        public  byte[] Decrypt(string encrypted)
        {
            var fullCipher = Convert.FromBase64String(encrypted);
            using var aes = Aes.Create();
            aes.Key = AesKey;


            var iv = new byte[16];
            Array.Copy(fullCipher, 0, iv, 0, iv.Length);
            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor();
            using var ms = new MemoryStream(fullCipher, 16, fullCipher.Length - 16);
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);

            using var result = new MemoryStream();
            cs.CopyTo(result);

            return result.ToArray();
        }
    }
}
