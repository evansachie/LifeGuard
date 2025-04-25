using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DotNetEnv;

namespace Identity.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            var env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            if (env == "Development")
            {
                Env.Load("../.env.local");
            }
            else
            {
                Env.Load("../.env");
            }

            var admin_password = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
            var app_user_password = Environment.GetEnvironmentVariable("APP_USER_PASSWORD");

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
                     PasswordHash = hasher.HashPassword(null, admin_password),
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
                     PasswordHash = hasher.HashPassword(null, app_user_password),
                     EmailConfirmed = true
                 }
            );

        }
    }
}
