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
    const { forestId, latitude, longitude, startDate, endDate } = await req.json();

    console.log('Fetching forest data for:', { forestId, latitude, longitude });

    // Antugrow API key from secrets
    const ANTUGROW_API_KEY = Deno.env.get('ANTUGROW_API_KEY');
    
    if (!ANTUGROW_API_KEY) {
      throw new Error('ANTUGROW_API_KEY not configured');
    }

    // Fetch NDVI data from Antugrow API
    const ndviResponse = await fetch('https://api.antugrow.com/v1/ndvi', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANTUGROW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    if (!ndviResponse.ok) {
      console.error('Antugrow NDVI API error:', ndviResponse.status);
      throw new Error(`Antugrow API error: ${ndviResponse.status}`);
    }

    const ndviData = await ndviResponse.json();

    // Fetch weather data
    const weatherResponse = await fetch('https://api.antugrow.com/v1/weather', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANTUGROW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        metrics: ['rainfall', 'temperature'],
      }),
    });

    if (!weatherResponse.ok) {
      console.error('Antugrow Weather API error:', weatherResponse.status);
      throw new Error(`Antugrow Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Fetch soil data
    const soilResponse = await fetch('https://api.antugrow.com/v1/soil', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANTUGROW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        metrics: ['moisture', 'organic_matter'],
      }),
    });

    if (!soilResponse.ok) {
      console.error('Antugrow Soil API error:', soilResponse.status);
      throw new Error(`Antugrow Soil API error: ${soilResponse.status}`);
    }

    const soilData = await soilResponse.json();

    // Combine all data
    const forestData = {
      forestId,
      timestamp: new Date().toISOString(),
      ndvi: ndviData,
      weather: weatherData,
      soil: soilData,
    };

    console.log('Successfully fetched forest data');

    return new Response(JSON.stringify(forestData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-forest-data function:', error);
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
