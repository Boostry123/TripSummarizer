import React from "react";
import Card from "@/Components/Common/Card";
import { useMobile } from "@/hooks/useMobile";
import { useSteps } from "@/hooks/useSteps";
import { HiX } from "react-icons/hi";

type BaseEntryFormProps = {
  onClose: () => void;
  totalSteps: number;
  error?: string | null;
  children: (props: {
    step: number;
    nextStep: () => void;
    prevStep: () => void;
  }) => React.ReactNode;
};

const BaseEntryForm = ({
  onClose,
  totalSteps,
  error,
  children,
}: BaseEntryFormProps) => {
  const isMobile = useMobile();
  const { step, nextStep, prevStep } = useSteps(totalSteps);

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
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {children({ step, nextStep, prevStep })}
    </Card>
  );
};

export default BaseEntryForm;
