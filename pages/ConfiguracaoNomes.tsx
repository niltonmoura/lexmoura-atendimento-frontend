
import React from 'react';
import { SparklesIcon } from '../components/icons.tsx';

const ConfiguracaoNomes: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-purple-600" />
        Configurar Detecção de Nomes
      </h1>
      <p className="text-slate-500 mt-1">Configure o Google Apps Script para detectar nomes de documentos automaticamente.</p>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
             <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-bold">Funcionalidade em desenvolvimento.</span> Esta seção fornecerá guias para aprimorar a integração com o Google Drive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracaoNomes;