using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DotNetEnv;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity
{
    public class LifeGuardIdentityDbContextFactory : IDesignTimeDbContextFactory<LifeGuardIdentityDbContext>
    {
        public LifeGuardIdentityDbContext CreateDbContext(string[] args)
        {
            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "../LifeGuard_API");
            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json")
                .Build();
            var builder = new DbContextOptionsBuilder<LifeGuardIdentityDbContext>();

            string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            if (env == "Development")
            {
                Env.Load("../.env.local");

            }
            else
            {
                Env.Load("../.env");

            }
            var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
            builder.UseNpgsql(connectionString);

            return new LifeGuardIdentityDbContext(builder.Options);
        }
    }
}

