using Identity.Models;
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
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            var hasher = new PasswordHasher<ApplicationUser>();
            builder.HasData(
                 new ApplicationUser
                 {
                     Id = "88k76378-681a-4044-97ed-4ab612217206",
                     Email = "smartshuttle4@gmail.com",
                     NormalizedEmail = "SMARTSHUTTLE4@GMAIL.COM",
                     Name = "System Admin",
                     UserName = "admin@localhost.com",
                     NormalizedUserName = "ADMIN@LOCALHOST.COM",
                     PasswordHash = hasher.HashPassword(null, "P@ssword1"),
                     EmailConfirmed = true
                 },
                 new ApplicationUser
                 {
                     Id = "7a223968-23b4-4652-z7b7-8574d048cdb9",
                     Email = "madugyamfi76@gmail.com",
                     NormalizedEmail = "madugyamfi76@gmail.com",
                     Name = "Michael Adu-Gyamfi",
                     UserName = "madugyamfi76@gmail.com",
                     NormalizedUserName = "madugyamfi76@gmail.com",
                     PasswordHash = hasher.HashPassword(null, "password123"),
                     EmailConfirmed = true
                 }
            );

        }
    }
}
