import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import BaseEntryForm from "@/Components/Common/BaseEntryForm";
import { useGenerateRecommendation } from "@/hooks/useGenerateRecommendation";
import { useRecommendationStore } from "@/store/recommendationStore";
//Icons
import { HiArrowRight, HiArrowLeft, HiCheck } from "react-icons/hi";

type entryProps = {
  onClose: () => void;
};

const NewTripEntryForm = (props: entryProps) => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { mutate } = useGenerateRecommendation();
  const { clearHistory } = useRecommendationStore();

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
    const formattedMessage = `I want to plan a trip to ${formData.Location || "somewhere new"}. 
    ${formData.Date ? `Planned date: ${formData.Date}.` : ""}
    ${formData.Duration ? `Duration: ${formData.Duration}.` : ""}
    ${formData.Budget ? `Budget: ${formData.Budget}.` : ""}
    ${formData.Interests ? `My interests: ${formData.Interests}.` : ""}
    Please generate a tailored recommendation based on these preferences and my past travel history.`;

    clearHistory();

    onClose();
    mutate(formattedMessage);
    navigate("/recommendations");
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
                  <label className="block text-sm font-bold mb-2">
                    Where do you want to go?
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="e.g. Iceland"
                    value={formData.Location}
                    onChange={(e) =>
                      setFormData({ ...formData, Location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">When?</label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    value={formData.Date}
                    onChange={(e) =>
                      setFormData({ ...formData, Date: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full flex justify-center bg-primary-3 rounded p-3 text-primary-1 hover:bg-primary-4 transition-colors cursor-pointer"
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
                  <label className="block text-sm font-bold mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="e.g. 10 days"
                    value={formData.Duration}
                    onChange={(e) =>
                      setFormData({ ...formData, Duration: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Budget Range
                  </label>
                  <select
                    className="w-full bg-transparent border rounded-xl p-4 focus:ring-2 focus:ring-amber-400"
                    value={formData.Budget}
                    onChange={(e) =>
                      setFormData({ ...formData, Budget: e.target.value })
                    }
                  >
                    <option value="" className="bg-primary-2">
                      No preference
                    </option>
                    <option value="Budget" className="bg-primary-2">
                      Budget (Minimalist)
                    </option>
                    <option value="Moderate" className="bg-primary-2">
                      Moderate (Comfortable)
                    </option>
                    <option value="Luxury" className="bg-primary-2">
                      Luxury (Premium)
                    </option>
                  </select>
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
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-all min-h-37.5"
                placeholder="Tell us what you'd love to do..."
                value={formData.Interests}
                onChange={(e) =>
                  setFormData({ ...formData, Interests: e.target.value })
                }
              />
              <div className="flex gap-4">
                <button onClick={prevStep} className="prev-step">
                  <HiArrowLeft />
                </button>
                <button onClick={handleSubmit} className="next-step">
                  <HiCheck className="text-xl" />
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
