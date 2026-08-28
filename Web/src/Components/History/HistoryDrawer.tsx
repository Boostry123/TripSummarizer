import React from "react";
import { HiClock, HiChevronLeft, HiTrash } from "react-icons/hi";
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
      {/* Collapsed Toggle Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed top-17 left-2 z-40 p-3 bg-primary-1 hover:bg-primary-1 backdrop-blur-md border border-primary-2 rounded-2xl text-primary-4 hover:text-black cursor-pointer transition-all duration-200 hover:scale-105 flex items-center justify-center"
          title="Open History Panel"
          aria-label="Open History Panel"
        >
          <HiClock className="w-6 h-6" />
        </button>
      )}

      {/* Collapsible Side Panel */}
      <aside
        className={`fixed bottom-0 left-0 z-40 h-[calc(100dvh-53px)] sm:h-[calc(100dvh-58px)] bg-primary-1 border-r border-primary-2 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
        aria-label="Recommendation History Panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary-3/20 bg-primary-2/20">
          <div className="flex items-center gap-2">
            <HiClock className="w-5 h-5 text-primary-4" />
            <span className="font-bold text-base text-primary-4">
              Recent Recommendations
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-primary-0 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-sm font-medium"
            title="Collapse History Panel"
            aria-label="Collapse History Panel"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-primary-4/70 space-y-2">
              <HiClock className="w-8 h-8 opacity-40" />
              <p className="text-sm italic">No history yet</p>
            </div>
          ) : (
            historyList.map((r) => {
              const fullTitle = `${r.country} (${r.cities})`;
              const isSelected = currentId === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-primary-0 border-primary-3 shadow-xs font-semibold ring-1 ring-primary-3/30"
                      : "bg-primary-0/70 hover:bg-primary-0 border-primary-3/20 hover:border-primary-3/40"
                  }`}
                >
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span
                      className="font-bold text-sm text-gray-900 leading-snug break-words"
                      title={fullTitle}
                    >
                      {truncateText(fullTitle, isMobile ? 35 : 55)}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
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
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors shrink-0"
                    title="Delete this history"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {historyList.length > 0 && (
          <div className="px-5 py-3 border-t border-primary-3/20 bg-primary-2/10 text-xs text-primary-4 font-medium flex items-center justify-between">
            <span>
              {historyList.length}{" "}
              {historyList.length === 1 ? "session" : "sessions"}
            </span>
          </div>
        )}
      </aside>
    </>
  );
};

export default HistoryDrawer;
