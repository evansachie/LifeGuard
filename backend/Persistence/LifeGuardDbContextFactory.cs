using DotNetEnv;
using Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class LifeGuardDbContextFactory : IDesignTimeDbContextFactory<LifeGuardDbContext>
    {
        public LifeGuardDbContext CreateDbContext(string[] args)
        {
            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "../LifeGuard");
            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<LifeGuardDbContext>();

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

            return new LifeGuardDbContext(builder.Options);
        }
    }
}
