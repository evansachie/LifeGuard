using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Identity.Models;
using Domain.Common;

namespace Domain
{
    public class EmergencyContacts : BaseEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }   
        public string Phone { get; set; }
        public string Relationship { get; set; }
    }
}
