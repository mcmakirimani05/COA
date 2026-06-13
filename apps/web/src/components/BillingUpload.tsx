'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface BillingUploadProps {
  onSuccess: (analysisId: string) => void;
}

export function BillingUpload({ onSuccess }: BillingUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${apiUrl}/api/billing/upload`, formData);
      onSuccess(response.data.analysisId);
      setFile(null);
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full"
          disabled={loading}
        />
        {file && <p className="text-sm text-green-600 mt-2">✓ {file.name}</p>}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Analyze'}
      </button>
    </div>
  );
}