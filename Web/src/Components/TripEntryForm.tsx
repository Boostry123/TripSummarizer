import { useState } from "react";
import { TripData } from "@/Types/trip";
import { useMobile } from "@/hooks/useMobile";
import Card from "@/Components/Card";
import { useTrips } from "@/hooks/useTrips";
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
  const [step, setStep] = useState(1);
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

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

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
    <Card
      className="max-w-2xl mx-auto relative"
      padding={isMobile ? "small" : "medium"}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 z-10"
        aria-label="Close"
      >
        <HiX className="text-2xl" />
      </button>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Location & Date */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
            Where and when?
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g. Japan"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Tokyo"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCity()}
                />
                <button
                  onClick={addCity}
                  className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
                >
                  <HiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.city.map((item, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-indigo-100 dark:border-indigo-800/30"
                  >
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
              <label className="block text-sm font-medium mb-2">
                Travel Date
              </label>
              <input
                type="date"
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center text-xl"
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
            <button
              onClick={prevStep}
              className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-xl"
            >
              <HiArrowLeft />
            </button>
            <button
              disabled={formData.rating === 0}
              onClick={nextStep}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center text-xl"
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
            <label className="block text-sm font-medium">
              What did you love?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Amazing street food"
                value={currentLike}
                onChange={(e) => setCurrentLike(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addLike()}
              />
              <button
                onClick={addLike}
                className="bg-emerald-500 text-white px-4 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center"
              >
                <HiPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.likes.map((item, i) => (
                <span
                  key={i}
                  className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
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
            <label className="block text-sm font-medium">
              What could have been better?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Too crowded in the metro"
                value={currentHate}
                onChange={(e) => setCurrentHate(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addHate()}
              />
              <button
                onClick={addHate}
                className="bg-rose-500 text-white px-4 rounded-xl hover:bg-rose-600 transition-all flex items-center justify-center"
              >
                <HiPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.hates.map((item, i) => (
                <span
                  key={i}
                  className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
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
            <button
              onClick={prevStep}
              className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-xl"
            >
              <HiArrowLeft />
            </button>
            <button
              onClick={nextStep}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center text-xl"
            >
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-37.5"
            placeholder="Write your story here..."
            value={formData.free_text}
            onChange={(e) =>
              setFormData({ ...formData, free_text: e.target.value })
            }
          />
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-xl"
            >
              <HiArrowLeft />
            </button>
            <button
              disabled={loading}
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
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
    </Card>
  );
};

export default TripEntryForm;
