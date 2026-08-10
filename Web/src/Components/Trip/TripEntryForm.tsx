import { useState } from "react";
import { TripData } from "@/Types/trip";
import { useMobile } from "@/hooks/useMobile";
import { useTrips } from "@/hooks/useTrips";
import BaseEntryForm from "@/Components/Common/BaseEntryForm";
import {
  HiArrowRight,
  HiArrowLeft,
  HiPlus,
  HiX,
  HiCheck,
  HiStar,
} from "react-icons/hi";

type entryProps = {
  onClose: () => void;
};

const TripEntryForm = (props: entryProps) => {
  const { onClose } = props;
  const isMobile = useMobile();
  const { createTrip } = useTrips();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TripData>({
    country: "",
    city: [],
    travel_date: new Date().toISOString().split("T")[0],
    rating: 0,
    likes: [],
    hates: [],
    free_text: "",
  });

  const [currentCity, setCurrentCity] = useState("");
  const [currentLike, setCurrentLike] = useState("");
  const [currentHate, setCurrentHate] = useState("");

  const addCity = () => {
    if (currentCity.trim()) {
      setFormData({
        ...formData,
        city: [...formData.city, currentCity.trim()],
      });
      setCurrentCity("");
    }
  };

  const removeCity = (index: number) => {
    setFormData({
      ...formData,
      city: formData.city.filter((_, i) => i !== index),
    });
  };

  const addLike = () => {
    if (currentLike.trim()) {
      setFormData({
        ...formData,
        likes: [...formData.likes, currentLike.trim()],
      });
      setCurrentLike("");
    }
  };

  const addHate = () => {
    if (currentHate.trim()) {
      setFormData({
        ...formData,
        hates: [...formData.hates, currentHate.trim()],
      });
      setCurrentHate("");
    }
  };

  const removeLike = (index: number) => {
    setFormData({
      ...formData,
      likes: formData.likes.filter((_, i) => i !== index),
    });
  };

  const removeHate = (index: number) => {
    setFormData({
      ...formData,
      hates: formData.hates.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await createTrip(formData);
      onClose();
    } catch (err: any) {
      console.error("Failed to save trip:", err);
      setError(
        err.response?.data?.message || "Failed to save trip. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseEntryForm onClose={onClose} totalSteps={4} error={error}>
      {({ step, nextStep, prevStep }) => (
        <>
          {/* Step 1: Location & Date */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                Where and when?
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="e.g. Japan"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Cities</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="e.g. Tokyo"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
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
                    {formData.city.map((item, i) => (
                      <span key={i} className="floating">
                        {item}
                        <button
                          onClick={() => removeCity(i)}
                          className="hover:text-indigo-900 dark:hover:text-indigo-200"
                        >
                          <HiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 indicator">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-full border border-slate-200 dark:border-slate-600 outline-none"
                    value={formData.travel_date}
                    onChange={(e) =>
                      setFormData({ ...formData, travel_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                disabled={
                  !formData.country ||
                  formData.city.length === 0 ||
                  !formData.travel_date
                }
                onClick={nextStep}
                className="next-step"
              >
                <HiArrowRight />
              </button>
            </div>
          )}

          {/* Step 2: Rating & Feeling */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                How was the vibe?
              </h3>
              <div
                className={`flex justify-center ${isMobile ? "gap-2" : "gap-4"} py-4`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`${isMobile ? "text-3xl" : "text-4xl"} transition-transform hover:scale-110 ${formData.rating >= star ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                  >
                    <HiStar />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-slate-500">
                {formData.rating === 0
                  ? "Select a rating"
                  : `You rated it ${formData.rating} out of 5`}
              </p>
              <div className="flex gap-4">
                <button onClick={prevStep} className="prev-step">
                  <HiArrowLeft />
                </button>
                <button
                  disabled={formData.rating === 0}
                  onClick={nextStep}
                  className="next-step"
                >
                  <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Likes and Hates */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                The Good and The Bad
              </h3>

              <div className="space-y-4">
                <label className="block text-sm font-bold">
                  What did you love?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="e.g. Amazing street food"
                    value={currentLike}
                    onChange={(e) => setCurrentLike(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLike()}
                  />
                  <button
                    onClick={addLike}
                    className="bg-primary-3 rounded p-3 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer"
                  >
                    <HiPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.likes.map((item, i) => (
                    <span key={i} className="floating">
                      {item}{" "}
                      <button
                        onClick={() => removeLike(i)}
                        className="hover:text-emerald-900"
                      >
                        <HiX />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold">
                  What could have been better?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g. Too crowded in the metro"
                    value={currentHate}
                    onChange={(e) => setCurrentHate(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHate()}
                  />
                  <button
                    onClick={addHate}
                    className="bg-primary-3 rounded p-3 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer"
                  >
                    <HiPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.hates.map((item, i) => (
                    <span key={i} className="floating">
                      {item}{" "}
                      <button
                        onClick={() => removeHate(i)}
                        className="hover:text-rose-900"
                      >
                        <HiX />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="prev-step">
                  <HiArrowLeft />
                </button>
                <button onClick={nextStep} className="next-step">
                  <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Free Text */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                Anything else?
              </h3>
              <p className="text-slate-500 text-sm">
                Tell us more about your experience (optional).
              </p>
              <textarea
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all min-h-37.5"
                placeholder="Write your story here..."
                value={formData.free_text}
                onChange={(e) =>
                  setFormData({ ...formData, free_text: e.target.value })
                }
              />
              <div className="flex gap-4">
                <button onClick={prevStep} className="prev-step">
                  <HiArrowLeft />
                </button>
                <button
                  disabled={loading}
                  onClick={handleSave}
                  className="next-step"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <HiCheck className="text-xl" /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </BaseEntryForm>
  );
};

export default TripEntryForm;
