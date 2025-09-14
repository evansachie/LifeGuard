using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Persistence
{
    public interface IHealthReportRepository : IGenericRepository<HealthReport>
    {
        Task<IReadOnlyList<HealthReport>> GetReportByUserIdAsync(string userId);

    }
}
