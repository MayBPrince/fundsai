import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRANT_SOURCES = [
  { name: "Startup India", url: "https://www.startupindia.gov.in", searchPath: "/content/sih/en/government-schemes.html" },
  { name: "MSME", url: "https://msme.gov.in", searchPath: "/en/schemes" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources } = await req.json();
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ 
        error: "Firecrawl not configured",
        grants: [],
        message: "Web scraping is not available. Using cached data only."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Firecrawl to search for grants
    const searchQuery = query || "government grants for startups India 2025 2026 MSME technology";
    
    console.log("Searching for grants with query:", searchQuery);
    
    const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 10,
        lang: "en",
        country: "IN",
        scrapeOptions: {
          formats: ["markdown"],
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Firecrawl search error:", searchResponse.status, errorText);
      return new Response(JSON.stringify({ 
        grants: [],
        message: "Search temporarily unavailable. Try again later."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchData = await searchResponse.json();
    const results = searchData.data || [];

    console.log(`Found ${results.length} search results`);

    // Use AI to extract structured grant data from search results
    if (!LOVABLE_API_KEY || results.length === 0) {
      return new Response(JSON.stringify({ 
        grants: [],
        rawResults: results.map((r: any) => ({
          title: r.title,
          url: r.url,
          description: r.description,
        })),
        message: `Found ${results.length} potential sources`
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use AI to parse and structure the grant data
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You extract grant/funding opportunity data from web search results.
Return ONLY a valid JSON array with structured grant data:
[
  {
    "name": "Grant Name",
    "type": "grant|hackathon|accelerator|program",
    "organization": "Issuing Organization",
    "amount": "Funding amount or range",
    "deadline": "Application deadline if known",
    "focus": "Focus areas",
    "eligibility": "Who can apply",
    "url": "Source URL",
    "features": "Key features"
  }
]
Only include real funding opportunities. Ignore ads, news articles without grant info.`
          },
          { 
            role: "user", 
            content: `Extract grant opportunities from these search results:\n\n${JSON.stringify(results.slice(0, 8), null, 2)}`
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI parsing error:", aiResponse.status);
      return new Response(JSON.stringify({ 
        grants: [],
        rawResults: results.slice(0, 5).map((r: any) => ({
          title: r.title,
          url: r.url,
          description: r.description,
        })),
        message: "Found results but couldn't parse them"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "[]";
    
    let grants;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      grants = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      grants = [];
    }

    // Add unique IDs to scraped grants
    grants = grants.map((g: any, i: number) => ({
      ...g,
      id: `scraped-${Date.now()}-${i}`,
      isNew: true,
      scrapedAt: new Date().toISOString(),
    }));

    console.log(`Successfully extracted ${grants.length} grants`);

    return new Response(JSON.stringify({ 
      grants,
      message: `Discovered ${grants.length} new opportunities`
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        grants: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
