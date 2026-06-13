import PDFDocument from 'pdfkit';

export async function exportToPDF(recommendations: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(24).text('Cloud Cost Optimization Report', { align: 'center' });
    doc.fontSize(12).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Recommendations', { underline: true });
    doc.moveDown();

    recommendations.forEach((rec: any, index: number) => {
      doc.fontSize(11).text(`${index + 1}. ${rec.resource} (${rec.type.toUpperCase()})`, { bold: true });
      doc.fontSize(10).text(`Description: ${rec.description}`);
      doc.text(`Current Cost: $${rec.currentCost.toFixed(2)}`);
      doc.text(`Estimated Savings: $${rec.estimatedSavings.toFixed(2)}`);
      doc.text(`Action: ${rec.action}`);
      doc.moveDown();
    });

    doc.end();
  });
}

export async function exportToCSV(recommendations: any[]): Promise<string> {
  const headers = ['Resource', 'Type', 'Current Cost', 'Estimated Savings', 'Description', 'Action'];
  const rows = recommendations.map((rec: any) => [
    rec.resource,
    rec.type,
    rec.currentCost.toFixed(2),
    rec.estimatedSavings.toFixed(2),
    rec.description,
    rec.action,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}