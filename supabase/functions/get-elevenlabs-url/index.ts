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
    const { agentType } = await req.json();
    
    const ELEVENLABS_API_KEY = Deno.env.get("VITE_ELEVENLABS_API_KEY");
    const AGENT_ID = agentType === "climate" 
      ? Deno.env.get("VITE_ELEVENLABS_CLIMATE_AGENT_ID")
      : Deno.env.get("VITE_ELEVENLABS_AGENT_ID");
    
    if (!ELEVENLABS_API_KEY || !AGENT_ID) {
      console.error("Missing ElevenLabs credentials");
      return new Response(
        JSON.stringify({ error: "ElevenLabs credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get signed URL from ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Failed to get signed URL: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("✅ Signed URL generated successfully");

    return new Response(
      JSON.stringify({ signedUrl: data.signed_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-elevenlabs-url function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
