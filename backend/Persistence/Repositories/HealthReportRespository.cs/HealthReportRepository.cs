using Application.Contracts.Persistence;
using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories.HealthReportRespository
{
    public class HealthReportRepository : GenericRepository<HealthReport>, IHealthReportRepository
    {
        private readonly LifeGuardDbContext _dbContext;
        public HealthReportRepository(LifeGuardDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<HealthReport>> GetReportsByUserIdAsync(string userId)
        {
            return await _dbContext.HealthReports
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }


    }
}
