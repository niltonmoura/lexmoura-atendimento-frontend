import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, CheckCircle, AlertTriangleIcon, XCircleIcon, ExternalLinkIcon, Loader2Icon, SparklesIcon, FolderIcon } from '../components/icons.tsx';
import { isBackendConfigured, verificarConexaoBackend } from '../services/apiService.ts';
import { analyzeTechnicalError } from '../services/geminiService.ts';
import { BACKEND_URL } from '../config.ts';

type CheckStatus = 'pending' | 'success' | 'warning' | 'error';

interface CheckResult {
    id: string;
    title: string;
    status: CheckStatus;
    message: string;
    details?: string;
    action?: React.ReactNode;
    rawError?: string;
}

const StatusIndicator: React.FC<{ status: CheckStatus }> = ({ status }) => {
    const config = {
        pending: { Icon: Loader2Icon, color: 'text-gray-500', animation: 'animate-spin' },
        success: { Icon: CheckCircle, color: 'text-green-500', animation: '' },
        warning: { Icon: AlertTriangleIcon, color: 'text-yellow-500', animation: '' },
        error: { Icon: XCircleIcon, color: 'text-red-500', animation: '' },
    };
    const { Icon, color, animation } = config[status];
    return <Icon className={`w-6 h-6 ${color} ${animation}`} />;
};

const Diagnostico: React.FC = () => {
    const [checks, setChecks] = useState<CheckResult[]>([]);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const runChecks = async () => {
            const results: CheckResult[] = [];

            // 1. Check Backend URL
            const backendUrlCheck: CheckResult = {
                id: 'backendUrl',
                title: 'Configuração da URL do Backend',
                status: 'pending',
                message: 'Verificando se a URL de conexão está presente no arquivo de configuração.',
            };
            setChecks([backendUrlCheck]);
            if (isBackendConfigured()) {
                backendUrlCheck.status = 'success';
                backendUrlCheck.message = 'A URL do backend está configurada no arquivo config.ts.';
                backendUrlCheck.details = `URL: ${BACKEND_URL.substring(0, 60)}...`;
            } else {
                backendUrlCheck.status = 'error';
                backendUrlCheck.message = 'A URL do backend não foi encontrada ou está incorreta.';
                backendUrlCheck.details = 'Edite o arquivo `config.ts` e insira a URL de implantação do seu Google Apps Script na constante `BACKEND_URL`.';
            }
            results.push(backendUrlCheck);
            setChecks([...results]);

            // 2. Check Backend Connection & Drive
            if (backendUrlCheck.status === 'success') {
                const backendConnectionCheck: CheckResult = {
                    id: 'backendConnection',
                    title: 'Conexão com Google Drive e Apps Script',
                    status: 'pending',
                    message: 'Tentando se comunicar com o servidor e verificar acesso ao Drive...',
                };
                results.push(backendConnectionCheck);
                setChecks([...results]);
                const connectionResult = await verificarConexaoBackend();
                if (connectionResult.success) {
                    backendConnectionCheck.status = 'success';
                    backendConnectionCheck.message = 'Conexão Estabelecida! O sistema tem acesso ao seu Google Drive.';
                    backendConnectionCheck.details = "O script respondeu corretamente. Isso indica que ele tem permissão para criar pastas e arquivos no seu Drive conforme configurado.";
                } else {
                    backendConnectionCheck.status = 'error';
                    backendConnectionCheck.message = 'Falha ao conectar com o backend.';
                    backendConnectionCheck.details = `Detalhe do erro: ${connectionResult.error}. Verifique se a implantação do seu Apps Script está ativa e configurada com as permissões corretas (Acesso: "Qualquer pessoa").`;
                    backendConnectionCheck.rawError = connectionResult.error;
                }
                setChecks([...results]);
            }
            
            // 3. Check Gemini API Key
            const geminiKeyCheck: CheckResult = {
                id: 'geminiKey',
                title: 'Configuração da API de IA (Gemini)',
                status: 'pending',
                message: 'Verificando a disponibilidade da chave da API Gemini.',
            };
            results.push(geminiKeyCheck);
            setChecks([...results]);
            if (process.env.API_KEY) {
                geminiKeyCheck.status = 'success';
                geminiKeyCheck.message = 'A chave da API Gemini foi encontrada no ambiente.';
            } else {
                geminiKeyCheck.status = 'warning';
                geminiKeyCheck.message = 'A chave da API Gemini não foi encontrada.';
                geminiKeyCheck.details = 'As funcionalidades de IA (resumo de caso, chatbot, etc.) não funcionarão. A chave é injetada automaticamente pelo ambiente de desenvolvimento.';
            }
            setChecks([...results]);

             setChecks([...results]);
        };

        runChecks();
    }, []);

    const handleAiAnalysis = async () => {
        const errors = checks.filter(c => c.status === 'error' && c.rawError).map(c => `${c.title}: ${c.rawError}`).join('\n');
        
        if (!errors) {
            setAiAnalysis("Não foram encontrados erros críticos para análise.");
            return;
        }

        setIsAnalyzing(true);
        const result = await analyzeTechnicalError(errors, "Diagnóstico do Sistema LexMoura - Falha de Verificação");
        setAiAnalysis(result);
        setIsAnalyzing(false);
    };

    const hasErrors = checks.some(c => c.status === 'error');

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Diagnóstico de Integração
                    </h1>
                    <p className="text-gray-600">
                        Verifique a saúde da conexão com o Google Drive e o Backend.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                {checks.map(check => (
                    <div key={check.id} className="p-4 border rounded-lg flex items-start gap-4">
                        <StatusIndicator status={check.status} />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{check.title}</h3>
                            <p className="text-sm text-gray-600">{check.message}</p>
                            {check.details && <p className="mt-1 text-xs text-gray-500 bg-slate-50 p-2 rounded font-mono break-all">{check.details}</p>}
                            {check.action}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Card Explicativo Drive */}
            <div className="mt-6 bg-blue-50 border border-blue-200 p-6 rounded-lg flex items-start gap-4">
                 <FolderIcon className="w-10 h-10 text-blue-600 flex-shrink-0" />
                 <div>
                     <h3 className="font-bold text-blue-900">Como funciona a Integração com o Drive?</h3>
                     <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                         O sistema não se conecta diretamente ao Drive. Ele envia os dados para o seu <strong>Google Apps Script</strong>, que atua como um "robô" autorizado.
                         É esse robô que cria as pastas e arquivos em seu nome. Se o teste de "Conexão com o Backend" acima deu <strong className="text-green-700">Verde</strong>,
                         então o robô está online e pronto para trabalhar.
                     </p>
                 </div>
            </div>

            {hasErrors && (
                <div className="mt-6 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-3">
                        <SparklesIcon className="w-5 h-5" />
                        Análise Avançada com IA
                    </h3>
                    <p className="text-indigo-700 text-sm mb-4">
                        O sistema detectou falhas. Clique abaixo para que a Inteligência Artificial analise os códigos de erro e sugira a solução exata.
                    </p>
                    
                    {!aiAnalysis ? (
                        <button 
                            onClick={handleAiAnalysis}
                            disabled={isAnalyzing}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2 transition-colors"
                        >
                            {isAnalyzing ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
                            {isAnalyzing ? 'Analisando...' : 'Diagnosticar Problema Agora'}
                        </button>
                    ) : (
                         <div className="bg-white p-4 rounded-lg border border-indigo-100 text-gray-800 text-sm leading-relaxed prose">
                            <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                            <button onClick={() => setAiAnalysis(null)} className="mt-4 text-indigo-600 text-xs font-bold hover:underline">Fazer nova análise</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Diagnostico;