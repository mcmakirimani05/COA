import db from './client';

const initSchema = `
  CREATE TABLE IF NOT EXISTS billing_uploads (
    id UUID PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    data JSONB,
    records_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY,
    upload_id UUID NOT NULL REFERENCES billing_uploads(id) ON DELETE CASCADE,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_recommendations_upload_id ON recommendations(upload_id);
  CREATE INDEX IF NOT EXISTS idx_billing_uploads_created_at ON billing_uploads(created_at);
`;

export async function initDatabase() {
  try {
    await db.query(initSchema);
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}