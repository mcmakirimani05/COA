'use client';

import React from 'react';
import { BillingUpload } from '@/components/BillingUpload';
import { RecommendationsList } from '@/components/RecommendationsList';
import { SavingsDashboard } from '@/components/SavingsDashboard';
import { ExportButtons } from '@/components/ExportButtons';

export default function Home() {
  const [recommendations, setRecommendations] = React.useState([]);
  const [dashboardData, setDashboardData] = React.useState(null);
  const [analysisId, setAnalysisId] = React.useState<string | null>(null);

  const handleUploadSuccess = async (id: string) => {
    setAnalysisId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const [recsRes, dashRes] = await Promise.all([
        fetch(`${apiUrl}/api/recommendations/${id}`),
        fetch(`${apiUrl}/api/dashboard/${id}`),
      ]);
      
      if (recsRes.ok) setRecommendations(await recsRes.json());
      if (dashRes.ok) setDashboardData(await dashRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Cloud Cost Optimization Advisor</h1>
          <p className="text-gray-600 mt-2">Analyze your cloud billing and get actionable cost optimization recommendations</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Billing Data</h2>
              <BillingUpload onSuccess={handleUploadSuccess} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {dashboardData && (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Savings Dashboard</h2>
                  <SavingsDashboard data={dashboardData} />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
                  <RecommendationsList recommendations={recommendations} />
                  {analysisId && <ExportButtons analysisId={analysisId} />}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}