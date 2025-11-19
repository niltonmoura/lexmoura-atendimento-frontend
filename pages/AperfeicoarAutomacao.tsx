import React, { useState } from 'react';
import { LightbulbIcon, SparklesIcon, Loader2Icon } from '../components/icons.tsx';
import Textarea from '../components/Textarea.tsx';
import { getAutomationSuggestions } from '../services/geminiService.ts';

const AperfeicoarAutomacao: React.FC = () => {
  const [workflow, setWorkflow] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
      if (!workflow.trim()) {
          setError('Por favor, descreva um fluxo de trabalho para ser analisado.');
          return;
      }
      setIsLoading(true);
      setError('');
      setSuggestion('');
      
      try {
          const result = await getAutomationSuggestions(workflow);
          setSuggestion(result);
      } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
          setError(errorMessage);
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-xl shadow-lg">
            <LightbulbIcon className="w-8 h-8 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
                Aperfeiçoar Automação com IA
            </h1>
            <p className="text-slate-500 mt-1">Use a IA para analisar e otimizar seus processos jurídicos.</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Descreva seu Fluxo de Trabalho</h2>
        <p className="text-sm text-gray-600">
          Forneça detalhes sobre um processo atual em seu escritório que você gostaria de melhorar. 
          Por exemplo: "Como fazemos a integração de novos clientes de BPC/LOAS, desde o primeiro contato até a assinatura dos documentos."
        </p>
        <Textarea
            id="workflow-description"
            label="Descrição do Processo"
            value={workflow}
            onChange={(e) => setWorkflow(e.target.value)}
            rows={6}
            placeholder="Digite aqui os detalhes do processo..."
            disabled={isLoading}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button 
          onClick={handleAnalyze} 
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
             <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Analisar e Sugerir Melhorias
            </>
          )}
        </button>
      </div>
      
      {suggestion && (
        <div className="mt-8 bg-slate-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sugestões da IA</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {suggestion}
            </div>
        </div>
      )}

    </div>
  );
};

export default AperfeicoarAutomacao;
