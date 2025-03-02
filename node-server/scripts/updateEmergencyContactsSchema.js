const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL pool configuration
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database schema update...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // 1. Add new columns to EmergencyContacts table
    console.log('Adding new columns to EmergencyContacts table...');
    await client.query(`
      ALTER TABLE "EmergencyContacts" 
      ADD COLUMN IF NOT EXISTS "IsVerified" BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS "Priority" INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "Role" VARCHAR(50) DEFAULT 'General'
    `);
    
    // 2. Create EmergencyAlerts table
    console.log('Creating EmergencyAlerts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "EmergencyAlerts" (
        "Id" SERIAL PRIMARY KEY,
        "UserId" VARCHAR(50) NOT NULL,
        "Message" TEXT,
        "Location" TEXT,
        "Status" VARCHAR(20) NOT NULL DEFAULT 'Active',
        "CreatedAt" TIMESTAMP NOT NULL,
        "ResolvedAt" TIMESTAMP
      )
    `);
    
    // 3. Create EmergencyContactAlerts table to track which contacts were alerted
    console.log('Creating EmergencyContactAlerts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "EmergencyContactAlerts" (
        "Id" SERIAL PRIMARY KEY,
        "EmergencyId" INTEGER NOT NULL REFERENCES "EmergencyAlerts"("Id") ON DELETE CASCADE,
        "ContactId" INTEGER NOT NULL REFERENCES "EmergencyContacts"("Id") ON DELETE CASCADE,
        "EmailSent" BOOLEAN DEFAULT FALSE,
        "SmsSent" BOOLEAN DEFAULT FALSE,
        "CreatedAt" TIMESTAMP NOT NULL,
        "ResponseStatus" VARCHAR(20),
        "ResponseTime" TIMESTAMP
      )
    `);
    
    // 4. Create index for faster queries
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_emergency_alerts_userid ON "EmergencyAlerts"("UserId");
      CREATE INDEX IF NOT EXISTS idx_emergency_contact_alerts_emergencyid ON "EmergencyContactAlerts"("EmergencyId");
      CREATE INDEX IF NOT EXISTS idx_emergency_contacts_userid ON "EmergencyContacts"("UserId");
    `);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database schema update completed successfully!');
    
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error updating database schema:', error);
    throw error;
  } finally {
    // Release client
    client.release();
    
    // Close pool
    pool.end();
  }
}

// Run the update
updateSchema()
  .then(() => {
    console.log('Schema update script completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Schema update failed:', err);
    process.exit(1);
  });
