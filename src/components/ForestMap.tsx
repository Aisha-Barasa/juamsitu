import { Card } from "@/components/ui/card";
import { MapPin, Leaf } from "lucide-react";
import { type Forest } from "@/lib/forestData";
import { calculateForestScore, getGrade } from "@/lib/forestData";

interface ForestMapProps {
  forests: Forest[];
  selectedForest: Forest;
  onSelectForest: (forest: Forest) => void;
}

export const ForestMap = ({ forests, selectedForest, onSelectForest }: ForestMapProps) => {
  // Mock coordinates for Kenyan forests (relative positions on map)
  const forestPositions: Record<string, { x: number; y: number }> = {
    '1': { x: 20, y: 45 }, // Kakamega - Western
    '2': { x: 40, y: 50 }, // Mau - Rift Valley
    '3': { x: 50, y: 40 }, // Aberdare - Central
    '4': { x: 75, y: 70 }, // Arabuko Sokoke - Coast
  };

  const getMarkerColor = (forest: Forest) => {
    const score = calculateForestScore(forest.currentMetrics);
    if (score >= 80) return 'text-success';
    if (score >= 70) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="p-6 shadow-medium">
      <h3 className="text-xl font-bold text-foreground mb-4">Kenya Forest Locations</h3>
      <div className="relative w-full h-[400px] bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg overflow-hidden border border-border">
        {/* Simplified Kenya map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5" />
        
        {/* Forest markers */}
        {forests.map((forest) => {
          const position = forestPositions[forest.id];
          if (!position) return null;

          const isSelected = selectedForest.id === forest.id;
          const markerColor = getMarkerColor(forest);
          const score = calculateForestScore(forest.currentMetrics);
          const grade = getGrade(score);

          return (
            <button
              key={forest.id}
              onClick={() => onSelectForest(forest)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group ${
                isSelected ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <div className="relative">
                <MapPin 
                  className={`h-8 w-8 ${markerColor} ${isSelected ? 'animate-bounce' : ''}`} 
                  fill="currentColor"
                />
                <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 h-3 w-3 text-background" />
              </div>
              
              {/* Tooltip */}
              <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-strong p-3 min-w-[180px] ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity duration-200 pointer-events-none`}>
                <p className="text-sm font-bold text-foreground whitespace-nowrap">{forest.name}</p>
                <p className="text-xs text-muted-foreground">{forest.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Score:</span>
                  <span className={`text-sm font-bold ${markerColor}`}>{score} ({grade})</span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-medium">
          <p className="text-xs font-semibold text-foreground mb-2">Health Status</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Excellent (80+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Good (70-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Fair (60-69)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">At Risk (&lt;60)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
