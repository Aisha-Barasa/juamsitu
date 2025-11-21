import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { forestName, score, grade, metrics, trends } = await req.json();

    console.log('Analyzing forest health for:', forestName);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create comprehensive prompt for AI analysis
    const systemPrompt = `You are an expert forest ecologist and environmental scientist specializing in forest health assessment. 
    Analyze the provided forest data and provide clear, actionable insights in plain English.`;

    const userPrompt = `Analyze the health of ${forestName}:

Forest Health Score: ${score}/100 (Grade: ${grade})

Current Metrics:
- NDVI (Normalized Difference Vegetation Index): ${metrics.ndvi} (Optimal: 0.6-0.9)
- Tree Density: ${metrics.treeDensity} trees/hectare (Optimal: 400-800)
- Rainfall: ${metrics.rainfall}mm/month (Optimal: 100-200mm)
- Soil Moisture: ${metrics.soilMoisture}% (Optimal: 40-60%)
- Temperature: ${metrics.temperature}°C (Optimal: 15-25°C)

6-Month Trend:
${trends.map((t: any) => `${t.month}: Score ${t.score}, NDVI ${t.ndvi}`).join('\n')}

Please provide:
1. A clear explanation of what the current health score means
2. Key strengths and concerns for this forest
3. Analysis of the 6-month trend
4. Prediction for the next 3 months based on current trends
5. 3-5 specific, actionable recommendations for forest management

Keep the language accessible to non-experts while being scientifically accurate.`;

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
        {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Successfully generated forest health analysis');

    return new Response(
      JSON.stringify({ 
        analysis,
        forestName,
        score,
        grade,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-forest-health function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
