import { useState } from "react";

export const useSteps = (totalSteps: number, initialStep = 1) => {
  const [step, setStep] = useState(initialStep);

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return { step, nextStep, prevStep };
};
