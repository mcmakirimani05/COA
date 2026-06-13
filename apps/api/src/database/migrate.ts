import { initDatabase } from './schema';

async function migrate() {
  try {
    await initDatabase();
    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

export { migrate };