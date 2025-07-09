using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Contracts.PDFService
{
    public interface IPDFGeneratorService
    {
        byte[] GenerateHealthReportPdf(HealthReport report);
    }
}
