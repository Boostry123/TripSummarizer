import React, { useState, useEffect } from "react";
import { Trip, TripUpdate } from "@/Types/trip";
import {
  HiX,
  HiPencil,
  HiStar,
  HiCalendar,
  HiLocationMarker,
  HiCheck,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-200"
        padding="none"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-slate-100 dark:border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
              <HiLocationMarker className="text-2xl" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        className="text-lg font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 w-full"
                        value={editedTrip.country || ""}
                        onChange={(e) => updateField("country", e.target.value)}
                        placeholder="Country"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        className="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-2.5 w-full h-10.5"
                        value={editedTrip.travel_date || ""}
                        onChange={(e) =>
                          updateField("travel_date", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Cities
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        placeholder="Add a city..."
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addCity()}
                      />
                      <button
                        onClick={addCity}
                        className="bg-indigo-600 text-white px-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center"
                      >
                        <HiPlus />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {((editedTrip.city as string[]) || []).map(
                        (item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-lg border border-indigo-100 dark:border-indigo-800/30 flex items-center gap-2"
                          >
                            {item}
                            <button
                              onClick={() => removeCity(idx)}
                              className="text-indigo-600 dark:text-indigo-500 hover:text-indigo-800"
                            >
                              <HiX />
                            </button>
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                      {trip.country}
                    </h2>
                    <span className="text-slate-300 dark:text-slate-600">
                      |
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {trip.city.map((c, i) => (
                        <span
                          key={i}
                          className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg"
                        >
                          {c}
                          {i < trip.city.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                    <HiCalendar className="text-lg" />
                    <span>
                      {new Date(trip.travel_date).toLocaleDateString(
                        undefined,
                        { dateStyle: "long" },
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => onDelete?.(trip.id)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                title="Delete Trip"
              >
                <HiTrash className="text-2xl" />
              </button>
            )}
            {!isEditing ? (
              <button
                onClick={toggleEdit}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                title="Edit Trip"
              >
                <HiPencil className="text-2xl" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors disabled:opacity-50"
                title="Save Changes"
              >
                {isSaving ? (
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <HiCheck className="text-2xl" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <HiX className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Rating Section */}
          <section className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="space-y-1 w-full">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Experience Rating
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Likes */}
            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                What you loved
              </h3>

              {isEditing && (
                <div className="flex gap-2">
                  <input
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    placeholder="Add a like..."
                    value={newLike}
                    onChange={(e) => setNewLike(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLike()}
                  />
                  <button
                    onClick={addLike}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
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
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg border border-green-100 dark:border-green-800/30 flex items-center gap-2"
                    >
                      {item}
                      {isEditing && (
                        <button
                          onClick={() => removeLike(idx)}
                          className="text-green-600 dark:text-green-500 hover:text-green-800"
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
            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                What wasn't so great
              </h3>

              {isEditing && (
                <div className="flex gap-2">
                  <input
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    placeholder="Add a dislike..."
                    value={newHate}
                    onChange={(e) => setNewHate(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHate()}
                  />
                  <button
                    onClick={addHate}
                    className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
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
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-sm font-medium rounded-lg border border-rose-100 dark:border-rose-800/30 flex items-center gap-2"
                    >
                      {item}
                      {isEditing && (
                        <button
                          onClick={() => removeHate(idx)}
                          className="text-rose-600 dark:text-rose-500 hover:text-rose-800"
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
          <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Your Story
            </h3>
            {isEditing ? (
              <textarea
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm min-h-32"
                value={editedTrip.free_text || ""}
                onChange={(e) => updateField("free_text", e.target.value)}
                placeholder="Share your story..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {trip.free_text ? (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                    "{trip.free_text}"
                  </p>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                    No narrative added
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </Card>
    </div>
  );
};

export default TripDetailsModal;
