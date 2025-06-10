import jsPDF from 'jspdf';
import { HealthReportData } from '../data/health-report-data';

export const generateHealthReportPDF = (report: HealthReportData): Promise<Blob> => {
  return new Promise((resolve) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(66, 133, 244);
    pdf.text('LifeGuard Health Report', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Report ID: ${report.userInfo.reportId}`, margin, yPosition);
    pdf.text(`Date: ${report.userInfo.date}`, pageWidth - 80, yPosition);

    yPosition += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Patient: ${report.userInfo.name}`, margin, yPosition);

    // Vital Statistics
    yPosition += 20;
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 127);
    pdf.text('Vital Statistics', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    Object.entries(report.vitals).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      pdf.text(`${label}: ${value.average} (${value.status})`, margin, yPosition);
      pdf.text(`Range: ${value.min} - ${value.max}`, margin + 100, yPosition);
      yPosition += 8;
    });

    // Environmental Metrics
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Environmental Metrics', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    Object.entries(report.environmentalMetrics).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      pdf.text(`${label}: ${value.average} (${value.status})`, margin, yPosition);
      yPosition += 8;
    });

    // Activity Metrics
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setTextColor(34, 197, 94);
    pdf.text('Activity Metrics', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    Object.entries(report.activityMetrics).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      pdf.text(`${label}: ${value.average} (${value.status})`, margin, yPosition);
      pdf.text(`Goal: ${value.goal}`, margin + 100, yPosition);
      yPosition += 8;
    });

    // Recommendations
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setTextColor(147, 51, 234);
    pdf.text('Health Recommendations', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    report.recommendations.forEach((rec, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
    });

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    resolve(pdfBlob);
  });
};
