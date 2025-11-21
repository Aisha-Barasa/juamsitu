import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface BeforeAfterData {
  date: string;
  score: number;
  ndvi: number;
  treeDensity: number;
  soilMoisture: number;
  rainfall: number;
}

interface ForestRestorationProps {
  forestName: string;
  beforeData: BeforeAfterData;
  afterData: BeforeAfterData;
}

export const ForestRestoration = ({ forestName, beforeData, afterData }: ForestRestorationProps) => {
  const [comparison, setComparison] = useState<string>("");
  const [improvements, setImprovements] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('compare-restoration', {
        body: {
          forestName,
          beforeData,
          afterData,
          restorationDetails: "Reforestation, soil conservation, and water management initiatives"
        }
      });

      if (error) throw error;

      setComparison(data.comparison);
      setImprovements(data.improvements);
      toast.success("Restoration analysis complete");
    } catch (error) {
      console.error('Error comparing restoration:', error);
      toast.error("Failed to generate comparison");
    } finally {
      setLoading(false);
    }
  };

  const formatChange = (value: number) => {
    const formatted = value.toFixed(1);
    return value > 0 ? `+${formatted}` : formatted;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Restoration Impact Analysis
        </CardTitle>
        <CardDescription>
          Compare forest health before and after restoration efforts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Before Restoration</h3>
            <div className="space-y-1 text-sm">
              <p>Date: {beforeData.date}</p>
              <p>Score: {beforeData.score}/100</p>
              <p>NDVI: {beforeData.ndvi.toFixed(2)}</p>
              <p>Tree Density: {beforeData.treeDensity}/ha</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">After Restoration</h3>
            <div className="space-y-1 text-sm">
              <p>Date: {afterData.date}</p>
              <p>Score: {afterData.score}/100</p>
              <p>NDVI: {afterData.ndvi.toFixed(2)}</p>
              <p>Tree Density: {afterData.treeDensity}/ha</p>
            </div>
          </div>
        </div>

        {improvements && (
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-semibold text-sm">Changes</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                {improvements.score > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span>Score: {formatChange(improvements.score)}</span>
              </div>
              <div className="flex items-center gap-2">
                {improvements.ndvi > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span>NDVI: {formatChange(improvements.ndvi)}</span>
              </div>
            </div>
          </div>
        )}

        {!comparison && (
          <Button onClick={handleCompare} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Generate AI Comparison"
            )}
          </Button>
        )}

        {comparison && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {comparison}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
