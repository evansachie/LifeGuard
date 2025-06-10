import jsPDF from 'jspdf';

export interface EnhancedHealthReportData {
  userInfo: {
    reportId: string;
    date: string;
    name: string;
    age?: number;
    gender?: string;
    email?: string;
    phone?: string;
    bio?: string;
  };
  vitals: {
    heartRate: { average: string; min: string; max: string; status: string };
    bloodPressure: { average: string; min: string; max: string; status: string };
    bodyTemperature: { average: string; min: string; max: string; status: string };
    oxygenSaturation: { average: string; min: string; max: string; status: string };
  };
  healthMetrics?: {
    bmr?: number;
    tdee?: number;
    bmi?: number;
    idealWeight?: { min: number; max: number };
    activityLevel?: string;
    goal?: string;
  };
  activityMetrics?: {
    totalWorkouts: { value: number; status: string; goal: string };
    caloriesBurned: { value: number; status: string; goal: string };
    currentStreak: { value: number; status: string; goal: string };
  };
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    active: boolean;
  }>;
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  recentNotes?: Array<{
    content: string;
    date: string;
    isCompleted: boolean;
  }>;
  wellnessData?: {
    favoriteSounds: Array<{ name: string; category: string }>;
    preferredCategories: string[];
  };
  environmentalMetrics: {
    airQuality: { average: string; status: string; pollutants?: any };
    temperature: { average: string; status: string };
    humidity: { average: string; status: string };
    pressure: { average: string; status: string };
  };
  recommendations: string[];
}

export const generateHealthReportPDF = (report: EnhancedHealthReportData): Promise<Blob> => {
  return new Promise((resolve) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage();
        yPosition = 30;
      }
    };

    // Header with LifeGuard branding
    pdf.setFontSize(24);
    pdf.setTextColor(66, 133, 244);
    pdf.text('LifeGuard Health Report', margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Report ID: ${report.userInfo.reportId}`, margin, yPosition);
    pdf.text(`Generated: ${report.userInfo.date}`, pageWidth - 80, yPosition);

    // Patient Information Section
    yPosition += 20;
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Patient Information', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(11);
    pdf.text(`Name: ${report.userInfo.name}`, margin, yPosition);
    if (report.userInfo.age) {
      pdf.text(`Age: ${report.userInfo.age}`, margin + 80, yPosition);
    }
    if (report.userInfo.gender) {
      pdf.text(`Gender: ${report.userInfo.gender}`, margin + 120, yPosition);
    }

    yPosition += 8;
    if (report.userInfo.email) {
      pdf.text(`Email: ${report.userInfo.email}`, margin, yPosition);
    }
    if (report.userInfo.phone) {
      pdf.text(`Phone: ${report.userInfo.phone}`, margin + 80, yPosition);
    }

    // Vital Statistics
    checkPageBreak(60);
    yPosition += 20;
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 127);
    pdf.text('Vital Statistics', margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    Object.entries(report.vitals).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      pdf.text(`${label}: ${value.average} (${value.status})`, margin, yPosition);
      pdf.text(`Range: ${value.min} - ${value.max}`, margin + 100, yPosition);
      yPosition += 8;
    });

    // Health Metrics (if available)
    if (report.healthMetrics) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text('Health Metrics', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      if (report.healthMetrics.bmr) {
        pdf.text(`BMR: ${report.healthMetrics.bmr} calories/day`, margin, yPosition);
        yPosition += 8;
      }
      if (report.healthMetrics.tdee) {
        pdf.text(`TDEE: ${report.healthMetrics.tdee} calories/day`, margin, yPosition);
        yPosition += 8;
      }
      if (report.healthMetrics.bmi) {
        pdf.text(`BMI: ${report.healthMetrics.bmi.toFixed(1)}`, margin, yPosition);
        yPosition += 8;
      }
      if (report.healthMetrics.activityLevel) {
        pdf.text(`Activity Level: ${report.healthMetrics.activityLevel}`, margin, yPosition);
        yPosition += 8;
      }
    }

    // Activity Metrics (if available)
    if (report.activityMetrics) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text('Exercise & Activity', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      Object.entries(report.activityMetrics).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        pdf.text(`${label}: ${value.value} (${value.status})`, margin, yPosition);
        pdf.text(`Goal: ${value.goal}`, margin + 100, yPosition);
        yPosition += 8;
      });
    }

    // Medications (if available)
    if (report.medications && report.medications.length > 0) {
      checkPageBreak(60);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(147, 51, 234);
      pdf.text('Current Medications', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      report.medications.forEach((med) => {
        pdf.text(`${med.name} - ${med.dosage}`, margin, yPosition);
        pdf.text(
          `${med.frequency} (${med.active ? 'Active' : 'Inactive'})`,
          margin + 80,
          yPosition
        );
        yPosition += 8;
      });
    }

    // Emergency Contacts (if available)
    if (report.emergencyContacts && report.emergencyContacts.length > 0) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(239, 68, 68);
      pdf.text('Emergency Contacts', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      report.emergencyContacts.forEach((contact) => {
        pdf.text(`${contact.name} (${contact.relationship})`, margin, yPosition);
        pdf.text(`${contact.phone}`, margin + 80, yPosition);
        yPosition += 8;
      });
    }

    // Environmental Metrics
    checkPageBreak(60);
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

    // Recent Notes (if available)
    if (report.recentNotes && report.recentNotes.length > 0) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(16, 185, 129);
      pdf.text('Recent Health Notes', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      report.recentNotes.slice(0, 5).forEach((note) => {
        const noteText =
          note.content.length > 60 ? note.content.substring(0, 60) + '...' : note.content;
        pdf.text(`• ${noteText}`, margin, yPosition);
        pdf.text(
          `${note.date} (${note.isCompleted ? 'Completed' : 'Pending'})`,
          margin + 5,
          yPosition + 5
        );
        yPosition += 12;
      });
    }

    // Recommendations
    checkPageBreak(60);
    yPosition += 15;
    pdf.setFontSize(16);
    pdf.setTextColor(147, 51, 234);
    pdf.text('Health Recommendations', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    report.recommendations.forEach((rec, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin);

      // Check if we need a new page for this recommendation
      checkPageBreak(lines.length * 5 + 5);

      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 3;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'Generated by LifeGuard Health Monitoring System',
      margin,
      pdf.internal.pageSize.getHeight() - 15
    );
    pdf.text(
      'This report is for informational purposes only. Consult healthcare professionals for medical advice.',
      margin,
      pdf.internal.pageSize.getHeight() - 10
    );

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    resolve(pdfBlob);
  });
};
