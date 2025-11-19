import React, { useState, useEffect } from 'react';
import { ShieldIcon, FileTextIcon, CalendarIcon, FolderIcon, BookOpenIcon, ChevronRightIcon, WifiIcon, WifiOffIcon, Loader2Icon } from '../components/icons.tsx';
import { verificarConexaoBackend } from '../services/apiService.ts';

const QuickActionCard: React.FC<{ href: string; icon: React.ElementType; title: string; description: string; primary?: boolean }> = ({ href, icon: Icon, title, description, primary = false }) => (
  <a href={href} className={`block p-4 rounded-lg transition-all hover:shadow-lg ${primary ? "bg-blue-50 border-2 border-blue-500" : "bg-white border"}`}>
    <div className="flex items-center gap-4">
      <div className={`${primary ? "bg-blue-600" : "bg-slate-100"} p-3 rounded-lg`}>
        <Icon className={`w-5 h-5 ${primary ? "text-white" : "text-slate-600"}`} />
      </div>
      <div>
        <h3 className={`font-semibold ${primary ? "text-blue-900" : "text-slate-800"}`}>{title}</h3>
        <p className={`text-sm ${primary ? "text-blue-700" : "text-slate-600"}`}>{description}</p>
      </div>
      <ChevronRightIcon className={`ml-auto w-5 h-5 ${primary ? "text-blue-600" : "text-slate-400"}`} />
    </div>
  </a>
);

const ToolCard: React.FC<{ href: string; icon: React.ElementType; title: string; description: string; }> = ({ href, icon: Icon, title, description }) => (
    <a href={href} className="block bg-white p-6 rounded-lg border hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            <div className="bg-sky-100 p-4 rounded-lg">
                <Icon className="w-8 h-8 text-sky-600" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600">{description}</p>
            </div>
        </div>
    </a>
);


const StatusCard: React.FC = () => {
    const [status, setStatus] = useState<'verificando' | 'online' | 'offline'>('verificando');
    const [errorMessage, setErrorMessage] = useState<string>('Verifique a URL no arquivo config.ts e se o Apps Script foi publicado.');

    useEffect(() => {
        const checkStatus = async () => {
            const result = await verificarConexaoBackend();
            if (result.success) {
                setStatus('online');
            } else {
                setStatus('offline');
                setErrorMessage(result.error || "Falha ao carregar o status do backend.");
            }
        };
        checkStatus();
    }, []);

    const statusConfig = {
        verificando: {
            icon: Loader2Icon,
            title: "Verificando Conexão Segura",
            description: "Validando acesso ao Google Drive do escritório...",
            style: "from-gray-50 to-slate-50 border-gray-300",
            iconStyle: "text-gray-600 animate-spin",
            titleStyle: "text-gray-900",
            descStyle: "text-gray-700",
        },
        online: {
            icon: WifiIcon,
            title: "Sistema LexMoura Conectado",
            description: "Seu ambiente próprio no Google Workspace está ativo.",
            style: "from-green-50 to-emerald-50 border-green-300",
            iconStyle: "text-green-600",
            titleStyle: "text-green-900",
            descStyle: "text-green-700",
        },
        offline: {
            icon: WifiOffIcon,
            title: "Falha na Conexão",
            description: errorMessage,
            style: "from-red-50 to-orange-50 border-red-300",
            iconStyle: "text-red-600",
            titleStyle: "text-red-900",
            descStyle: "text-red-700",
        },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className={`bg-gradient-to-r ${currentStatus.style} border-2 p-6 rounded-lg`}>
            <div className="flex items-center gap-4">
                <currentStatus.icon className={`w-8 h-8 ${currentStatus.iconStyle}`} />
                <div>
                  <h3 className={`font-semibold ${currentStatus.titleStyle}`}>{currentStatus.title}</h3>
                  <p className={`text-sm ${currentStatus.descStyle}`}>{currentStatus.description}</p>
                </div>
            </div>
        </div>
    );
};


const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">LexMoura Advocacia</h1>
        <p className="text-lg text-slate-600">Sistema Próprio de Gestão Jurídica</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard 
                href="#portal-previdenciario"
                icon={ShieldIcon}
                title="Previdenciário"
                description="Nova ficha previdenciária"
                primary
            />
            <QuickActionCard 
                href="#entrevistas"
                icon={FileTextIcon}
                title="Ver Entrevistas"
                description="Acessar fichas de clientes"
            />
             <QuickActionCard 
                href="#visitas"
                icon={CalendarIcon}
                title="Visitas Agendadas"
                description="Controle de visitas"
            />
        </div>
      </div>

      {/* Ferramentas */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ferramentas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolCard 
                href="#gestor-documentos"
                icon={FolderIcon}
                title="Gestor de Documentos & Tags"
                description="Templates e banco de tags unificados"
            />
            <ToolCard 
                href="#observacoes"
                icon={BookOpenIcon}
                title="Observações"
                description="Anotações importantes"
            />
        </div>
      </div>

      {/* Info Card */}
      <StatusCard />
    </div>
  );
};

export default Home;