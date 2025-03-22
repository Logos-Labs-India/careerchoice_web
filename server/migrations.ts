import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Applies database migrations to add new columns for Google authentication
 */
export async function applyMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Check if Google auth columns already exist to avoid errors
    const googleAuthResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'google_id'
    `);
    
    if (googleAuthResult.rows.length === 0) {
      // Add new columns for Google authentication
      await db.execute(sql`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
        ALTER COLUMN username DROP NOT NULL,
        ALTER COLUMN password DROP NOT NULL,
        ADD COLUMN IF NOT EXISTS phone_number TEXT,
        ADD COLUMN IF NOT EXISTS grade TEXT,
        ADD COLUMN IF NOT EXISTS school TEXT,
        ADD COLUMN IF NOT EXISTS profile_picture TEXT,
        ADD COLUMN IF NOT EXISTS last_login TIMESTAMP
      `);
      
      console.log('Successfully added Google authentication columns to users table');
    } else {
      console.log('Google authentication columns already exist in users table');
    }
    
    // Check if assessment_complete column exists
    const assessmentCompleteResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'assessment_complete'
    `);
    
    if (assessmentCompleteResult.rows.length === 0) {
      // Add assessment_complete column
      await db.execute(sql`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS assessment_complete BOOLEAN DEFAULT false
      `);
      
      console.log('Successfully added assessment_complete column to users table');
    } else {
      console.log('Assessment_complete column already exists in users table');
    }
    
    return true;
  } catch (error) {
    console.error('Error applying migrations:', error);
    return false;
  }
}