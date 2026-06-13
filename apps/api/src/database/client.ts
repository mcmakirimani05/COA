import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'costadmin',
  password: process.env.DB_PASSWORD || 'costpassword',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cloud_cost_optimizer',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};

export default db;