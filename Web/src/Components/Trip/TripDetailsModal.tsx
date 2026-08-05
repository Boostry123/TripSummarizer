import React, { useState, useEffect } from "react";
import { Trip, TripUpdate } from "@/Types/trip";
import {
  HiX,
  HiPencil,
  HiStar,
  HiCalendar,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import Card from "@/Components/Common/Card";

interface TripDetailsModalProps {
  trip: Trip;
  onClose: () => void;
  onSave: (id: string, updates: TripUpdate) => Promise<void>;
  onDelete?: (id: string) => void;
}

const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState<TripUpdate>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [newLike, setNewLike] = useState("");
  const [newHate, setNewHate] = useState("");

  // Initialize edited trip with current trip values when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditedTrip({
        country: trip.country,
        city: [...trip.city],
        travel_date: trip.travel_date,
        rating: trip.rating,
        likes: [...trip.likes],
        hates: [...trip.hates],
        free_text: trip.free_text,
      });
    }
  }, [isEditing, trip]);

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(trip.id, editedTrip);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const updateField = (field: keyof TripUpdate, value: any) => {
    setEditedTrip((prev) => ({ ...prev, [field]: value }));
  };

  const addCity = () => {
    if (newCity.trim()) {
      const currentCities = (editedTrip.city as string[]) || [];
      updateField("city", [...currentCities, newCity.trim()]);
      setNewCity("");
    }
  };

  const removeCity = (idx: number) => {
    const currentCities = (editedTrip.city as string[]) || [];
    updateField(
      "city",
      currentCities.filter((_, i) => i !== idx),
    );
  };

  const addLike = () => {
    if (newLike.trim()) {
      const currentLikes = (editedTrip.likes as string[]) || [];
      updateField("likes", [...currentLikes, newLike.trim()]);
      setNewLike("");
    }
  };

  const addHate = () => {
    if (newHate.trim()) {
      const currentHates = (editedTrip.hates as string[]) || [];
      updateField("hates", [...currentHates, newHate.trim()]);
      setNewHate("");
    }
  };

  const removeLike = (idx: number) => {
    const currentLikes = (editedTrip.likes as string[]) || [];
    updateField(
      "likes",
      currentLikes.filter((_, i) => i !== idx),
    );
  };

  const removeHate = (idx: number) => {
    const currentHates = (editedTrip.hates as string[]) || [];
    updateField(
      "hates",
      currentHates.filter((_, i) => i !== idx),
    );
  };

  return (
    <div
      className="fixed inset-0 z-10 flex flex-wrap items-center justify-center p-4 bg-primary-4/20 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Card
        className="max-w-3xl max-h-full overflow-y-auto shadow-2xl"
        padding="none"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className=" top-0  bg-primary-2 z-10  p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="space-y-4">
                <div className="w-full grid grid-cols-13 gap-5">
                  <div className="space-y-1 col-span-6">
                    <label className="font-bold">Country</label>
                    <input
                      className="w-full bg-primary-1 rounded py-2 px-3 font-semibold"
                      value={editedTrip.country || ""}
                      onChange={(e) => updateField("country", e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                  <div className="space-y-1 col-span-6">
                    <label className="font-bold">Travel Date</label>
                    <input
                      type="date"
                      className="w-full bg-primary-1 rounded py-2 px-3 font-semibold"
                      value={editedTrip.travel_date || ""}
                      onChange={(e) =>
                        updateField("travel_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-1 justify-self-end px-1">
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-primary-4 cursor-pointer bg-primary-0 rounded-2xl"
                      title="Close Modal"
                    >
                      <HiX className="text-2xl" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold">Cities</label>
                  <div className="flex gap-2">
                    <input
                      className=" bg-primary-1 w-full rounded py-2 px-3 font-semibold"
                      placeholder="Add a city..."
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCity()}
                    />
                    <button
                      onClick={addCity}
                      className="bg-primary-3 rounded p-3 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer"
                    >
                      <HiPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {((editedTrip.city as string[]) || []).map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-primary-4/20 rounded-lg px-3 py-1 font-semibold flex items-center gap-2 border border-primary-3"
                      >
                        {item}
                        <button
                          onClick={() => removeCity(idx)}
                          className="text-primary-3 hover:text-primary-1 cursor-pointer"
                        >
                          <HiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <div>
                    <h2 className="font-bold text-2xl">{trip.country}</h2>
                  </div>

                  <div className="flex gap-2">
                    <span>{"("}</span>
                    {trip.city.map((c, i) => (
                      <span key={i} className="flex font-bold text-gray-500">
                        {c}
                        {i < trip.city.length - 1 ? "," : ""}
                      </span>
                    ))}
                    <span>{")"}</span>

                    <HiCalendar className="text-lg text-black" />
                    <span className="font-bold text-gray-500">
                      {new Date(trip.travel_date).toLocaleDateString(
                        undefined,
                        {
                          dateStyle: "long",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isEditing && (
              <button
                onClick={() => onDelete?.(trip.id)}
                className="text-gray-500 hover:text-red-500 cursor-pointer bg-primary-0 rounded-2xl"
                title="Delete Trip"
              >
                <HiTrash className="text-2xl" />
              </button>
            )}
            {!isEditing && (
              <button
                onClick={toggleEdit}
                className="text-gray-500 hover:text-blue-500 cursor-pointer bg-primary-0 rounded-2xl"
                title="Edit Trip"
              >
                <HiPencil className="text-2xl" />
              </button>
            )}
            {!isEditing && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-primary-4 cursor-pointer bg-primary-0 rounded-2xl"
                title="Close Modal"
              >
                <HiX className="text-2xl" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Rating Section */}
          <section className="flex bg-primary-4/20 rounded-xl p-4 items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={!isEditing}
                    onClick={() => updateField("rating", star)}
                    className={`text-2xl transition-transform ${isEditing ? "hover:scale-110 cursor-pointer" : "cursor-default"} ${
                      star <= (isEditing ? editedTrip.rating || 0 : trip.rating)
                        ? "text-amber-400"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  >
                    <HiStar />
                  </button>
                ))}
              </div>
            </div>
          </section>
          {/* Likes & Hates Grid */}
          <div className="grid grid-cols-2 items-baseline">
            {/* Likes */}
            <section className="flex flex-col gap-2 items-center justify-center border-r pr-2">
              <h3 className="font-bold">What you loved</h3>

              {isEditing && (
                <div className="flex gap-2 mb-2">
                  <input
                    className=" bg-primary-2 rounded py-2 px-3 font-semibold "
                    placeholder="Add a like..."
                    value={newLike}
                    onChange={(e) => setNewLike(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLike()}
                  />
                  <button
                    onClick={addLike}
                    className="bg-primary-3 rounded p-3 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer"
                  >
                    <HiPlus />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(isEditing ? (editedTrip.likes as string[]) || [] : trip.likes)
                  .length > 0 ? (
                  (isEditing
                    ? (editedTrip.likes as string[]) || []
                    : trip.likes
                  ).map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-4/20 rounded-lg px-3 py-1 font-semibold flex items-center gap-2 border border-primary-3"
                    >
                      {item}
                      {isEditing && (
                        <button
                          onClick={() => removeLike(idx)}
                          className="text-primary-3 hover:text-primary-1 cursor-pointer"
                        >
                          <HiX />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                    No likes recorded
                  </p>
                )}
              </div>
            </section>

            {/* Hates */}
            <section className="flex flex-col gap-2 items-center justify-center pl-2">
              <h3 className="font-bold">What you hated</h3>
              {isEditing && (
                <div className="flex gap-2 mb-2">
                  <input
                    className=" bg-primary-2 rounded py-2 px-3 font-semibold"
                    placeholder="Add a dislike..."
                    value={newHate}
                    onChange={(e) => setNewHate(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHate()}
                  />
                  <button
                    onClick={addHate}
                    className="bg-primary-3 rounded p-3 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer"
                  >
                    <HiPlus />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(isEditing ? (editedTrip.hates as string[]) || [] : trip.hates)
                  .length > 0 ? (
                  (isEditing
                    ? (editedTrip.hates as string[]) || []
                    : trip.hates
                  ).map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-4/20 rounded-lg px-3 py-1 font-semibold flex items-center gap-2 border border-primary-3"
                    >
                      {item}
                      {isEditing && (
                        <button
                          onClick={() => removeHate(idx)}
                          className="text-primary-3 hover:text-primary-1 cursor-pointer"
                        >
                          <HiX />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                    No dislikes recorded
                  </p>
                )}
              </div>
            </section>
          </div>
          {/* Narrative Section */}
          <section className="flex flex-col gap-2 items-center border-t pt-2">
            <h3 className="font-bold">Your Story</h3>
            {isEditing ? (
              <textarea
                className="w-full rounded-lg p-2 min-h-32 bg-primary-3/20 border border-primary-3"
                value={editedTrip.free_text || ""}
                onChange={(e) => updateField("free_text", e.target.value)}
                placeholder="Share your story..."
              />
            ) : (
              <div className="flex flex-col items-center">
                {trip.free_text ? (
                  <p className="font-semibold">{trip.free_text.trim()}</p>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                    No narrative added
                  </p>
                )}
              </div>
            )}
          </section>
          <div className="flex items-center justify-center">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary-3 rounded px-3 py-2 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer "
              title="Save Changes"
            >
              Save
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripDetailsModal;
