
import React, { useState, useEffect } from 'react';
import { FileTextIcon, SearchIcon, UserIcon, PhoneIcon, CalendarIcon, ChevronRightIcon, PlusIcon, ExternalLinkIcon, FolderIcon } from '../components/icons.tsx';
import { listarEntrevistas, getEntrevistaDetalhes } from '../services/apiService.ts';
import { EntrevistaListItem, ClientFormData } from '../types.ts';
import Modal from '../components/Modal.tsx';
import EntrevistaDetalhes from '../components/EntrevistaDetalhes.tsx';

const AREA_COLORS: { [key: string]: string } = {
  previdenciário: "bg-green-100 text-green-800",
  trabalhista: "bg-amber-100 text-amber-800",
  cível: "bg-blue-100 text-blue-800",
  consumidor: "bg-yellow-100 text-yellow-800",
  família: "bg-pink-100 text-pink-800",
  default: "bg-gray-100 text-gray-800",
};

const Entrevistas: React.FC = () => {
  const [entrevistas, setEntrevistas] = useState<EntrevistaListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('Todas');
  
  const [selectedEntrevista, setSelectedEntrevista] = useState<ClientFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntrevistas = async () => {
      setIsLoading(true);
      setError(null);
      const result = await listarEntrevistas();
      if (result.success && result.data) {
        setEntrevistas(result.data.sort((a, b) => new Date(b.data_cadastro).getTime() - new Date(a.data_cadastro).getTime()));
      } else {
        setError(result.error || "Falha ao carregar entrevistas.");
      }
      setIsLoading(false);
    };
    fetchEntrevistas();
  }, []);
  
  const handleViewDetails = async (id: string) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalError(null);
    setSelectedEntrevista(null);

    const result = await getEntrevistaDetalhes(id);
    if (result.success && result.data) {
      setSelectedEntrevista(result.data);
    } else {
      setModalError(result.error || "Falha ao carregar detalhes. Verifique se a função 'get_entrevista_detalhes' está implementada no seu backend.");
    }
    setIsModalLoading(false);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEntrevista(null);
    setModalError(null);
  };

  const filteredEntrevistas = entrevistas.filter(e => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = e.nome.toLowerCase().includes(lowerSearch) || e.cpf.replace(/\D/g, '').includes(lowerSearch.replace(/\D/g, ''));
      const matchesArea = filterArea === 'Todas' || e.area_juridica.toLowerCase() === filterArea.toLowerCase();
      return matchesSearch && matchesArea;
  });

  const areas = ['Todas', ...Array.from(new Set(entrevistas.map(e => e.area_juridica)))];

  return (
    <div>
      {/* Header com Botão de Nova Entrevista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileTextIcon className="w-8 h-8 text-blue-600" />
                Entrevistas Realizadas
            </h1>
            <p className="text-slate-500 mt-1">Visualize o histórico ou inicie um novo atendimento.</p>
        </div>
        
        <a 
            href="#portal-previdenciario" 
            className="inline-flex items-center justify-center px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nova Entrevista
        </a>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
            {areas.map(area => (
                <button
                    key={area}
                    onClick={() => setFilterArea(area)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filterArea === area ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    {area}
                </button>
            ))}
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        {isLoading && (
            <div className="text-center py-10">
                <p className="text-gray-600">Carregando entrevistas...</p>
            </div>
        )}
        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700 font-bold">Erro ao carregar:</p>
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        )}
        {!isLoading && !error && filteredEntrevistas.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nenhuma entrevista encontrada.</p>
            </div>
        )}
        {!isLoading && !error && filteredEntrevistas.map(entrevista => (
            <div 
                key={entrevista.id} 
                className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-green-500 hover:shadow-md hover:border-green-600 transition-all"
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => handleViewDetails(entrevista.id)}>
                        <div className="flex items-center gap-3">
                           <h2 className="text-lg font-bold text-gray-800">{entrevista.nome}</h2>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${AREA_COLORS[entrevista.area_juridica.toLowerCase()] || AREA_COLORS.default}`}>
                                {entrevista.area_juridica}
                            </span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-600">
                           <div className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400" /><span>CPF: {entrevista.cpf}</span></div>
                           <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-gray-400" /><span>{entrevista.telefone || 'N/A'}</span></div>
                           <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400" /><span>{new Date(entrevista.data_cadastro).toLocaleDateString('pt-BR')}</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {entrevista.pastaUrl && (
                           <a 
                             href={entrevista.pastaUrl} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                             title="Abrir Pasta no Drive"
                           >
                               <FolderIcon className="w-5 h-5" />
                           </a>
                       )}
                       <button onClick={() => handleViewDetails(entrevista.id)} className="p-2 text-gray-400 hover:text-gray-600">
                           <ChevronRightIcon className="w-6 h-6" />
                       </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Detalhes da Entrevista">
          {isModalLoading && <div className="p-6 text-center">Carregando...</div>}
          {modalError && <div className="p-6 text-center text-red-600 bg-red-50 rounded-b-lg">{modalError}</div>}
          {selectedEntrevista && <EntrevistaDetalhes entrevista={selectedEntrevista} />}
      </Modal>
    </div>
  );
};

export default Entrevistas;
