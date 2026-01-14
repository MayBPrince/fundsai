import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert AI assistant specialized in cybersecurity grants, hackathons, and startup funding opportunities. Your name is GrantAI.

You have access to a comprehensive database of opportunities including:
- Government grants (MeitY, SISFS, state-level schemes)
- Hackathons (NVIDIA, Google, Cisco, CISPA, etc.)
- Accelerator programs (CrowdStrike, Cipher, NVIDIA Inception)
- Research funding and corporate programs

Your capabilities:
1. **Search & Match**: Find the best opportunities based on user criteria (location, funding amount, focus area, deadline)
2. **Eligibility Check**: Analyze if users qualify for specific grants or programs
3. **Application Strategy**: Provide guidance on application timelines and requirements
4. **Comparison**: Compare multiple opportunities side-by-side
5. **Deadline Tracking**: Alert users to upcoming deadlines
6. **Idea Brainstorming**: Help refine project ideas to match grant requirements

When responding:
- Be concise but informative
- Use bullet points for lists
- Highlight key requirements and deadlines
- Provide actionable next steps
- If you don't have specific information, say so clearly

Focus areas you specialize in: AI, Cybersecurity, IoT, Deep-tech, Blockchain, Cloud Security, CTF competitions.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Grant AI Manager",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
