import { useState } from "react";
import TripEntryForm from "@/Components/Trip/TripEntryForm";
import NewTripEntryForm from "@/Components/Trip/NewTripEntryForm";
import TripDetailsModal from "@/Components/Trip/TripDetailsModal";
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
import Card from "@/Components/Common/Card";
import BlobLoader from "@/Components/Loaders/BlobLoader";

const TravelLogPage = () => {
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
    <div className="bg-primary-0">
      <main className="max-w-7xl mx-auto flex flex-col min-h-screen px-4 py-8 items-center">
        <div className="text-center mb-10 z-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Log Your Adventure
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-base mb-6">
            Share the details of your trip. Our AI uses this information to
            understand your travel soul.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setNewLogOpen(true)}
              className="bg-primary-1 flex items-center gap-2 px-6 py-3 font-bold border rounded-lg cursor-pointer hover:bg-primary-0 transition-colors duration-200"
            >
              <HiPlus />
              New Trip Log
            </button>
            <button
              onClick={() => setNewTripOpen(true)}
              className="bg-primary-1 flex items-center gap-2 px-6 py-3 font-bold border rounded-lg cursor-pointer hover:bg-primary-0 transition-colors duration-200"
            >
              <HiSparkles />
              Plan New Trip
            </button>
          </div>
        </div>

        {/* Trips List */}
        <div
          className={`grid ${!isLoading && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-6 z-1`}
        >
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <BlobLoader />
              <p>Loading your trips...</p>
            </div>
          )}

          {error && (
            <div className="col-span-full text-center py-12">
              <p>Failed to load trips. Please try again later.</p>
            </div>
          )}

          {!isLoading && trips?.length === 0 && (
            <div className="col-span-full text-center py-12 border rounded-xl">
              <p>No trips logged yet. Start your journey!</p>
            </div>
          )}

          {trips?.map((trip) => (
            <Card
              key={trip.id}
              className="relative cursor-pointer"
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <HiLocationMarker />
                    <span>{trip.country}</span>
                  </h3>
                  <div>
                    <p className="text-sm font-medium">
                      {trip.city.slice(0, 3).join(", ")}
                      {trip.city.length > 3 && (
                        <span>+{trip.city.length - 3} more</span>
                      )}
                    </p>
                  </div>
                  <p className="text-xs flex items-center gap-1 mt-2">
                    <HiCalendar />
                    {new Date(trip.travel_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center font-bold">
                  <HiStar className="mr-1" />
                  {trip.rating}
                </div>
              </div>

              {trip.free_text && (
                <p className="text-sm mb-4 italic">"{trip.free_text}"</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {trip.likes.slice(0, 3).map((like, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 border rounded-full"
                  >
                    {like}
                  </span>
                ))}
                {trip.likes.length > 3 && (
                  <span className="text-xs py-1">
                    +{trip.likes.length - 3} more
                  </span>
                )}
              </div>

              <button
                onClick={(e) => handleDelete(e, trip.id)}
                className="absolute bottom-4 right-4 p-2 cursor-pointer"
                aria-label="Delete trip"
              >
                <HiTrash />
              </button>
            </Card>
          ))}
        </div>

        {/* Modals */}
        {newLogOpen && (
          <div className="modal-backdrop overflow-y-auto">
            <div className="w-full max-w-2xl my-auto">
              <TripEntryForm onClose={() => setNewLogOpen(false)} />
            </div>
          </div>
        )}

        {newTripOpen && (
          <div className="modal-backdrop overflow-y-auto">
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
        <div className="fixed z-0 bottom-0">
          <img src="world_vector.svg" width="1280" height="1098" className="" />
        </div>
      </main>
    </div>
  );
};

export default TravelLogPage;
