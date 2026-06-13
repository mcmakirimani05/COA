'use client';

interface Recommendation {
  id: string;
  type: 'idle' | 'underutilized' | 'rightsizing';
  resource: string;
  currentCost: number;
  estimatedSavings: number;
  description: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return <p className="text-gray-500">No recommendations available</p>;
  }

  const typeStyles = {
    idle: 'bg-red-100 text-red-800',
    underutilized: 'bg-yellow-100 text-yellow-800',
    rightsizing: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className={`px-2 py-1 rounded text-sm font-semibold ${typeStyles[rec.type]}`}>
                {rec.type.toUpperCase()}
              </span>
              <h3 className="font-semibold text-gray-900 mt-2">{rec.resource}</h3>
              <p className="text-gray-600 text-sm mt-1">{rec.description}</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-sm text-gray-500">Current: ${rec.currentCost.toFixed(2)}</p>
              <p className="text-lg font-bold text-green-600">Save ${rec.estimatedSavings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}