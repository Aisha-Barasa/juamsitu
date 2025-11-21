import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Download, MapPin } from "lucide-react";
import { ForestScoreCard } from "@/components/ForestScoreCard";
import { ForestTrendChart } from "@/components/ForestTrendChart";
import { ForestComparison } from "@/components/ForestComparison";
import { ForestRestoration } from "@/components/ForestRestoration";
import { ForestMap } from "@/components/ForestMap";
import { AIAnalysis } from "@/components/AIAnalysis";
import { SMSAlerts } from "@/components/SMSAlerts";
import { mockForests, calculateForestScore, getGrade } from "@/lib/forestData";
import { generateForestReport } from "@/lib/pdfGenerator";
import { toast } from "sonner";

const Index = () => {
  const [selectedForest, setSelectedForest] = useState(mockForests[0]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  
  const score = calculateForestScore(selectedForest.currentMetrics);
  const grade = getGrade(score);

  const handleDownloadReport = () => {
    try {
      generateForestReport({
        forest: selectedForest,
        score,
        grade,
        aiAnalysis: aiAnalysis || undefined
      });
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate report");
    }
  };

  // Mock restoration data for demonstration
  const beforeData = {
    date: "2024-05-01",
    score: score - 10,
    ndvi: selectedForest.currentMetrics.ndvi - 0.08,
    treeDensity: selectedForest.currentMetrics.treeDensity - 100,
    soilMoisture: selectedForest.currentMetrics.soilMoisture - 8,
    rainfall: selectedForest.currentMetrics.rainfall - 20
  };

  const afterData = {
    date: new Date().toISOString().split('T')[0],
    score,
    ndvi: selectedForest.currentMetrics.ndvi,
    treeDensity: selectedForest.currentMetrics.treeDensity,
    soilMoisture: selectedForest.currentMetrics.soilMoisture,
    rainfall: selectedForest.currentMetrics.rainfall
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">JuaMsitu</h1>
                <p className="text-sm text-muted-foreground">Know Your Forest. Protect Your Future.</p>
              </div>
            </div>
            <Button onClick={handleDownloadReport} className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Forest Selection */}
        <Card className="p-6 mb-8 shadow-medium">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select Forest to Monitor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockForests.map((forest) => (
              <button
                key={forest.id}
                onClick={() => setSelectedForest(forest)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedForest.id === forest.id
                    ? 'border-primary bg-primary/5 shadow-medium'
                    : 'border-border hover:border-primary/50 hover:bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{forest.name}</h3>
                  {selectedForest.id === forest.id && (
                    <Badge variant="default" className="ml-2">Selected</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{forest.location}</p>
                <p className="text-xs text-muted-foreground">{forest.area.toLocaleString()} hectares</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Tabbed Interface */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="restoration">Restoration</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ForestScoreCard forest={selectedForest} />
              </div>
              <div className="lg:col-span-2">
                <ForestTrendChart forest={selectedForest} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ForestMap 
                forests={mockForests} 
                selectedForest={selectedForest}
                onSelectForest={setSelectedForest}
              />
              <ForestComparison forests={mockForests} />
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <AIAnalysis forest={selectedForest} onAnalysisComplete={setAiAnalysis} />
          </TabsContent>

          <TabsContent value="restoration">
            <ForestRestoration
              forestName={selectedForest.name}
              beforeData={beforeData}
              afterData={afterData}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <SMSAlerts
              forestName={selectedForest.name}
              score={score}
              grade={grade}
            />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Data sourced from satellite imagery, weather stations, and ground sensors</p>
          <p className="mt-1">Powered by Antugrow API & Lovable AI</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
