import { useState } from "react";
import { useMobile } from "@/hooks/useMobile";
import BaseEntryForm from "@/Components/BaseEntryForm";
//Icons
import { HiArrowRight, HiArrowLeft, HiCheck } from "react-icons/hi";

type entryProps = {
  onClose: () => void;
};

const NewTripEntryForm = (props: entryProps) => {
  const isMobile = useMobile();

  const initialData = {
    Date: "",
    Duration: "",
    Budget: "",
    Location: "",
    Interests: "",
  };
  const { onClose } = props;
  const [formData, setFormData] = useState<typeof initialData>(initialData);

  const handleSubmit = () => {
    console.log("New Trip Plan Data:", formData);
    onClose();
  };

  return (
    <BaseEntryForm onClose={onClose} totalSteps={3}>
      {({ step, nextStep, prevStep }) => (
        <>
          {/* Step 1: Location & Date */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                Plan your next adventure
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Where do you want to go?
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. Iceland"
                    value={formData.Location}
                    onChange={(e) =>
                      setFormData({ ...formData, Location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    When are you thinking?
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.Date}
                    onChange={(e) =>
                      setFormData({ ...formData, Date: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center text-xl"
              >
                <HiArrowRight />
              </button>
            </div>
          )}

          {/* Step 2: Duration & Budget */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                How long and how much?
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. 10 days"
                    value={formData.Duration}
                    onChange={(e) =>
                      setFormData({ ...formData, Duration: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range
                  </label>
                  <select
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                    value={formData.Budget}
                    onChange={(e) =>
                      setFormData({ ...formData, Budget: e.target.value })
                    }
                  >
                    <option value="" className="bg-white dark:bg-slate-800">
                      No preference
                    </option>
                    <option
                      value="Budget"
                      className="bg-white dark:bg-slate-800"
                    >
                      Budget (Minimalist)
                    </option>
                    <option
                      value="Moderate"
                      className="bg-white dark:bg-slate-800"
                    >
                      Moderate (Comfortable)
                    </option>
                    <option
                      value="Luxury"
                      className="bg-white dark:bg-slate-800"
                    >
                      Luxury (Premium)
                    </option>
                  </select>
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

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
                What interests you?
              </h3>
              <p className="text-slate-500 text-sm">
                What are you looking for in this trip? (e.g. Hiking, Museums,
                Food, Relaxing)
              </p>
              <textarea
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-37.5"
                placeholder="Tell us what you'd love to do..."
                value={formData.Interests}
                onChange={(e) =>
                  setFormData({ ...formData, Interests: e.target.value })
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
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <HiCheck className="text-xl" /> Generate Plan
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </BaseEntryForm>
  );
};

export default NewTripEntryForm;
