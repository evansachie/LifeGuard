using Domain;
using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Memos : BaseEntity
    {
        public string Text { get; set; }
        public bool Done { get; set; } = false;

        
    }
}
