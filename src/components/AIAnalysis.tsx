import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type Forest } from "@/lib/forestData";
import { calculateForestScore, getGrade } from "@/lib/forestData";

interface AIAnalysisProps {
  forest: Forest;
  onAnalysisComplete?: (analysis: string) => void;
}

export const AIAnalysis = ({ forest, onAnalysisComplete }: AIAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const score = calculateForestScore(forest.currentMetrics);
      const grade = getGrade(score);

      const { data, error } = await supabase.functions.invoke('analyze-forest-health', {
        body: {
          forestName: forest.name,
          score,
          grade,
          metrics: forest.currentMetrics,
          trends: forest.trends,
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      if (onAnalysisComplete) {
        onAnalysisComplete(data.analysis);
      }
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your forest health data.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-medium">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Health Analysis
        </h3>
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Analysis"}
        </Button>
      </div>
      
      {analysis ? (
        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
          {analysis}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Click "Generate Analysis" to get AI-powered insights about {forest.name}'s health.
        </p>
      )}
    </Card>
  );
};
