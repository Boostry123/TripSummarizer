import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { getRecommendation } from "@/Apis/chatService";
import { useRecommendationStore } from "@/store/recommendationStore";
import Card from "@/Components/Common/Card";
import { HiSparkles, HiTrash } from "react-icons/hi";

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
    mutationFn: (msg?: string) => getRecommendation(msg, history),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, lastInitialMessage, history.length, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiSparkles className="text-3xl text-brand-primary animate-pulse" />
          <h1 className="text-3xl font-bold text-brand-primary">
            Your AI Travel Recommendations
          </h1>
        </div>
        {recommendation && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Clear conversation history and start fresh"
          >
            <HiTrash />
            Clear History
          </button>
        )}
      </div>

      <div className="mb-8">
        <Card className="p-8 min-h-100 flex flex-col bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/30 shadow-xl shadow-indigo-100/20">
          {mutation.isPending ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
              <p className="mt-6 text-xl font-medium text-brand-text-muted">
                Curating your next adventure...
              </p>
            </div>
          ) : recommendation ? (
            <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-brand-text">
              <ReactMarkdown>{recommendation}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-brand-text-muted italic">
              Click the button below to generate a tailored recommendation.
            </div>
          )}
        </Card>
      </div>

      <form
        onSubmit={handleGenerate}
        className="space-y-6 bg-soft-accent dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
      >
        <div>
          <label
            htmlFor="adjustment"
            className="block text-sm font-bold text-brand-text-muted mb-2 ml-1"
          >
            Refine your preferences
          </label>
          <textarea
            id="adjustment"
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none text-brand-text"
            rows={3}
            placeholder='e.g., "I want somewhere tropical", "More focus on history", "Budget-friendly options"'
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-brand-primary hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
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
