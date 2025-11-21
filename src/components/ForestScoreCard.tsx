import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { calculateForestScore, getGrade, getGradeColor, type Forest } from "@/lib/forestData";

interface ForestScoreCardProps {
  forest: Forest;
}

export const ForestScoreCard = ({ forest }: ForestScoreCardProps) => {
  const score = calculateForestScore(forest.currentMetrics);
  const grade = getGrade(score);
  const gradeColor = getGradeColor(grade);

  const getScoreStatus = () => {
    if (score >= 80) return { icon: TrendingUp, text: "Excellent Health", color: "text-success" };
    if (score >= 70) return { icon: TrendingUp, text: "Good Health", color: "text-primary" };
    if (score >= 60) return { icon: AlertTriangle, text: "Fair Health", color: "text-warning" };
    return { icon: TrendingDown, text: "At Risk", color: "text-destructive" };
  };

  const status = getScoreStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="p-8 bg-gradient-to-br from-card to-muted/20 border-2 shadow-strong">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">{forest.name}</h2>
          </div>
          <p className="text-muted-foreground">{forest.location} • {forest.area.toLocaleString()} ha</p>
        </div>
        <Badge variant={score >= 70 ? "default" : "destructive"} className="text-lg px-4 py-2">
          Grade {grade}
        </Badge>
      </div>

      <div className="relative mb-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted/30"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${score * 5.53} 999`}
                className={gradeColor}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${gradeColor}`}>{score}</span>
              <span className="text-sm text-muted-foreground mt-1">Health Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <StatusIcon className={`h-5 w-5 ${status.color}`} />
        <span className={`text-lg font-semibold ${status.color}`}>{status.text}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="NDVI" value={forest.currentMetrics.ndvi.toFixed(2)} optimal="0.6-0.9" />
        <MetricCard label="Tree Density" value={`${forest.currentMetrics.treeDensity}/ha`} optimal="400-800" />
        <MetricCard label="Rainfall" value={`${forest.currentMetrics.rainfall}mm`} optimal="100-200" />
        <MetricCard label="Soil Moisture" value={`${forest.currentMetrics.soilMoisture}%`} optimal="40-60%" />
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        Last updated: {new Date(forest.lastUpdated).toLocaleDateString()}
      </div>
    </Card>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  optimal: string;
}

const MetricCard = ({ label, value, optimal }: MetricCardProps) => (
  <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">Optimal: {optimal}</p>
  </div>
);
