using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IEncryptionHelper
    {
        string Encrypt(byte[] data);

        byte[] Decrypt(string encrypted);
    }
}
