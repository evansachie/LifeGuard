using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Configurations
{
    public class EmergencyContactConfiguration : IEntityTypeConfiguration<EmergencyContacts>
    {
        public void Configure(EntityTypeBuilder<EmergencyContacts> builder)
        {
            builder.HasData(
                new EmergencyContacts { 
                
                    Id = 1,
                    Name = "Ambulance Service",
                    Email = "info@moh.gov.gh",
                    Phone = "0505982870",
                    UserId = Guid.NewGuid().ToString(),

                });
        }

    }
}
