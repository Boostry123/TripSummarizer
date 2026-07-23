import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
// import { image_search } from "duckduckgo-images-api";
import dotenv from "dotenv";

dotenv.config();

interface UnsplashImage {
  id: string;
  urls: {
    regular: string; // The standard optimized size for UI display
    full: string;
  };
  user: {
    name: string;
    links: {
      html: string; // Required for attribution links
    };
  };
}

async function searchUnsplashImages(query: string): Promise<UnsplashImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || "";

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    // The search endpoint nests the image array inside a 'results' property
    return data.results;
  } catch (error) {
    console.error("Failed to fetch from Unsplash:", error);
    return [];
  }
}

const getImagesDef = toolDefinition({
  name: "search_images",
  description: "Fetches images of specific places or landmarks from the web.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The name of the location or place to search for"),
  }),
  outputSchema: z.array(
    z.object({
      id: z.string(),
      urls: z.object({
        regular: z
          .string()
          .describe("The standard optimized size for UI display"),
        full: z.string(),
      }),
      user: z.object({
        name: z.string(),
        links: z.object({
          html: z.string(), // Required for attribution links
        }),
      }),
    }),
  ),
});

export const getImagesTool = getImagesDef.server(async (params) => {
  const results = await searchUnsplashImages(params.query);
  const filteredResults = results.slice(0, 2);
  return filteredResults;
});
