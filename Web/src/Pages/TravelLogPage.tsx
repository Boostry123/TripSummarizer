import { useState } from "react";
import TripEntryForm from "@/Components/TripEntryForm";
import NewTripEntryForm from "@/Components/NewTripEntryForm";
import TripDetailsModal from "@/Components/TripDetailsModal";
import { useMobile } from "@/hooks/useMobile";
import { useTrips } from "@/hooks/useTrips";
import {
  HiStar,
  HiTrash,
  HiCalendar,
  HiLocationMarker,
  HiPlus,
  HiSparkles,
} from "react-icons/hi";
import { Trip, TripUpdate } from "@/Types/trip";
import Card from "@/Components/Card";

const TravelLogPage = () => {
  const isMobile = useMobile();
  const [newLogOpen, setNewLogOpen] = useState(false);
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const { trips, isLoading, error, deleteTrip, updateTrip } = useTrips();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(id);
        if (selectedTrip?.id === id) {
          setSelectedTrip(null);
        }
      } catch (err) {
        console.error("Failed to delete trip:", err);
        alert("Failed to delete trip");
      }
    }
  };

  const handleSaveTrip = async (id: string, updates: TripUpdate) => {
    try {
      const updated = await updateTrip({ id, tripData: updates });
      // Update the selected trip in state so the modal reflects changes immediately
      if (selectedTrip?.id === id) {
        setSelectedTrip(updated);
      }
    } catch (err) {
      console.error("Failed to update trip:", err);
      throw err; // Re-throw to let the modal handle the error state
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans min-h-screen">
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
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setNewLogOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <HiPlus className="text-xl" />
              New Trip Log
            </button>
            <button
              onClick={() => setNewTripOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400/50 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all active:scale-95"
            >
              <HiSparkles className="text-xl" />
              Plan New Trip
            </button>
          </div>
        </div>

        {/* Trips List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500">Loading your adventures...</p>
            </div>
          )}

          {error && (
            <div className="col-span-full text-center py-20 text-rose-500">
              <p>Failed to load trips. Please try again later.</p>
            </div>
          )}

          {!isLoading && trips?.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500">
                No trips logged yet. Start your journey!
              </p>
            </div>
          )}

          {trips?.map((trip) => (
            <Card
              key={trip.id}
              className="group hover:shadow-xl transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="pr-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <HiLocationMarker className="text-indigo-500 shrink-0" />
                    <span className="truncate">{trip.country}</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {trip.city.slice(0, 3).join(", ")}
                      {trip.city.length > 3 && (
                        <span className="text-slate-400 text-xs ml-1 font-normal">
                          +{trip.city.length - 3} more
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mt-2">
                    <HiCalendar />
                    {new Date(trip.travel_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded text-amber-600 font-bold shrink-0">
                  <HiStar className="mr-1" />
                  {trip.rating}
                </div>
              </div>

              {trip.free_text && (
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 italic">
                  "{trip.free_text}"
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {trip.likes.slice(0, 3).map((like, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-xs px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/30"
                  >
                    {like}
                  </span>
                ))}
                {trip.likes.length > 3 && (
                  <span className="text-slate-400 text-xs py-1">
                    +{trip.likes.length - 3} more
                  </span>
                )}
              </div>

              <button
                onClick={(e) => handleDelete(e, trip.id)}
                className="absolute bottom-4 right-4 p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
                aria-label="Delete trip"
              >
                <HiTrash />
              </button>
            </Card>
          ))}
        </div>

        {/* Modals */}
        {newLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl my-auto">
              <TripEntryForm onClose={() => setNewLogOpen(false)} />
            </div>
          </div>
        )}

        {newTripOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl my-auto">
              <NewTripEntryForm onClose={() => setNewTripOpen(false)} />
            </div>
          </div>
        )}

        {selectedTrip && (
          <TripDetailsModal
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
            onSave={handleSaveTrip}
            onDelete={(id) => {
              const e = { stopPropagation: () => {} } as React.MouseEvent;
              handleDelete(e, id);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default TravelLogPage;
