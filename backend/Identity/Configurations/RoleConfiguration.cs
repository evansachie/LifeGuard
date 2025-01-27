using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Identity.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
                new IdentityRole
                {
                    Id = "b760fe05-a63f-43d0-9267-5a46c95kdsie",
                    Name = "Student",
                    NormalizedName = "Student".ToUpper(),
                },

                new IdentityRole
                {
                    Id = "1d32w46b-c7e5-4a43-be1a-eb2e88f09f82",
                    Name = "Administrator",
                    NormalizedName = "Administrator".ToUpper()
                }
            );
        }
    }
}
