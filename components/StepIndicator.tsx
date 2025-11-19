import React from 'react';
import { UserIcon, FileTextIcon, BriefcaseIcon, CheckCircle } from './icons.tsx';

const steps = [
  { id: 1, name: 'Dados Pessoais', icon: UserIcon },
  { id: 2, name: 'Parte Contrária', icon: BriefcaseIcon },
  { id: 3, name: 'Dados da Ação', icon: FileTextIcon },
  { id: 4, name: 'Gerar Documentos', icon: CheckCircle },
];

interface StepIndicatorProps {
  currentStep: number;
  goToStep: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, goToStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isCompleted = currentStep > stepIndex;
          const isCurrent = currentStep === stepIndex;

          return (
            <li key={step.name} className="md:flex-1">
              <button
                onClick={() => isCompleted && goToStep(stepIndex)}
                disabled={!isCompleted && !isCurrent}
                className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                  isCurrent
                    ? 'border-blue-600'
                    : isCompleted
                    ? 'border-green-600 hover:border-green-800'
                    : 'border-gray-200 group-hover:border-gray-300'
                }`}
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-green-600 group-hover:text-green-800'
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                >
                  Etapa {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;
