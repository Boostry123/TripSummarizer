import { chat } from "@tanstack/ai";
import { ollamaText } from "@tanstack/ai-ollama";
import { geminiText } from "@tanstack/ai-gemini";
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
  history: { role: "user" | "assistant"; content: string }[] = [],
) => {
  // 1. Fetch user trips
  const trips = await getTrips(token, userId);

  // 2. Format trips into context
  const tripContext = formatTripsForAI(trips);

  // 3. Prepare Instructions
  const personaAndHistory = `
    You are an expert travel recommendation engine. Your goal is to suggest a personalized next trip based on the user's past experiences.

    User's Travel History:
    ${tripContext}
  `.trim();

  const guidelines = `
    Instructions:
    - Analyze the user's likes and hates from past trips.
    - Consider their ratings (1-5).
    - Suggest a specific country and cities.
    - Provide a suggested itinerary or key activities.
    - Keep the tone inspiring and helpful.
    - Key aspects to make sure to cover: Climate preference, Political tensions, cultural interests, budget hints, and any travel patterns you can infer from their history.
    - Keep the response concise and focused on the recommendation. Avoid unnecessary explanations or justifications.
    - Use Markdown formatting for better readability, especially for the itinerary section.

    Response Format:
    Country: [Recommended Country]
    Cities: [Recommended Cities]
    Activities: [Suggested Activities or Itinerary]
    Timeline: [Well curated daily itinerary with activities, dining, and sightseeing suggestions, with exact time planning]
    Summary: [Bullet point of Country, Cities, Activities]

    TimeLine should be in the format:
    Day #:
      - Morning: [Activity]
      - Afternoon: [Activity]
      - Evening: [Activity]
      - Night: [Activity]

    DO NOT:
    - Say anything that is not relevant to the current recommendation for example, I didn't choose Ukraine because...
    - Slip away of your role and don't answer anything unrelated to travel recommendations.
    - Make up information about the user that is not in the trip history.
  `.trim();

  // 4. Construct Messages Array
  const messages: { role: "user" | "assistant"; content: string }[] = [];

  // Deep copy history to avoid mutation if needed (though history is fresh from req.body)
  const conversationHistory = history.map((h) => ({ ...h }));

  if (conversationHistory.length > 0) {
    // Prepend persona and history to the first user message
    const firstUserIndex = conversationHistory.findIndex(
      (m) => m.role === "user",
    );
    if (firstUserIndex !== -1) {
      conversationHistory[firstUserIndex].content =
        `${personaAndHistory}\n\n${guidelines}\n\nUser Request: ${conversationHistory[firstUserIndex].content}`;
    }
    messages.push(...conversationHistory);
  }

  // Add the current user request
  const currentRequest =
    userAdjustments || "Generate a recommendation for my next trip.";

  if (messages.length === 0) {
    // First message ever: persona + history + guidelines + request
    messages.push({
      role: "user",
      content: `
SYSTEM INSTRUCTIONS:
${personaAndHistory}

${guidelines}

USER COMMAND:
${currentRequest}
      `.trim(),
    });
  } else {
    // Follow-up: Re-attach guidelines to ensure the model stays in format
    messages.push({
      role: "user",
      content: `
USER COMMAND:
${currentRequest}

IMPORTANT: You MUST follow the strict formatting and rules below for your response:
${guidelines}
      `.trim(),
    });
  }

  // 5. Call AI Provider
  const selectedAdapterLocalModel = "qwen3:4b";
  const selectedAdapterAPI = "gemini-3.1-flash-lite";

  const userChosenModel = process.env.AI_PROVIDER || "qwen3:4b"; // Default to local model if not specified
  console.log(
    `Using AI Provider: ${userChosenModel} for recommendation generation...`,
  );

  const response = await chat({
    adapter:
      userChosenModel === "gemini"
        ? geminiText(selectedAdapterAPI)
        : ollamaText(selectedAdapterLocalModel),
    messages: messages,
    stream: false,
  });

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
