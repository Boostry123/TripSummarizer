import React, { useState, useMemo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { HiSparkles, HiTrash } from "react-icons/hi";
import { useRecommendationStore } from "@/store/recommendationStore";
//Hooks
import { useGenerateRecommendation } from "@/hooks/useGenerateRecommendation";
import { useHistory } from "@/hooks/useHistory";
//Component
import Card from "@/Components/Common/Card";
import ImageContainer from "@/Components/Images/ImageContainer";
import ConfirmationModal from "@/Components/Common/ConfirmationModal";
import NewTripEntryForm from "@/Components/Trip/NewTripEntryForm";
import HistoryDrawer from "@/Components/History/HistoryDrawer";
import BlobLoader from "@/Components/Loaders/BlobLoader";
//Helper
import agentResponseToJson from "@/Helper/agentResponseToJson";
//Types
import { History } from "@/Types/history";
import checkImageUrl from "@/Helper/checkImageUrl";

type recType = {
  id: string;
  updated_at: string;
  country: string;
  cities: string;
};

const RecommendationPage: React.FC = () => {
  const { historyData, deleteHistory, isDeleting } = useHistory();
  const { mutate, isPending } = useGenerateRecommendation();

  const {
    id: currentRecommendationId,
    recommendation,
    clearHistory,
    setRecommendation,
    addToHistory,
    setRecommendationId,
    isLoading,
  } = useRecommendationStore();

  const [adjustment, setAdjustment] = useState("");
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [historyToDelete, setHistoryToDelete] = useState<string | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(
    recommendation ? false : true,
  );
  const defaultImagePath = "/defaultRecImage.jpg";
  const [imageURL, setImageURL] = useState(defaultImagePath);

  const handleGenerate = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (adjustment.trim() === "") {
      setAdjustment("");
      return;
    }

    mutate(adjustment);
    setAdjustment("");
  };

  const handleRecentClicked = (r: recType) => {
    const recentTrip: History | undefined = historyData
      ? historyData.find((rec) => rec.id === r.id)
      : undefined;
    if (!recentTrip) return;
    clearHistory();
    const chosenRecommendation =
      recentTrip.chat_history[recentTrip.chat_history.length - 1]?.content ||
      "";
    setRecommendationId(recentTrip.id);
    setRecommendation(chosenRecommendation);

    recentTrip.chat_history.forEach((h) => {
      addToHistory(h);
    });
    setHistoryModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!historyToDelete) return;
    try {
      await deleteHistory(historyToDelete);
      if (currentRecommendationId === historyToDelete) {
        clearHistory();
      }
    } catch (err) {
      console.error("Failed to delete history:", err);
    } finally {
      setHistoryToDelete(null);
    }
  };

  const recommendationToJson = useMemo(
    () => recommendation && agentResponseToJson(recommendation),
    [recommendation],
  );

  useEffect(() => {
    let isMounted = true;

    const verifyImage = async () => {
      if (recommendationToJson) {
        const isValid = await checkImageUrl(recommendationToJson.imageUrl);

        if (isValid && isMounted) {
          setImageURL(recommendationToJson.imageUrl);
        } else if (isMounted) {
          setImageURL(defaultImagePath);
        }
      }
    };

    verifyImage();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [recommendationToJson]);

  const recommendationHistory = useMemo(() => {
    let results: recType[] = [];
    if (historyData && historyData.length > 0) {
      historyData.forEach((e) => {
        const recLength = e.chat_history.length;
        const recContent = e.chat_history[recLength - 1]?.content || "";
        const { remainingData } = agentResponseToJson(recContent);
        results.push({
          id: e.id,
          updated_at: e.updated_at || e.created_at,
          country: remainingData.Country,
          cities: remainingData.Cities,
        });
      });
    }
    return results;
  }, [historyData]);

  return (
    <div className="flex flex-col bg-primary-0 px-6 py-8 min-h-screen">
      {/* Dedicated History Drawer */}
      <HistoryDrawer
        isOpen={historyModalOpen}
        onOpen={() => setHistoryModalOpen(true)}
        onClose={() => setHistoryModalOpen(false)}
        historyList={recommendationHistory}
        currentId={currentRecommendationId}
        onSelect={handleRecentClicked}
        onDelete={(id) => setHistoryToDelete(id)}
        isDeleting={isDeleting}
      />

      <div className="mb-8 z-1">
        {isPending || isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <BlobLoader />
            <p>Curating your next adventure...</p>
          </div>
        ) : recommendationToJson ? (
          <div className="flex flex-col space-y-4 justify-center items-center">
            <div className="flex justify-center">
              <ImageContainer
                URL={imageURL}
                user={
                  imageURL !== defaultImagePath
                    ? recommendationToJson.imageUser
                    : undefined
                }
              />
            </div>
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
        <div className="modal-backdrop overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <NewTripEntryForm onClose={() => setNewTripOpen(false)} />
          </div>
        </div>
      )}
      {recommendation && (
        <form
          onSubmit={handleGenerate}
          className="space-y-4 p-6 border rounded-xl bg-primary-1 z-1"
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
                Update Recommendation
              </>
            )}
          </button>
        </form>
      )}
      <ConfirmationModal
        isOpen={!!historyToDelete}
        title="Delete History"
        message="Are you sure you want to delete this recommendation history? This action cannot be undone."
        confirmText="Delete"
        isConfirming={isDeleting}
        onCancel={() => setHistoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
      <div className="absolute z-0 self-center bottom-0">
        <img src="world_vector.svg" width="1280" height="1098" className="" />
      </div>
    </div>
  );
};

export default RecommendationPage;
