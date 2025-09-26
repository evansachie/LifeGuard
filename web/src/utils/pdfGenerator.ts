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

export interface MixedHealthReportData {
  enhancedReport?: EnhancedHealthReportData;
  healthReportData?: {
    avgAmbientTemp?: number;
    avgHumidity?: number;
    totalSteps?: number;
    avgDailySteps?: number;
    avgAirQualityIndex?: number;
    avgHeartRate?: number;
    avgbloodPressureSystolic?: number;
    avgbloodPressureDiastolic?: number;
    avgOxygenSaturation?: number;
    avgBodyTemperature?: number;
    fallCount?: number;
    avgco2?: number;
    avgvoc?: number;
    avgpm25?: number;
    avgpm10?: number;
    avgPressure?: number;
    dataPointCount?: number;
    reportPeriod?: string;
  };
}

export const generateHealthReportPDF = (
  report: EnhancedHealthReportData | MixedHealthReportData
): Promise<Blob> => {
  return new Promise((resolve) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Determine if we have mixed data or enhanced report
    const isEnhancedReport = 'userInfo' in report;
    const enhancedData = isEnhancedReport
      ? (report as EnhancedHealthReportData)
      : (report as MixedHealthReportData).enhancedReport;
    const healthApiData = !isEnhancedReport
      ? (report as MixedHealthReportData).healthReportData
      : undefined;

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

    const reportId = enhancedData?.userInfo?.reportId || `LG-${Date.now()}`;
    const reportDate = enhancedData?.userInfo?.date || new Date().toLocaleDateString();

    pdf.text(`Report ID: ${reportId}`, margin, yPosition);
    pdf.text(`Generated: ${reportDate}`, pageWidth - 80, yPosition);

    // Patient Information Section (if available)
    if (enhancedData?.userInfo) {
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Patient Information', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(11);
      pdf.text(`Name: ${enhancedData.userInfo.name}`, margin, yPosition);
      if (enhancedData.userInfo.age) {
        pdf.text(`Age: ${enhancedData.userInfo.age}`, margin + 80, yPosition);
      }
      if (enhancedData.userInfo.gender) {
        pdf.text(`Gender: ${enhancedData.userInfo.gender}`, margin + 120, yPosition);
      }

      yPosition += 8;
      if (enhancedData.userInfo.email) {
        pdf.text(`Email: ${enhancedData.userInfo.email}`, margin, yPosition);
      }
      if (enhancedData.userInfo.phone) {
        pdf.text(`Phone: ${enhancedData.userInfo.phone}`, margin + 80, yPosition);
      }
    }

    // Real-Time Health Metrics from Arduino (if available)
    if (healthApiData) {
      checkPageBreak(120);
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text('Real-Time Health Metrics (Arduino Sensors)', margin, yPosition);

      yPosition += 15;
      pdf.setFontSize(11);

      // Vital Signs
      if (healthApiData.avgHeartRate) {
        pdf.text(`Heart Rate: ${healthApiData.avgHeartRate.toFixed(0)} bpm`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgOxygenSaturation) {
        pdf.text(
          `Oxygen Saturation: ${healthApiData.avgOxygenSaturation.toFixed(1)}%`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      if (typeof healthApiData.fallCount !== 'undefined') {
        pdf.text(`Fall Incidents: ${healthApiData.fallCount}`, margin, yPosition);
        yPosition += 8;
      }

      // Environmental Metrics
      if (healthApiData.avgAmbientTemp) {
        pdf.text(
          `Ambient Temperature: ${healthApiData.avgAmbientTemp.toFixed(1)}°C`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      if (healthApiData.avgHumidity) {
        pdf.text(`Humidity: ${healthApiData.avgHumidity.toFixed(1)}%`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgPressure) {
        pdf.text(
          `Atmospheric Pressure: ${healthApiData.avgPressure.toFixed(1)} hPa`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      if (healthApiData.avgAirQualityIndex) {
        pdf.text(
          `Air Quality Index: ${healthApiData.avgAirQualityIndex.toFixed(0)} AQI`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      // Air Quality Components
      if (healthApiData.avgco2) {
        pdf.text(`CO2 Level: ${healthApiData.avgco2.toFixed(1)} ppm`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgpm25) {
        pdf.text(`PM2.5: ${healthApiData.avgpm25} µg/m³`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgpm10) {
        pdf.text(`PM10: ${healthApiData.avgpm10} µg/m³`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgvoc) {
        pdf.text(`VOC: ${healthApiData.avgvoc}`, margin, yPosition);
        yPosition += 8;
      }

      // Activity Metrics
      if (healthApiData.totalSteps) {
        pdf.text(`Total Steps: ${healthApiData.totalSteps.toLocaleString()}`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgDailySteps) {
        pdf.text(
          `Daily Average Steps: ${healthApiData.avgDailySteps.toLocaleString()}`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      // Report Summary
      if (healthApiData.dataPointCount) {
        yPosition += 5;
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Data Points Analyzed: ${healthApiData.dataPointCount.toLocaleString()}`,
          margin,
          yPosition
        );
        yPosition += 6;
      }

      if (healthApiData.reportPeriod) {
        pdf.text(`Report Period: ${healthApiData.reportPeriod}`, margin, yPosition);
        yPosition += 6;
      }
    }

    // Vital Statistics (prioritize API data over enhanced report)
    if (
      healthApiData &&
      (healthApiData.avgHeartRate ||
        healthApiData.avgOxygenSaturation ||
        healthApiData.avgBodyTemperature)
    ) {
      checkPageBreak(60);
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('Vital Statistics (Real-time)', margin, yPosition);

      yPosition += 15;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      if (healthApiData.avgHeartRate) {
        pdf.text(`Heart Rate: ${healthApiData.avgHeartRate.toFixed(0)} bpm`, margin, yPosition);
        yPosition += 8;
      }

      if (healthApiData.avgOxygenSaturation) {
        pdf.text(
          `Oxygen Saturation: ${healthApiData.avgOxygenSaturation.toFixed(1)}%`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      if (healthApiData.avgBodyTemperature) {
        pdf.text(
          `Body Temperature: ${healthApiData.avgBodyTemperature.toFixed(1)}°C`,
          margin,
          yPosition
        );
        yPosition += 8;
      }
    } else if (enhancedData?.vitals) {
      checkPageBreak(60);
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('Vital Statistics', margin, yPosition);

      yPosition += 15;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      Object.entries(enhancedData.vitals).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        pdf.text(`${label}: ${value.average} (${value.status})`, margin, yPosition);
        pdf.text(`Range: ${value.min} - ${value.max}`, margin + 100, yPosition);
        yPosition += 8;
      });
    }

    // Health Metrics (if available)
    if (enhancedData?.healthMetrics) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text('Health Metrics', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      if (enhancedData.healthMetrics.bmr) {
        pdf.text(`BMR: ${enhancedData.healthMetrics.bmr} calories/day`, margin, yPosition);
        yPosition += 8;
      }
      if (enhancedData.healthMetrics.tdee) {
        pdf.text(`TDEE: ${enhancedData.healthMetrics.tdee} calories/day`, margin, yPosition);
        yPosition += 8;
      }
      if (enhancedData.healthMetrics.bmi) {
        pdf.text(`BMI: ${enhancedData.healthMetrics.bmi.toFixed(1)}`, margin, yPosition);
        yPosition += 8;
      }
      if (enhancedData.healthMetrics.activityLevel) {
        pdf.text(`Activity Level: ${enhancedData.healthMetrics.activityLevel}`, margin, yPosition);
        yPosition += 8;
      }
    }

    // Activity Metrics (if available)
    if (enhancedData?.activityMetrics) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text('Exercise & Activity', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      Object.entries(enhancedData.activityMetrics).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        pdf.text(`${label}: ${value.value} (${value.status})`, margin, yPosition);
        pdf.text(`Goal: ${value.goal}`, margin + 100, yPosition);
        yPosition += 8;
      });
    }

    // Medications (if available)
    if (enhancedData?.medications && enhancedData.medications.length > 0) {
      checkPageBreak(60);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(147, 51, 234);
      pdf.text('Current Medications', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      enhancedData.medications.forEach((med) => {
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
    if (enhancedData?.emergencyContacts && enhancedData.emergencyContacts.length > 0) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(239, 68, 68);
      pdf.text('Emergency Contacts', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      enhancedData.emergencyContacts.forEach((contact) => {
        pdf.text(`${contact.name} (${contact.relationship})`, margin, yPosition);
        pdf.text(`${contact.phone}`, margin + 80, yPosition);
        yPosition += 8;
      });
    }

    // Environmental Metrics (prioritize API data over enhanced data)
    if (
      healthApiData &&
      (healthApiData.avgAmbientTemp ||
        healthApiData.avgHumidity ||
        healthApiData.avgPressure ||
        healthApiData.avgAirQualityIndex)
    ) {
      checkPageBreak(60);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('Environmental Metrics (Real-time)', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      if (healthApiData.avgAmbientTemp) {
        pdf.text(`Temperature: ${healthApiData.avgAmbientTemp.toFixed(1)}°C`, margin, yPosition);
        yPosition += 8;
      }
      if (healthApiData.avgHumidity) {
        pdf.text(`Humidity: ${healthApiData.avgHumidity.toFixed(1)}%`, margin, yPosition);
        yPosition += 8;
      }
      if (healthApiData.avgPressure) {
        pdf.text(`Pressure: ${healthApiData.avgPressure.toFixed(1)} hPa`, margin, yPosition);
        yPosition += 8;
      }
      if (healthApiData.avgAirQualityIndex) {
        pdf.text(
          `Air Quality: ${healthApiData.avgAirQualityIndex.toFixed(0)} AQI`,
          margin,
          yPosition
        );
        yPosition += 8;
      }
    } else if (enhancedData?.environmentalMetrics) {
      checkPageBreak(60);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('Environmental Metrics', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      Object.entries(enhancedData.environmentalMetrics).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        pdf.text(`${label}: ${value.average} (${value.status})`, margin, yPosition);
        yPosition += 8;
      });
    }

    // Recent Notes (if available)
    if (enhancedData?.recentNotes && enhancedData.recentNotes.length > 0) {
      checkPageBreak(50);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(16, 185, 129);
      pdf.text('Recent Health Notes', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      enhancedData.recentNotes.slice(0, 5).forEach((note) => {
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

    // Recommendations (if available)
    if (enhancedData?.recommendations && enhancedData.recommendations.length > 0) {
      checkPageBreak(60);
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(147, 51, 234);
      pdf.text('Health Recommendations', margin, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      enhancedData.recommendations.forEach((rec, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin);

        // Check if we need a new page for this recommendation
        checkPageBreak(lines.length * 5 + 5);

        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 3;
      });
    }

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
