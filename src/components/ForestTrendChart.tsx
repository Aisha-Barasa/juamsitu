import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { type Forest } from "@/lib/forestData";

interface ForestTrendChartProps {
  forest: Forest;
}

export const ForestTrendChart = ({ forest }: ForestTrendChartProps) => {
  return (
    <Card className="p-6 shadow-medium">
      <h3 className="text-xl font-bold text-foreground mb-4">6-Month Health Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={forest.trends}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            name="Health Score"
            dot={{ fill: 'hsl(var(--primary))', r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="ndvi" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            name="NDVI (scaled)"
            dot={{ fill: 'hsl(var(--success))', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="rainfall" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2}
            name="Rainfall (mm)"
            dot={{ fill: 'hsl(var(--accent))', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
