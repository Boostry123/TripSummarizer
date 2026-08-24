import React from "react";
import { HiArrowRight, HiTrash, HiX } from "react-icons/hi";
import { useMobile } from "@/hooks/useMobile";
import truncateText from "@/Helper/truncateText";

export type HistoryItemSummary = {
  id: string;
  updated_at: string;
  country: string;
  cities: string;
};

interface HistoryDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  historyList: HistoryItemSummary[];
  currentId?: string | null;
  onSelect: (item: HistoryItemSummary) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onOpen,
  onClose,
  historyList,
  currentId,
  onSelect,
  onDelete,
  isDeleting = false,
}) => {
  const isMobile = useMobile();

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed top-20 left-4 z-40 flex items-center gap-2 p-2.5 bg-primary-1/90 backdrop-blur-md border rounded-xl shadow-lg text-primary-4 hover:text-black cursor-pointer transition-all"
          title="Recommendation History"
          aria-label="Recommendation History"
        >
          <HiArrowRight className="w-5 h-5" />
          {!isMobile && <span className="text-xs font-bold pr-1">History</span>}
        </button>
      )}

      {/* Drawer Panel */}
      {isOpen && (
        <div
          className={`fixed top-20 left-4 z-40 bg-primary-1/90 backdrop-blur-md border rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden transition-all ${
            isMobile ? "w-[calc(100vw-2rem)]" : "w-80"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary-2/20">
            <span className="font-bold text-sm text-primary-4">
              Recent Recommendations
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-primary-4 bg-primary-0 rounded-2xl cursor-pointer"
              title="Close History"
              aria-label="Close History"
            >
              <HiX className="text-2xl" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[60vh]">
            {historyList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6 italic">
                No history yet
              </p>
            ) : (
              historyList.map((r) => {
                const fullTitle = `${r.country} (${r.cities})`;
                const isSelected = currentId === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => onSelect(r)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary-0 border-primary-3 font-semibold"
                        : "bg-primary-0/70 hover:bg-primary-0 border-primary-3/20"
                    }`}
                  >
                    <div className="flex flex-col text-left min-w-0 flex-1">
                      <span className="font-bold text-sm" title={fullTitle}>
                        {truncateText(fullTitle, isMobile ? 35 : 60)}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {new Date(r.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(r.id);
                      }}
                      disabled={isDeleting}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0"
                      title="Delete this history"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryDrawer;
