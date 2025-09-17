using Domain;
using Application.Contracts.Persistence;
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

        public async Task<IReadOnlyList<HealthReport>> GetReportByUserIdAsync(string userId)
        {
            var reports =   _dbContext.HealthReports.
                Where(r => r.UserId == userId);

            return new List<HealthReport>(reports);
        }


    }
}
