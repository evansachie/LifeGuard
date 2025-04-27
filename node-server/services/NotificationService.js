const nodemailer = require('nodemailer');
const axios = require('axios');
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
      // Fetch user email from .NET backend
      const url = `https://lifeguard-hiij.onrender.com/api/Account/${userId}`;
      const response = await axios.get(url);
      if (response.data && response.data.email) {
        return response.data.email;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user email from .NET backend:', error.message);
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
      console.log(`[Scheduler] Running at ${now.toISOString()}`);
      let scheduledCount = 0;
      for (const med of result.rows) {
        if (med.email_enabled) {
          med.Time.forEach(time => {
            const [hours, minutes] = time.split(':');
            const reminderTime = new Date(today);
            reminderTime.setHours(hours, minutes - med.reminder_lead_time, 0);
            console.log(`[Scheduler] Checking med '${med.Name}' for user ${med.UserId} at ${time} (reminder at ${reminderTime.toLocaleTimeString()})`);
            if (reminderTime > now) {
              const delay = reminderTime.getTime() - now.getTime();
              setTimeout(() => {
                console.log(`[Scheduler] Sending reminder for '${med.Name}' at ${time} (scheduled for ${reminderTime.toLocaleTimeString()})`);
                this.sendEmailReminder(med, time);
              }, delay);
              scheduledCount++;
            }
          });
        }
      }
      console.log(`[Scheduler] Total reminders scheduled: ${scheduledCount}`);
    } finally {
      client.release();
    }
  }
}

module.exports = NotificationService;
