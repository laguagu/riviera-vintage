import { tool } from "ai";
import { z } from "zod";

const searchSerperLocations = tool({
  description:
    "Search for antique stores in Finland using Google Places API via Serper. Returns information about the stores including their position, title, address, and website.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        'The search query for antique stores. Include "antiikkiliike" or related terms for best results.'
      ),
    city: z
      .string()
      .optional()
      .describe("Specific city in Finland to search in, if any."),
  }),
  execute: async ({ query, city }) => {
    const apiKey = process.env.NEXT_PUBLIC_SERPER_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_SERPER_API_KEY is not set");
    }

    const searchQuery = `antiikkiliike ${query} ${city || ""}`.trim();
    const response = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchQuery,
        num: 5,
        gl: "fi",
        location: city || "Finland",
        hl: "fi",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch antique stores: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return { message: "No antique stores found for the given query." };
    }

    return data.places.map((place: any) => ({
      position: place.position,
      title: place.title,
      address: place.address,
      website: place.website,
      phoneNumber: place.phoneNumber,
      rating: place.rating,
      reviewsCount: place.reviewsCount,
      category: place.category,
    }));
  },
});

export { searchSerperLocations };

