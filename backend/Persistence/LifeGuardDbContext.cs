using Domain;
using Domain.Common;
using Identity.Models;
using Microsoft.EntityFrameworkCore;
using Persistence.Configurations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class LifeGuardDbContext : DbContext
    {
        public LifeGuardDbContext(DbContextOptions<LifeGuardDbContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Ignore<ApplicationUser>();

            modelBuilder.ApplyConfiguration(new MemoConfiguration());
            modelBuilder.ApplyConfiguration(new EmergencyContactConfiguration());
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach(var entry in ChangeTracker.Entries<BaseEntity>()) 
            {
                entry.Entity.UpDatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Added) 
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);

        }

        public DbSet<Memos> Memos { get; set; }
        public DbSet<EmergencyContacts> EmergencyContacts { get; set; }
        public DbSet<HealthReport> HealthReports { get; set; }
        }   
}
