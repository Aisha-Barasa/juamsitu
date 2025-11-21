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
    const { forestName, beforeData, afterData, restorationDetails } = await req.json();

    console.log('Comparing restoration impact for:', forestName);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Calculate improvements
    const improvements = {
      score: afterData.score - beforeData.score,
      ndvi: afterData.ndvi - beforeData.ndvi,
      treeDensity: afterData.treeDensity - beforeData.treeDensity,
      rainfall: afterData.rainfall - beforeData.rainfall,
      soilMoisture: afterData.soilMoisture - beforeData.soilMoisture,
    };

    const systemPrompt = `You are a forest restoration expert analyzing the impact of conservation and restoration efforts. 
    Provide clear insights on the effectiveness of restoration activities.`;

    const userPrompt = `Analyze the restoration impact on ${forestName}:

BEFORE RESTORATION (${beforeData.date}):
- Health Score: ${beforeData.score}/100
- NDVI: ${beforeData.ndvi}
- Tree Density: ${beforeData.treeDensity} trees/hectare
- Soil Moisture: ${beforeData.soilMoisture}%

AFTER RESTORATION (${afterData.date}):
- Health Score: ${afterData.score}/100
- NDVI: ${afterData.ndvi}
- Tree Density: ${afterData.treeDensity} trees/hectare
- Soil Moisture: ${afterData.soilMoisture}%

RESTORATION ACTIVITIES:
${restorationDetails || 'Reforestation, soil conservation, and water management initiatives'}

CHANGES:
- Health Score: ${improvements.score > 0 ? '+' : ''}${improvements.score.toFixed(1)} points
- NDVI: ${improvements.ndvi > 0 ? '+' : ''}${improvements.ndvi.toFixed(3)}
- Tree Density: ${improvements.treeDensity > 0 ? '+' : ''}${improvements.treeDensity} trees/hectare
- Soil Moisture: ${improvements.soilMoisture > 0 ? '+' : ''}${improvements.soilMoisture}%

Please provide:
1. Overall assessment of restoration effectiveness
2. Analysis of which metrics improved most/least
3. Ecological significance of the changes
4. Recommendations for continued restoration efforts
5. Timeline estimate for reaching optimal forest health

Use accessible language suitable for community stakeholders and conservation teams.`;

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
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const comparison = data.choices[0].message.content;

    console.log('Successfully generated restoration comparison');

    return new Response(
      JSON.stringify({ 
        comparison,
        improvements,
        forestName,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in compare-restoration function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
