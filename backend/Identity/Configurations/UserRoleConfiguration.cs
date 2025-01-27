using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Configurations
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<string>>
    {
        public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
        {
            builder.HasData(
                new IdentityUserRole<string>
                {
                    RoleId = "b760fe05-a63f-43d0-9267-5a46c95kdsie",
                    UserId = "7a223968-23b4-4652-z7b7-8574d048cdb9"
                },

                new IdentityUserRole<string>
                {
                    RoleId = "1d32w46b-c7e5-4a43-be1a-eb2e88f09f82",
                    UserId = "88k76378-681a-4044-97ed-4ab612217206"
                }
                );
        }
    }
}
