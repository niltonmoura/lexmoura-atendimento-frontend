import React, { Component, ErrorInfo } from 'react';
import { ShieldIcon, Loader2Icon, WifiOffIcon, AlertTriangleIcon } from './icons.tsx';
import { analyzeTechnicalError } from '../services/geminiService.ts';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  aiAnalysis: string | null;
  isAnalyzing: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, aiAnalysis: null, isAnalyzing: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, aiAnalysis: null, isAnalyzing: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LexMoura ErrorBoundary caught an error:", error, errorInfo);
    this.triggerAIAnalysis(error);
  }

  triggerAIAnalysis = async (error: Error) => {
    this.setState({ isAnalyzing: true });
    try {
        const analysis = await analyzeTechnicalError(error.message || String(error), "Erro fatal capturado pelo ErrorBoundary na interface React.");
        this.setState({ aiAnalysis: analysis });
    } catch (e) {
        this.setState({ aiAnalysis: "Não foi possível conectar à IA para analisar este erro." });
    } finally {
        this.setState({ isAnalyzing: false });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-8 rounded-xl shadow-2xl border border-red-100">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">O sistema encontrou um problema</h1>
                <p className="text-gray-500">O Agente de Recuperação está analisando a falha.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-red-700 mb-6 break-words border border-slate-200">
              {this.state.error?.toString()}
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <ShieldIcon className="w-5 h-5 text-blue-600" />
                    Diagnóstico da IA
                </h3>
                
                <div className="bg-blue-50 p-5 rounded-lg text-gray-700 leading-relaxed border border-blue-100">
                    {this.state.isAnalyzing ? (
                        <div className="flex items-center gap-3 text-blue-700">
                            <Loader2Icon className="w-5 h-5 animate-spin" />
                            Analisando a causa raiz do problema com Gemini...
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none">
                           {this.state.aiAnalysis ? (
                               <div dangerouslySetInnerHTML={{ __html: this.state.aiAnalysis.replace(/\n/g, '<br/>') }} />
                           ) : (
                               "Aguardando análise..."
                           )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Tentar Recarregar o Sistema
              </button>
              <button
                 onClick={() => window.open('https://script.google.com', '_blank')}
                 className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                 Verificar Backend
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;