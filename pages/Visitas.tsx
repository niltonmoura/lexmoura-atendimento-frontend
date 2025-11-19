import React, { useState, useEffect } from 'react';
import { CalendarIcon, PlusIcon, NavigationIcon, MoreVerticalIcon, Loader2Icon, PaperclipIcon, XIcon } from '../components/icons.tsx';
import { listarVisitas, cadastrarVisita } from '../services/apiService.ts';
import { VisitaListItem, NewVisitaData, Attachment } from '../types.ts';
import Modal from '../components/Modal.tsx';
import Input from '../components/Input.tsx';
import { formatPhone } from '../utils/validation.ts';

const initialFormState: NewVisitaData = {
    nome: '',
    endereco: '',
    numero: '',
    bairro: '',
    telefone: '',
    data: '',
    hora: '',
    observacoes: '',
    anexos: []
};

const Visitas: React.FC = () => {
    const [visitas, setVisitas] = useState<VisitaListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado do Modal de Nova Visita
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newVisita, setNewVisita] = useState<NewVisitaData>(initialFormState);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchVisitas = async () => {
        setIsLoading(true);
        setError(null);
        const result = await listarVisitas();
        if (result.success && result.data) {
            setVisitas(result.data);
        } else {
            setError(result.error || "Falha ao carregar visitas. Verifique se a aba 'Visitas' existe na sua planilha.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchVisitas();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        let formattedValue = value;
        if (id === 'telefone') formattedValue = formatPhone(value);
        
        setNewVisita(prev => ({ ...prev, [id]: formattedValue }));
    };

    // Função para converter arquivo para Base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove o prefixo "data:image/png;base64," para enviar apenas o conteúdo
                const base64Content = result.split(',')[1]; 
                resolve(base64Content);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Validação de tamanho (ex: máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setFormError("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
                return;
            }
            
            try {
                const base64Data = await convertFileToBase64(file);
                const newAttachment: Attachment = {
                    name: file.name,
                    mimeType: file.type,
                    data: base64Data
                };

                setNewVisita(prev => ({
                    ...prev,
                    anexos: [...(prev.anexos || []), newAttachment]
                }));
                setFormError(null);
            } catch (err) {
                console.error("Erro ao processar arquivo:", err);
                setFormError("Falha ao anexar arquivo. Tente novamente.");
            }
            
            // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
            e.target.value = '';
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setNewVisita(prev => ({
            ...prev,
            anexos: prev.anexos?.filter((_, i) => i !== index) || []
        }));
    };

    const handleSubmitVisita = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVisita.nome || !newVisita.endereco || !newVisita.data) {
            setFormError("Por favor, preencha os campos obrigatórios (Nome, Endereço, Data).");
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        const result = await cadastrarVisita(newVisita);

        if (result.success) {
            setNewVisita(initialFormState);
            setIsModalOpen(false);
            fetchVisitas(); // Recarrega a lista
        } else {
            setFormError(result.error || "Erro ao agendar visita.");
        }
        setIsSubmitting(false);
    };

    const stats = {
        agendadas: visitas.filter(v => v.status === 'agendada').length,
        concluidas: visitas.filter(v => v.status === 'concluida').length,
        naoConcluidas: visitas.filter(v => v.status === 'não concluida').length,
    };

    const visitasPorBairro = visitas.reduce((acc, visita) => {
        const bairro = visita.bairro || 'Sem bairro definido';
        if (!acc[bairro]) acc[bairro] = [];
        acc[bairro].push(visita);
        return acc;
    }, {} as Record<string, VisitaListItem[]>);

    const bairros = Object.keys(visitasPorBairro);

  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8 text-blue-600" />
                    Controle de Visitas
                </h1>
                <p className="text-slate-500 mt-1">Organize suas visitas semanais com rotas inteligentes.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center">
                    <NavigationIcon className="w-4 h-4 inline mr-2"/> Gerar Rota
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    <PlusIcon className="w-4 h-4 inline mr-2"/> Nova Visita
                </button>
            </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <p className="text-2xl font-bold text-blue-700">{stats.agendadas}</p>
                <p className="text-sm text-blue-600">Agendadas</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <p className="text-2xl font-bold text-green-700">{stats.concluidas}</p>
                <p className="text-sm text-green-600">Concluídas</p>
            </div>
             <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <p className="text-2xl font-bold text-red-700">{stats.naoConcluidas}</p>
                <p className="text-sm text-red-600">Não Concluídas</p>
            </div>
             <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                <p className="text-2xl font-bold text-purple-700">{bairros.length}</p>
                <p className="text-sm text-purple-600">Bairros</p>
            </div>
        </div>

        <div className="mt-6 space-y-6">
            {isLoading && (
                <div className="flex justify-center py-10">
                    <Loader2Icon className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            )}
            {error && <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}
            {!isLoading && !error && bairros.length === 0 && (
                <div className="text-center text-gray-500 bg-white p-12 rounded-lg border border-dashed">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>Nenhuma visita agendada.</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-2 text-blue-600 hover:underline">Agendar a primeira</button>
                </div>
            )}

            {bairros.map(bairro => (
                <div key={bairro}>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2 px-1">{bairro} ({visitasPorBairro[bairro].length})</h2>
                    <div className="space-y-3">
                    {visitasPorBairro[bairro].map(visita => (
                        <div key={visita.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${visita.status === 'agendada' ? 'border-blue-500' : visita.status === 'concluida' ? 'border-green-500 opacity-70' : 'border-red-500 opacity-70'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className={`font-bold text-lg ${visita.status !== 'agendada' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{visita.nome}</p>
                                    <p className="text-sm text-gray-500">{visita.endereco}</p>
                                    <p className="text-sm text-gray-500">{visita.telefone}</p>
                                    <p className="text-sm font-semibold text-gray-700 mt-1">{new Date(visita.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {visita.hora}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                     {visita.status === 'agendada' && <button className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full hover:bg-green-200 transition-colors">Entrevista</button>}
                                     <button className="p-1 hover:bg-gray-100 rounded-full"><MoreVerticalIcon className="w-5 h-5 text-gray-500"/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Modal de Cadastro de Nova Visita */}
        <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Agendar Nova Visita"
        >
            <form onSubmit={handleSubmitVisita} className="p-6 space-y-4">
                <Input label="Nome do Cliente" id="nome" value={newVisita.nome} onChange={handleInputChange} required placeholder="Ex: Maria da Silva" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Input label="Endereço (Rua)" id="endereco" value={newVisita.endereco} onChange={handleInputChange} required placeholder="Rua das Flores" />
                    </div>
                    <Input label="Número" id="numero" value={newVisita.numero} onChange={handleInputChange} placeholder="123" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Bairro" id="bairro" value={newVisita.bairro} onChange={handleInputChange} required placeholder="Centro" />
                    <Input label="Telefone" id="telefone" value={newVisita.telefone} onChange={handleInputChange} placeholder="(85) 90000-0000" maxLength={15} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Data da Visita" id="data" type="date" value={newVisita.data} onChange={handleInputChange} required />
                    <Input label="Hora" id="hora" type="time" value={newVisita.hora} onChange={handleInputChange} />
                </div>

                <div>
                    <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea 
                        id="observacoes" 
                        value={newVisita.observacoes} 
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ponto de referência ou detalhes adicionais..."
                    />
                </div>

                {/* Seção de Anexos */}
                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anexos (Fotos/Documentos)</label>
                    <div className="flex flex-wrap gap-2 items-center">
                         {newVisita.anexos && newVisita.anexos.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                <button 
                                    type="button"
                                    onClick={() => handleRemoveAttachment(index)}
                                    className="hover:text-red-600"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm border border-gray-300 transition-colors">
                            <PaperclipIcon className="w-4 h-4" />
                            Anexar
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={handleFileSelect}
                                accept="image/*,.pdf"
                            />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Máx: 5MB por arquivo. Suporta Imagens e PDF.</p>
                </div>

                {formError && <div className="text-red-600 bg-red-50 p-3 rounded text-sm">{formError}</div>}

                <div className="pt-4 flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                    >
                        {isSubmitting ? <Loader2Icon className="w-5 h-5 animate-spin" /> : 'Agendar Visita'}
                    </button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default Visitas;