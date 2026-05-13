import { useState } from "react";
import TripEntryForm from "@/Components/TripEntryForm";
import { useMobile } from "@/hooks/useMobile";

const TravelLogPage = () => {
  const isMobile = useMobile();
  const [newLogOpen, setNewLogOpen] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <main className={`max-w-7xl mx-auto px-6 py-10 pb-20`}>
        <div className={`text-center ${isMobile ? "mb-8" : "mb-12"}`}>
          <h2
            className={`${isMobile ? "text-3xl" : "text-4xl"} font-extrabold mb-4 tracking-tight`}
          >
            Log Your Adventure
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Share the details of your trip. Our AI uses this information to
            understand your travel soul.
          </p>
          <button
            onClick={() => setNewLogOpen(true)}
            className="mt-6 inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Trip Log
          </button>
        </div>
        {newLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl my-auto">
              <TripEntryForm onClose={() => setNewLogOpen(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TravelLogPage;
