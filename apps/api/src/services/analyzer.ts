export interface BillingItem {
  service: string;
  cost: number;
  usage: number;
  instance_type?: string;
}

export interface Recommendation {
  id: string;
  type: 'idle' | 'underutilized' | 'rightsizing';
  resource: string;
  currentCost: number;
  estimatedSavings: number;
  description: string;
  action: string;
}

export async function analyzeData(billingData: any[]): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  let id = 0;

  for (const item of billingData) {
    const cost = parseFloat(item.cost || 0);
    const usage = parseFloat(item.usage?.toString().replace('%', '') || 0);
    const service = item.service || 'Unknown';
    const instanceType = item.instance_type || 'N/A';

    if (usage < 10) {
      recommendations.push({
        id: `rec-${id++}`,
        type: 'idle',
        resource: `${service} (${instanceType})`,
        currentCost: cost,
        estimatedSavings: cost * 0.9,
        description: 'This resource is idle or barely used. Consider terminating it.',
        action: 'Terminate or scale down',
      });
    } else if (usage >= 10 && usage < 50) {
      recommendations.push({
        id: `rec-${id++}`,
        type: 'underutilized',
        resource: `${service} (${instanceType})`,
        currentCost: cost,
        estimatedSavings: cost * 0.3,
        description: `This resource is underutilized at ${usage}% usage. Consider rightsizing.`,
        action: 'Rightsize to smaller instance',
      });
    } else if (cost > 100 && usage < 90) {
      recommendations.push({
        id: `rec-${id++}`,
        type: 'rightsizing',
        resource: `${service} (${instanceType})`,
        currentCost: cost,
        estimatedSavings: cost * 0.2,
        description: 'This is a high-cost resource with room for optimization.',
        action: 'Review and optimize instance type',
      });
    }
  }

  return recommendations;
}