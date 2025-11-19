import React from 'react';

interface FormStepShellProps {
  title: string;
  children: React.ReactNode;
}

const FormStepShell: React.FC<FormStepShellProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormStepShell;
