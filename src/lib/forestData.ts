// Mock forest data and types for JuaMsitu

export interface ForestMetrics {
  ndvi: number; // Normalized Difference Vegetation Index (0-1)
  treeDensity: number; // Trees per hectare
  rainfall: number; // mm per month
  soilMoisture: number; // Percentage
  temperature: number; // Celsius
}

export interface ForestTrend {
  month: string;
  score: number;
  ndvi: number;
  rainfall: number;
}

export interface Forest {
  id: string;
  name: string;
  location: string;
  area: number; // in hectares
  currentMetrics: ForestMetrics;
  trends: ForestTrend[];
  lastUpdated: string;
}

// Calculate Forest Health Score (0-100)
export const calculateForestScore = (metrics: ForestMetrics): number => {
  // Weighted formula:
  // NDVI: 35% (optimal: 0.6-0.9)
  // Tree Density: 25% (optimal: 400-800 trees/hectare)
  // Rainfall: 20% (optimal: 100-200mm/month)
  // Soil Moisture: 15% (optimal: 40-60%)
  // Temperature: 5% (optimal: 15-25°C)

  const ndviScore = Math.min((metrics.ndvi / 0.9) * 100, 100) * 0.35;
  const densityScore = Math.min((metrics.treeDensity / 800) * 100, 100) * 0.25;
  const rainfallScore = Math.min((metrics.rainfall / 200) * 100, 100) * 0.20;
  const moistureScore = Math.min((metrics.soilMoisture / 60) * 100, 100) * 0.15;
  const tempScore = (1 - Math.abs(20 - metrics.temperature) / 20) * 100 * 0.05;

  return Math.round(ndviScore + densityScore + rainfallScore + moistureScore + tempScore);
};

// Assign grade based on score
export const getGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
};

// Get color based on grade
export const getGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    'A': 'text-success',
    'B': 'text-primary',
    'C': 'text-warning',
    'D': 'text-warning',
    'E': 'text-destructive',
    'F': 'text-destructive',
  };
  return colors[grade] || 'text-muted-foreground';
};

// Mock forest data
export const mockForests: Forest[] = [
  {
    id: '1',
    name: 'Kakamega Forest',
    location: 'Western Kenya',
    area: 24000,
    currentMetrics: {
      ndvi: 0.78,
      treeDensity: 650,
      rainfall: 180,
      soilMoisture: 52,
      temperature: 21,
    },
    trends: [
      { month: 'Jun', score: 82, ndvi: 0.75, rainfall: 160 },
      { month: 'Jul', score: 84, ndvi: 0.76, rainfall: 165 },
      { month: 'Aug', score: 83, ndvi: 0.76, rainfall: 170 },
      { month: 'Sep', score: 85, ndvi: 0.77, rainfall: 175 },
      { month: 'Oct', score: 86, ndvi: 0.78, rainfall: 180 },
      { month: 'Nov', score: 87, ndvi: 0.78, rainfall: 180 },
    ],
    lastUpdated: '2025-11-21',
  },
  {
    id: '2',
    name: 'Mau Forest Complex',
    location: 'Rift Valley',
    area: 400000,
    currentMetrics: {
      ndvi: 0.65,
      treeDensity: 520,
      rainfall: 140,
      soilMoisture: 45,
      temperature: 19,
    },
    trends: [
      { month: 'Jun', score: 68, ndvi: 0.60, rainfall: 120 },
      { month: 'Jul', score: 70, ndvi: 0.61, rainfall: 125 },
      { month: 'Aug', score: 69, ndvi: 0.62, rainfall: 130 },
      { month: 'Sep', score: 72, ndvi: 0.63, rainfall: 135 },
      { month: 'Oct', score: 74, ndvi: 0.64, rainfall: 140 },
      { month: 'Nov', score: 75, ndvi: 0.65, rainfall: 140 },
    ],
    lastUpdated: '2025-11-21',
  },
  {
    id: '3',
    name: 'Aberdare Forest',
    location: 'Central Kenya',
    area: 76700,
    currentMetrics: {
      ndvi: 0.82,
      treeDensity: 720,
      rainfall: 195,
      soilMoisture: 58,
      temperature: 18,
    },
    trends: [
      { month: 'Jun', score: 88, ndvi: 0.79, rainfall: 180 },
      { month: 'Jul', score: 89, ndvi: 0.80, rainfall: 185 },
      { month: 'Aug', score: 90, ndvi: 0.80, rainfall: 188 },
      { month: 'Sep', score: 91, ndvi: 0.81, rainfall: 190 },
      { month: 'Oct', score: 92, ndvi: 0.82, rainfall: 192 },
      { month: 'Nov', score: 93, ndvi: 0.82, rainfall: 195 },
    ],
    lastUpdated: '2025-11-21',
  },
  {
    id: '4',
    name: 'Arabuko Sokoke',
    location: 'Coast Region',
    area: 42000,
    currentMetrics: {
      ndvi: 0.58,
      treeDensity: 380,
      rainfall: 95,
      soilMoisture: 35,
      temperature: 26,
    },
    trends: [
      { month: 'Jun', score: 54, ndvi: 0.52, rainfall: 80 },
      { month: 'Jul', score: 55, ndvi: 0.53, rainfall: 82 },
      { month: 'Aug', score: 56, ndvi: 0.54, rainfall: 85 },
      { month: 'Sep', score: 57, ndvi: 0.56, rainfall: 88 },
      { month: 'Oct', score: 58, ndvi: 0.57, rainfall: 92 },
      { month: 'Nov', score: 59, ndvi: 0.58, rainfall: 95 },
    ],
    lastUpdated: '2025-11-21',
  },
];
