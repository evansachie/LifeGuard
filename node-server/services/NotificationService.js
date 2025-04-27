const nodemailer = require('nodemailer');
const { sendMedicationReminderEmail } = require('./emailService');

class NotificationService {
  constructor(pool, transporter = null) {
    this.pool = pool;
    this.transporter = transporter || nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async checkAndSendReminders() {
    const client = await this.pool.connect();
    try {
      // Only query from tables we know exist
      const result = await client.query(`
        SELECT m.*, p."EmailNotifications", p."ReminderLeadTime"
        FROM "Medications" m
        LEFT JOIN "UserNotificationPreferences" p ON m."UserId" = p."UserId"
        WHERE m."Active" = true
          AND m."StartDate" <= CURRENT_DATE
          AND (m."EndDate" IS NULL OR m."EndDate" >= CURRENT_DATE)
      `);

      for (const med of result.rows) {
        this.processReminders(med);
      }
    } finally {
      client.release();
    }
  }

  async processReminders(medication) {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];
    
    medication.Time.forEach(async (time) => {
      if (this.isWithinReminderWindow(currentTime, time, 15)) {
        await this.sendEmailReminder(medication, time);
      }
    });
  }

  isWithinReminderWindow(currentTime, scheduledTime, minutesBefore) {
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    const [scheduleHour, scheduleMin] = scheduledTime.split(':').map(Number);

    // Convert both times to minutes for easier comparison
    const currentTotalMins = currentHour * 60 + currentMin;
    const scheduleTotalMins = scheduleHour * 60 + scheduleMin;

    // Check if current time is within the reminder window
    return currentTotalMins >= (scheduleTotalMins - minutesBefore) && 
           currentTotalMins <= scheduleTotalMins;
  }

  async getUserEmail(userId) {
    try {
      const client = await this.pool.connect();
      try {
        // First try to get from UserNotificationPreferences
        const prefResult = await client.query(
          `SELECT m."UserId", m."Email" as email
           FROM "Medications" m
           WHERE m."UserId" = $1
           LIMIT 1`,
          [userId]
        );
        
        if (prefResult.rows.length > 0 && prefResult.rows[0].email) {
          return prefResult.rows[0].email;
        }
        
        // If no email found, return null - the JWT token's email will be used as fallback
        return null;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }

  async sendEmailReminder(medication, time, userEmailFromJWT = null) {
    try {
      // Always prefer the JWT email if provided, fallback to DB otherwise
      let userEmail = userEmailFromJWT || medication.email;
      if (!userEmail) {
        userEmail = await this.getUserEmail(medication.UserId);
      }
      if (!userEmail) {
        console.error('No user email found for medication reminder');
        return;
      }
      // Compose medication data for the template
      const medData = {
        Name: medication.Name,
        Dosage: medication.Dosage,
        Time: time,
        Notes: medication.Notes || ''
      };
      const result = await sendMedicationReminderEmail(userEmail, medData);
      if (result.success) {
        console.log(`Medication reminder email sent for ${medication.Name} at ${time}`);
      } else {
        console.error('Failed to send medication reminder email:', result.error);
      }
    } catch (error) {
      console.error('Failed to send reminder email:', error);
    }
  }

  async scheduleRemindersForDay() {
    const client = await this.pool.connect();
    try {
      // Get all active medications with their next reminder time and user preferences
      const result = await client.query(`
        SELECT 
          m.*,
          COALESCE(p."EmailNotifications", true) as email_enabled,
          COALESCE(p."ReminderLeadTime", 15) as reminder_lead_time
        FROM "Medications" m
        LEFT JOIN "UserNotificationPreferences" p ON m."UserId" = p."UserId"
        WHERE 
          m."Active" = true
          AND m."StartDate" <= CURRENT_DATE
          AND (m."EndDate" IS NULL OR m."EndDate" >= CURRENT_DATE)
      `);

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      for (const med of result.rows) {
        if (med.email_enabled) {
          med.Time.forEach(time => {
            const [hours, minutes] = time.split(':');
            const reminderTime = new Date(today);
            reminderTime.setHours(hours, minutes - med.reminder_lead_time, 0);

            if (reminderTime > now) {
              const delay = reminderTime.getTime() - now.getTime();
              setTimeout(() => this.sendEmailReminder(med, time), delay);
            }
          });
        }
      }
    } finally {
      client.release();
    }
  }
}

module.exports = NotificationService;
