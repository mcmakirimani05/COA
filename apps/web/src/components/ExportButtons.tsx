'use client';

import { useState } from 'react';
import axios from 'axios';

interface ExportButtonsProps {
  analysisId: string;
}

export function ExportButtons({ analysisId }: ExportButtonsProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv') => {
    setExporting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(
        `${apiUrl}/api/export/${format}`,
        { analysisId },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={() => handleExport('pdf')}
        disabled={exporting}
        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
      >
        Export PDF
      </button>
      <button
        onClick={() => handleExport('csv')}
        disabled={exporting}
        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        Export CSV
      </button>
    </div>
  );
}