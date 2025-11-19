
import React from 'react';
import { FolderIcon, FileTextIcon, ShieldCheckIcon, ExternalLinkIcon } from '../components/icons.tsx';
import { DOCUMENTOS_CONFIG, TEMPLATE_IDS } from '../config.ts';

const GestorDocumentos: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FolderIcon className="w-8 h-8 text-blue-600" />
                Gestor de Documentos & Tags
            </h1>
            <p className="text-slate-500 mt-1">Visualize os modelos configurados e seus IDs de integração com o Google Drive.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-sm text-blue-800">
            <span className="font-bold">Total de Modelos:</span> {DOCUMENTOS_CONFIG.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Lista de Documentos */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-gray-500" />
                Modelos Ativos
            </h2>
            
            <div className="grid gap-4">
                {DOCUMENTOS_CONFIG.map((doc) => (
                    <div key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm md:text-base">{doc.label}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                                    ID Config: {doc.id}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${doc.templateId && doc.templateId !== 'SUBSTITUA_PELO_SEU_ID_REAL_AQUI' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {doc.templateId && doc.templateId !== 'SUBSTITUA_PELO_SEU_ID_REAL_AQUI' ? 'Configurado' : 'Pendente'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                            <span className="truncate max-w-[250px] md:max-w-md" title={doc.templateId}>
                                Drive ID: {doc.templateId || 'Não definido'}
                            </span>
                            {doc.templateId && (
                                <a 
                                    href={`https://docs.google.com/document/d/${doc.templateId}/edit`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Abrir Modelo <ExternalLinkIcon className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Coluna Lateral: Tags Disponíveis */}
        <div className="space-y-6">
             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
                Banco de Tags
            </h2>
            <div className="bg-slate-800 text-slate-200 p-5 rounded-xl shadow-lg text-sm leading-relaxed font-mono overflow-hidden">
                <p className="text-slate-400 mb-4 text-xs uppercase tracking-wider font-bold">Variáveis para uso no Docs</p>
                <ul className="space-y-2">
                    <li><span className="text-yellow-400">[[NOME_CLIENTE]]</span> - Nome completo</li>
                    <li><span className="text-yellow-400">[[CPF]]</span> - CPF do cliente</li>
                    <li><span className="text-yellow-400">[[RG]]</span> - RG do cliente</li>
                    <li><span className="text-yellow-400">[[ENDERECO_COMPLETO]]</span> - Rua, nº, bairro...</li>
                    <li><span className="text-yellow-400">[[PROFISSAO]]</span> - Profissão</li>
                    <li><span className="text-yellow-400">[[ESTADO_CIVIL]]</span> - Estado Civil</li>
                    <div className="border-t border-slate-600 my-2"></div>
                    <li><span className="text-green-400">[[REP_NOME]]</span> - Nome Representante</li>
                    <li><span className="text-green-400">[[REP_CPF]]</span> - CPF Representante</li>
                    <div className="border-t border-slate-600 my-2"></div>
                    <li><span className="text-blue-400">[[REU_NOME]]</span> - INSS / Empresa</li>
                    <li><span className="text-blue-400">[[REU_CNPJ]]</span> - CNPJ Réu</li>
                    <li><span className="text-blue-400">[[DATA_ATUAL]]</span> - DD/MM/AAAA</li>
                    <li><span className="text-blue-400">[[CIDADE_DATA]]</span> - Local e Data extenso</li>
                </ul>
                <p className="mt-6 text-xs text-slate-500 italic">
                    Copie estas tags e cole nos seus modelos do Google Docs para preenchimento automático.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GestorDocumentos;
