import React from 'react';
import { ClientFormData } from '../../types.ts';
import Input from '../Input.tsx';
import Textarea from '../Textarea.tsx';
import { SparklesIcon, Loader2Icon } from '../icons.tsx';
import FormStepShell from '../FormStepShell.tsx';

interface Step3Props {
  formData: ClientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleGenerateSummary: () => void;
  isGeneratingSummary: boolean;
  errors?: Record<string, string>;
}

const Step3Questions: React.FC<Step3Props> = ({
  formData,
  handleChange,
  handleGenerateSummary,
  isGeneratingSummary,
  errors = {}
}) => {
  return (
    <FormStepShell title="Dados da Ação">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Benefício Requerido" id="beneficioRequerido" value={formData.beneficioRequerido} onChange={handleChange} error={errors.beneficioRequerido} />
          <Input label="Via do Processo" id="viaProcesso" value={formData.viaProcesso} onChange={handleChange} />
          <Input label="DER" id="der" type="date" value={formData.der} onChange={handleChange} />
          <Input label="Nº Benefício" id="nb" value={formData.nb} onChange={handleChange} />
          <Input label="Nº CadÚnico" id="numCadUnico" value={formData.numCadUnico} onChange={handleChange} />
          <Input label="Renda Familiar Total" id="rendaFamiliarTotal" value={formData.rendaFamiliarTotal} onChange={handleChange} readOnly={formData.informarComposicaoFamiliar} />
       </div>
       <div className="mt-4">
          <Textarea label="Motivo do Indeferimento" id="motivoIndeferimento" value={formData.motivoIndeferimento} onChange={handleChange} />
       </div>
       <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
              <label htmlFor="resumoCaso" className="block text-sm font-medium text-gray-700">Resumo do Caso</label>
              <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 disabled:opacity-70 disabled:cursor-wait"
              >
                  {isGeneratingSummary ? (
                      <>
                          <Loader2Icon className="w-3 h-3 animate-spin"/>
                          Gerando...
                      </>
                  ) : (
                      <>
                          <SparklesIcon className="w-3 h-3"/>
                          Gerar com IA
                      </>
                  )}
              </button>
          </div>
          <Textarea id="resumoCaso" value={formData.resumoCaso || ''} onChange={handleChange} rows={5}/>
       </div>
    </FormStepShell>
  );
};

export default Step3Questions;