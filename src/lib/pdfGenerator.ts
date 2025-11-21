import jsPDF from 'jspdf';
import { Forest, ForestTrend, getGrade } from './forestData';

interface PDFData {
  forest: Forest;
  score: number;
  grade: string;
  aiAnalysis?: string;
}

export const generateForestReport = (data: PDFData) => {
  const pdf = new jsPDF();
  const { forest, score, grade, aiAnalysis } = data;
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  pdf.setFillColor(34, 139, 34);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text('JuaMsitu', 14, 15);
  
  pdf.setFontSize(12);
  pdf.text('Know Your Forest. Protect Your Future.', 14, 23);
  
  yPosition = 45;
  
  // Forest Name
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.text(forest.name, 14, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Location: ${forest.location} | Area: ${forest.area.toLocaleString()} hectares`, 14, yPosition);
  
  yPosition += 15;
  
  // Health Score Card
  pdf.setDrawColor(34, 139, 34);
  pdf.setLineWidth(0.5);
  pdf.rect(14, yPosition, pageWidth - 28, 30, 'S');
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Forest Health Score', 20, yPosition + 10);
  
  pdf.setFontSize(24);
  const scoreColor = score >= 70 ? [34, 139, 34] : score >= 50 ? [255, 165, 0] : [220, 38, 38];
  pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.text(`${score}`, pageWidth - 50, yPosition + 18);
  
  pdf.setFontSize(16);
  pdf.text(`Grade: ${grade}`, pageWidth - 80, yPosition + 25);
  
  yPosition += 45;
  
  // Current Metrics
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Current Metrics', 14, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  
  const metrics = [
    `NDVI: ${forest.currentMetrics.ndvi.toFixed(2)} (Optimal: 0.6-0.9)`,
    `Tree Density: ${forest.currentMetrics.treeDensity} trees/hectare (Optimal: 400-800)`,
    `Rainfall: ${forest.currentMetrics.rainfall}mm/month (Optimal: 100-200mm)`,
    `Soil Moisture: ${forest.currentMetrics.soilMoisture}% (Optimal: 40-60%)`,
    `Temperature: ${forest.currentMetrics.temperature}°C (Optimal: 15-25°C)`,
  ];
  
  metrics.forEach(metric => {
    yPosition += 7;
    pdf.text(metric, 20, yPosition);
  });
  
  yPosition += 15;
  
  // 6-Month Trend
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('6-Month Health Trend', 14, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(9);
  pdf.setTextColor(60, 60, 60);
  
  const trendData = forest.trends.map(t => 
    `${t.month}: Score ${t.score} | NDVI ${t.ndvi.toFixed(2)} | Rainfall ${t.rainfall}mm`
  );
  
  trendData.forEach(trend => {
    yPosition += 6;
    pdf.text(trend, 20, yPosition);
  });
  
  // AI Analysis
  if (aiAnalysis) {
    yPosition += 15;
    
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('AI Health Analysis', 14, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    
    const lines = pdf.splitTextToSize(aiAnalysis, pageWidth - 28);
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 14, yPosition);
      yPosition += 5;
    });
  }
  
  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Generated: ${new Date().toLocaleDateString()} | Last Updated: ${forest.lastUpdated}`,
      14,
      pdf.internal.pageSize.getHeight() - 10
    );
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 30,
      pdf.internal.pageSize.getHeight() - 10
    );
  }
  
  // Save the PDF
  pdf.save(`${forest.name.replace(/\s+/g, '_')}_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
