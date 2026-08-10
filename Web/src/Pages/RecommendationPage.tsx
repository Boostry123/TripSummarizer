import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { HiSparkles, HiTrash } from "react-icons/hi";
//API
import { getRecommendation } from "@/Apis/chatService";
//Store
import { useRecommendationStore } from "@/store/recommendationStore";
//Component
import Card from "@/Components/Common/Card";
import ImageContainer from "@/Components/Images/ImageContainer";
//Helper
import agentResponseToJson from "@/Helper/agentResponseToJson";

const RecommendationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMessage = location.state?.initialMessage;

  const {
    recommendation,
    setRecommendation,
    history,
    addToHistory,
    clearHistory,
    lastInitialMessage,
    setLastInitialMessage,
  } = useRecommendationStore();

  const [adjustment, setAdjustment] = useState("");

  const mutation = useMutation({
    mutationFn: (msg?: string) =>
      getRecommendation(
        msg,
        history.length > 0 ? [history[0], history[history.length - 1]] : [],
      ),
    onSuccess: (data, variables) => {
      setRecommendation(data);
      if (variables) {
        addToHistory({ role: "user", content: variables });
      } else if (history.length === 0) {
        addToHistory({
          role: "user",
          content: "Generate a recommendation for my next trip.",
        });
      }
      addToHistory({ role: "assistant", content: data });
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(adjustment);
    setAdjustment("");
  };

  // Initial load logic
  useEffect(() => {
    // If we have an initial message from location state
    if (initialMessage) {
      // Only trigger if it's different from the last one we processed
      if (initialMessage !== lastInitialMessage) {
        setLastInitialMessage(initialMessage);
        mutation.mutate(initialMessage);
      }
    } else {
      // No initial message (navigated directly)
      // Simply redirect if there is no history in the store
      if (history.length === 0) {
        navigate("/travel-log", { replace: true });
      }
    }
  }, [initialMessage, lastInitialMessage, history.length, navigate]);

  const recommendationToJson = useMemo(
    () => agentResponseToJson(recommendation),
    [recommendation],
  );

  return (
    <div className=" bg-primary-0 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        {recommendation && (
          <button
            onClick={clearHistory}
            className="flex bg-red-400 items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium"
            title="Clear conversation history and start fresh"
          >
            <HiTrash />
            Clear History
          </button>
        )}
      </div>

      <div className="mb-8">
        {mutation.isPending ? (
          <div className="py-12 text-center space-y-4">
            <div className="font-bold text-lg">Loading...</div>
            <p>Curating your next adventure...</p>
          </div>
        ) : recommendation ? (
          <div className="flex flex-col space-y-4 justify-center items-center">
            {recommendationToJson.imageUrl ? (
              <div className="flex justify-center">
                <ImageContainer
                  URL={recommendationToJson.imageUrl}
                  user={recommendationToJson.imageUser}
                />
              </div>
            ) : (
              "No image"
            )}
            <div className="prose max-w-prose">
              <Card>
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {`**Country:** ${recommendationToJson.remainingData.Country}`}
                </ReactMarkdown>
                <br />
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {`**Cities:** ${recommendationToJson.remainingData.Cities}`}
                </ReactMarkdown>
                <br />
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {`**Activities:** ${recommendationToJson.remainingData.Activities}`}
                </ReactMarkdown>
                <br />
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {`**TimeLine:**\n ${recommendationToJson.remainingData.Timeline}`}
                </ReactMarkdown>
                <br />
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {`**Summary:** ${recommendationToJson.remainingData.Summary}`}
                </ReactMarkdown>
              </Card>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center italic">
            Click the button below to generate a tailored recommendation.
          </div>
        )}
      </div>

      <form
        onSubmit={handleGenerate}
        className="space-y-4 p-6 border rounded-xl bg-primary-1"
      >
        <div>
          <label htmlFor="adjustment" className="block text-sm font-bold mb-2">
            Refine your preferences
          </label>
          <textarea
            id="adjustment"
            className="w-full p-3 border rounded-lg resize-none bg-primary-0"
            rows={3}
            placeholder='e.g., "I want somewhere tropical", "More focus on history", "Budget-friendly options"'
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary-2 py-3 border rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {mutation.isPending ? (
            "Thinking..."
          ) : (
            <>
              <HiSparkles />
              {recommendation
                ? "Update Recommendation"
                : "Generate Recommendation"}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RecommendationPage;
