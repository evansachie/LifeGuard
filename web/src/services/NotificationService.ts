interface Medication {
  Name: string;
  Dosage: string;
  Time: string[];
  [key: string]: any;
}

class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async scheduleNotification(medication: Medication): Promise<void> {
    const isPermissionGranted = await this.requestPermission();
    if (!isPermissionGranted) return;

    medication.Time.forEach((time: string) => {
      const [hours, minutes] = time.split(':');
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hours),
        parseInt(minutes)
      );

      // If time has passed today, schedule for tomorrow
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      // Schedule notification
      setTimeout(() => {
        this.showNotification(medication, time);
      }, timeUntilNotification);
    });
  }

  static showNotification(medication: Medication, time: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medication Reminder', {
        body: `Time to take ${medication.Name} (${medication.Dosage}) at ${time}`,
        icon: '/path-to-your-icon.png',
        badge: '/path-to-your-badge.png',
      });
    }
  }
}

export default NotificationService;
