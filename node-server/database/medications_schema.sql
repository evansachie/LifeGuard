-- Medications table
CREATE TABLE "Medications" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Dosage" VARCHAR(100) NOT NULL,
    "Frequency" VARCHAR(50) NOT NULL,
    "Time" TIME[] NOT NULL,
    "StartDate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "EndDate" DATE,
    "Notes" TEXT,
    "Active" BOOLEAN DEFAULT true,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication tracking table
CREATE TABLE "MedicationTracking" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "MedicationId" INTEGER REFERENCES "Medications"("Id") ON DELETE CASCADE,
    "Taken" BOOLEAN NOT NULL,
    "ScheduledTime" TIME NOT NULL,
    "TakenAt" TIMESTAMP,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication reminders table
CREATE TABLE "MedicationReminders" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "MedicationId" INTEGER REFERENCES "Medications"("Id") ON DELETE CASCADE,
    "ReminderTime" TIME NOT NULL,
    "Active" BOOLEAN DEFAULT true,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User notification preferences table
CREATE TABLE "UserNotificationPreferences" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "EmailNotifications" BOOLEAN DEFAULT true,
    "ReminderLeadTime" INTEGER DEFAULT 15, -- minutes before medication time
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("UserId")
);

-- Indexes for better query performance
CREATE INDEX idx_medications_user ON "Medications" ("UserId");
CREATE INDEX idx_medication_tracking_user ON "MedicationTracking" ("UserId");
CREATE INDEX idx_medication_tracking_date ON "MedicationTracking" ("TakenAt");
CREATE INDEX idx_medication_reminders_user ON "MedicationReminders" ("UserId", "Active");
CREATE INDEX idx_user_notification_prefs ON "UserNotificationPreferences" ("UserId");
