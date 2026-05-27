import { chat } from "@tanstack/ai";
import { ollamaText } from "@tanstack/ai-ollama";
import { getTrips } from "./tripService.js";
import { Trip } from "@/Types/database.js";

/**
 * ChatBot Service
 * Handles AI-driven travel recommendations based on user history.
 */

export const generateRecommendation = async (
  token: string,
  userId: string,
  userAdjustments?: string,
) => {
  // 1. Fetch user trips
  const trips = await getTrips(token, userId);

  // 2. Format trips into context
  const tripContext = formatTripsForAI(trips);

  // 3. Prepare Prompt
  const prompt = `
    You are an expert travel recommendation engine. Your goal is to suggest a personalized next trip based on the user's past experiences.

    User's Travel History:
    ${tripContext}

    Current User Request/Adjustments:
    ${userAdjustments || "Generate a recommendation for my next trip based on my preferences."}

    Instructions:
    - Analyze the user's likes and hates from past trips.
    - Consider their ratings (1-5).
    - Suggest a specific country and cities.
    - Explain WHY you are recommending this based on their history.
    - Provide a suggested itinerary or key activities.
    - Keep the tone inspiring and helpful.
  `;

  // 4. Call AI Provider
  const selectedAdapter = "qwen3:4b"; // Using the model user started with

  const response = await chat({
    adapter: ollamaText(selectedAdapter),
    messages: [{ role: "user", content: prompt }],
    stream: false,
  });

  // When stream is false, response contains the full message
  return response;
};

const formatTripsForAI = (trips: Trip[]) => {
  if (trips.length === 0) {
    return "The user has no recorded trips yet. Recommend a popular first-time destination based on general travel trends.";
  }

  return trips
    .map((trip) => {
      return `
- Destination: ${trip.city.join(", ")}, ${trip.country}
  Date: ${trip.travel_date}
  Rating: ${trip.rating}/5
  Likes: ${trip.likes.join(", ")}
  Dislikes: ${trip.hates.join(", ")}
  Notes: ${trip.free_text || "N/A"}
`;
    })
    .join("\n");
};
