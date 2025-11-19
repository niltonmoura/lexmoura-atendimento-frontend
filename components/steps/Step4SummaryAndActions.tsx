import React from 'react';
import { DOCUMENTOS_CONFIG } from '../../config.ts';
import FormStepShell from '../FormStepShell.tsx';

interface Step4Props {
  selectedDocs: Record<string, boolean>;
  handleDocSelectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step4SummaryAndActions: React.FC<Step4Props> = ({ selectedDocs, handleDocSelectionChange }) => {
  return (
    <FormStepShell title="Gerar Documentos">
      <p className="text-sm text-gray-600 mb-4">
        Selecione todos os documentos que você deseja gerar para este cliente. O sistema irá criar uma pasta no Google Drive e salvar os PDFs gerados nela.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {DOCUMENTOS_CONFIG.map(doc => (
          <div key={doc.id} className="relative flex items-start p-3 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center h-5">
              <input
                id={doc.id}
                type="checkbox"
                onChange={handleDocSelectionChange}
                checked={!!selectedDocs[doc.id]}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={doc.id} className="font-medium text-gray-700 cursor-pointer">{doc.label}</label>
            </div>
          </div>
        ))}
      </div>
    </FormStepShell>
  );
};

export default Step4SummaryAndActions;