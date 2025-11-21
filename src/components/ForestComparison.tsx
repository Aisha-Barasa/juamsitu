import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateForestScore, getGrade, getGradeColor, type Forest } from "@/lib/forestData";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface ForestComparisonProps {
  forests: Forest[];
}

export const ForestComparison = ({ forests }: ForestComparisonProps) => {
  const sortedForests = [...forests].sort((a, b) => {
    const scoreA = calculateForestScore(a.currentMetrics);
    const scoreB = calculateForestScore(b.currentMetrics);
    return scoreB - scoreA;
  });

  const getTrend = (forest: Forest) => {
    const trends = forest.trends;
    if (trends.length < 2) return 0;
    const lastScore = trends[trends.length - 1].score;
    const prevScore = trends[trends.length - 2].score;
    return lastScore - prevScore;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-success" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="p-6 shadow-medium">
      <h3 className="text-xl font-bold text-foreground mb-4">Forest Health Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Forest</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Score</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Grade</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">NDVI</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sortedForests.map((forest, index) => {
              const score = calculateForestScore(forest.currentMetrics);
              const grade = getGrade(score);
              const gradeColor = getGradeColor(grade);
              const trend = getTrend(forest);

              return (
                <tr key={forest.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-foreground">{forest.name}</p>
                      <p className="text-xs text-muted-foreground">{forest.location}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-xl font-bold ${gradeColor}`}>{score}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant={score >= 70 ? "default" : "destructive"}>
                      {grade}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-medium text-foreground">
                      {forest.currentMetrics.ndvi.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(trend)}
                      <span className="text-sm font-medium">
                        {trend > 0 ? '+' : ''}{trend.toFixed(0)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
