import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { HiSparkles, HiTrash, HiX, HiArrowRight } from "react-icons/hi";
//Store
import { useRecommendationStore } from "@/store/recommendationStore";
//Hooks
import { useGenerateRecommendation } from "@/hooks/useGenerateRecommendation";
//Component
import Card from "@/Components/Common/Card";
import ImageContainer from "@/Components/Images/ImageContainer";
//Helper
import agentResponseToJson from "@/Helper/agentResponseToJson";
import { useHistory } from "@/hooks/useHistory";
import NewTripEntryForm from "@/Components/Trip/NewTripEntryForm";
//Types
import { History } from "@/Types/history";

type recType = {
  id: string;
  updated_at: string;
  country: string;
  cities: string;
};

const RecommendationPage: React.FC = () => {
  const allHistory = useHistory();
  const { mutate, isPending } = useGenerateRecommendation();

  const { recommendation, clearHistory, setRecommendation, addToHistory } =
    useRecommendationStore();

  const [adjustment, setAdjustment] = useState("");
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(
    recommendation ? false : true,
  );

  const handleGenerate = (e: React.SubmitEvent) => {
    e.preventDefault();
    mutate(adjustment);
    setAdjustment("");
  };

  const handleRecentClicked = (r: recType) => {
    const recentTrip: History | undefined = allHistory.historyData
      ? allHistory.historyData.find((rec) => rec.id === r.id)
      : undefined;
    console.log(recentTrip);
    if (!recentTrip) return;
    clearHistory();
    const chosenRecommendation =
      recentTrip.chat_history[recentTrip.chat_history.length - 1].content;

    setRecommendation(chosenRecommendation);

    recentTrip.chat_history.map((h) => {
      addToHistory(h);
    });
  };

  const recommendationToJson = useMemo(
    () => agentResponseToJson(recommendation),
    [recommendation],
  );

  const recommendationHistory = useMemo(() => {
    let results: recType[] = [];
    allHistory.historyData && allHistory.historyData.length > 0
      ? allHistory.historyData.map((e) => {
          const recLength = e.chat_history.length;
          const recContent = e.chat_history[recLength - 1].content;
          const { remainingData } = agentResponseToJson(recContent);
          results.push({
            id: e.id,
            updated_at: e.updated_at || e.created_at,
            country: remainingData.Country,
            cities: remainingData.Cities,
          });
        })
      : "No history";
    return results;
  }, [allHistory.isLoading]);

  return (
    <div className="flex flex-col bg-primary-0 px-6 py-8 min-h-screen">
      <div className="fixed w-fit flex-col left-1 bg-primary-1 border items-end rounded">
        <div className="col-span-1 justify-self-end pt-1 px-2">
          <button
            className={`text-gray-500 hover:text-primary-4 cursor-pointer  ${historyModalOpen ? "rounded-2xl bg-primary-0 border" : ""}`}
            onClick={() => setHistoryModalOpen(!historyModalOpen)}
          >
            {historyModalOpen ? <HiX /> : <HiArrowRight />}
          </button>
        </div>

        {historyModalOpen ? (
          <div className="mx-1 w-fit rounded ">
            <label className="font-bold">Recent:</label>
            <div className="flex flex-col w-fit">
              {recommendationHistory.map((r) => (
                <Card
                  padding={"small"}
                  className={"bg-primary-1 m-2 border-0"}
                  key={r.id}
                  hoverable={true}
                  onClick={() => {
                    handleRecentClicked(r);
                  }}
                >
                  <div className="flex justify-center gap-2">
                    <span className="font-bold">{`${r.country} (${r.cities})  `}</span>
                    <span className="text-gray-400">
                      {new Date(r.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mb-8">
        {isPending ? (
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
                <div className="flex justify-end">
                  <button
                    onClick={clearHistory}
                    className="flex bg-red-400 items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium"
                    title="Clear conversation history and start fresh"
                  >
                    <HiTrash />
                    Clear
                  </button>
                </div>
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
          <div className="flex justify-center w-full p-2">
            <button
              onClick={() => setNewTripOpen(true)}
              className="bg-primary-1 flex items-center gap-2 px-6 py-3 font-bold border rounded-lg cursor-pointer hover:bg-primary-0 transition-colors duration-200"
            >
              <HiSparkles />
              Plan New Trip
            </button>
          </div>
        )}
      </div>
      {newTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <NewTripEntryForm onClose={() => setNewTripOpen(false)} />
          </div>
        </div>
      )}
      {recommendation && (
        <form
          onSubmit={handleGenerate}
          className="space-y-4 p-6 border rounded-xl bg-primary-1"
        >
          <div>
            <label
              htmlFor="adjustment"
              className="block text-sm font-bold mb-2"
            >
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
            disabled={isPending}
            className="w-full bg-primary-2 py-3 border rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
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
      )}
    </div>
  );
};

export default RecommendationPage;
