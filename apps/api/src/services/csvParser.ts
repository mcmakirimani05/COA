import { parse } from 'csv-parse/sync';

export async function parseCSV(csvContent: string): Promise<any[]> {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error('Failed to parse CSV file');
  }
}