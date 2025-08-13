using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Status
    {
        public bool Connected { get; set; }
        public string DeviceName { get; set; }
        public string LastDataKey { get; set; }
        public long LastSeen { get; set; }
        public DateTime LastUpdate { get; set; }
    }
}
