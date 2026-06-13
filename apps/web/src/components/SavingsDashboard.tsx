'use client';

import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DashboardData {
  currentSpend: number;
  potentialSavings: number;
  savingsPercentage: number;
  topOffenders: Array<{
    service: string;
    cost: number;
  }>;
}

interface SavingsDashboardProps {
  data: DashboardData;
}

export function SavingsDashboard({ data }: SavingsDashboardProps) {
  const COLORS = ['#0066cc', '#ff9999', '#ffcc99', '#99cc99', '#cc99ff'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Current Monthly Spend</p>
          <p className="text-3xl font-bold text-blue-600">${data.currentSpend.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Potential Savings</p>
          <p className="text-3xl font-bold text-green-600">${data.potentialSavings.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Savings %</p>
          <p className="text-3xl font-bold text-purple-600">{data.savingsPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Top Cost Offenders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topOffenders}>
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#0066cc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.topOffenders}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="cost"
              >
                {data.topOffenders.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}