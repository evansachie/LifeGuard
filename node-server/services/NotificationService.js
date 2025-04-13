const nodemailer = require('nodemailer');

class NotificationService {
  constructor(pool) {
    this.pool = pool;
    this.transporter = nodemailer.createTransport({
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
      const result = await client.query(`
        SELECT m.*, u.email 
        FROM "Medications" m
        JOIN "Users" u ON m."UserId" = u."Id"
        WHERE m."Active" = true
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

  async sendEmailReminder(medication, time) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: medication.email,
        subject: 'Medication Reminder',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563EB;">Medication Reminder</h2>
            <p>Hello,</p>
            <p>It's time to take your medication:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Medication:</strong> ${medication.Name}</p>
              <p style="margin: 5px 0;"><strong>Dosage:</strong> ${medication.Dosage}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              ${medication.Notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${medication.Notes}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 0.9em;">Please ensure to track your medication in the LifeGuard app.</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder sent for ${medication.Name} scheduled at ${time}`);
    } catch (error) {
      console.error('Failed to send reminder email:', error);
    }
  }

  // New method to schedule all reminders for the day
  async scheduleRemindersForDay() {
    const client = await this.pool.connect();
    try {
      // Get all active medications with their next reminder time and user preferences
      const result = await client.query(`
        SELECT 
          m.*,
          u.email,
          COALESCE(np."EmailNotifications", true) as email_enabled,
          COALESCE(np."ReminderLeadTime", 15) as reminder_lead_time
        FROM "Medications" m
        JOIN "Users" u ON m."UserId" = u."Id"
        LEFT JOIN "UserNotificationPreferences" np ON m."UserId" = np."UserId"
        WHERE 
          m."Active" = true
          AND m."StartDate" <= CURRENT_DATE
          AND (m."EndDate" IS NULL OR m."EndDate" >= CURRENT_DATE)
      `);

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      for (const med of result.rows) {
        // Schedule reminders only if notifications are enabled
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
