using Domain;
using Domain.Contracts.PDFService;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Infrastructure.PDFService
{
    public class PDFGeneratorService : IPDFGeneratorService
    {
        public byte[] GenerateHealthReportPdf(HealthReport report)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Text($"Health Report for Device: {report.DeviceId}")
                        .FontSize(18).Bold().FontColor(Colors.Blue.Medium);

                    page.Content().PaddingVertical(1, Unit.Centimetre).Column(col =>
                    {
                        col.Item().Text($"Report Date: {report.ReportDate.ToShortDateString()}");
                        col.Item().Text($"Reporting Period: {report.ReportPeriod}");
                        col.Item().Text($"Total Steps: {report.TotalSteps}");
                        col.Item().Text($"Average Daily Steps: {report.AvgDailySteps}");
                        col.Item().Text($"Average Ambient Temperature: {report.AvgAmbientTemp:F1} °C");
                        col.Item().Text($"Average Humidity: {report.AvgHumidity}%");
                        col.Item().Text($"Average Air Quality Index (AQI): {report.AvgAirQualityIndex}");
                        col.Item().Text($"Health Status: {report.Status}");
                        col.Item().Text($"Total Data Points: {report.DataPointCount}");
                    });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.CurrentPageNumber();
                            x.Span(" / ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }
    }
}
