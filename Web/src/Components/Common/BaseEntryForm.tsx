import React from "react";
import Card from "@/Components/Common/Card";
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
  const { step, nextStep, prevStep } = useSteps(totalSteps);

  return (
    <Card className="max-w-2xl mx-auto relative" padding={"small"}>
      {/* Close Button */}
      <div className="flex justify-end pb-3">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-primary-4 cursor-pointer bg-primary-0 rounded-2xl"
          title="Close Modal"
        >
          <HiX className="text-2xl" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-500"
          style={{ width: `${(step * 100) / totalSteps}%` }}
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
