import React, { useState, useEffect } from 'react';
import { ClientFormData, MembroFamiliar, GeneratedFile, ProgressState } from '../types.ts';
import * as api from '../services/apiService.ts';
import * as gemini from '../services/geminiService.ts';
import { DOCUMENTOS_CONFIG } from '../config.ts';
import { formatCPF, formatCNPJ, formatPhone, formatCEP, formatCurrency, validateCPF, validateCNPJ, validateEmail } from '../utils/validation.ts';

import StepIndicator from './StepIndicator.tsx';
import Step1PersonalData from './steps/Step1PersonalData.tsx';
// FIX: Usando o arquivo FINAL renomeado para forçar limpeza de cache e corrigir erro de carregamento
import Step2ParteContrariaFinal from './steps/Step2ParteContrariaFinal.tsx';
import Step3Questions from './steps/Step3Questions.tsx';
import Step4SummaryAndActions from './steps/Step4SummaryAndActions.tsx';
import Modal from './Modal.tsx';
import { CheckCircle, FolderIcon, ExternalLinkIcon } from './icons.tsx';

const initialFormData: ClientFormData = {
  nome: '', cpf: '', rg: '', dataNascimento: '', estadoCivil: '', profissao: '', email: '', telefone: '',
  nomeMae: '', cpfMae: '', rgMae: '', dataNascimentoMae: '', profissaoMae: '', estadoCivilMae: '',
  cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: 'Fortaleza', uf: 'CE', pontoReferencia: '', temComprovanteEndereco: false,
  temRepresentante: false, maeERepresentante: false,
  repNome: '', repCpf: '', repRg: '', repDataNascimento: '', repGrauParentesco: '', repEstadoCivil: '', repProfissao: '',
  informarComposicaoFamiliar: false,
  composicaoFamiliar: [{ nome: '', grauParentesco: 'Titular', dataNascimento: '', renda: '0,00' }],
  clienteAnalfabeto: false,
  testemunha1Nome: '', testemunha1Cpf: '', testemunha1Rg: '',
  testemunha2Nome: '', testemunha2Cpf: '', testemunha2Rg: '',
  parteContrariaCnpj: '29.979.036/0001-40', parteContrariaNome: 'INSS - Instituto Nacional do Seguro Social',
  parteContrariaRazaoSocial: 'Instituto Nacional do Seguro Social', parteContrariaCep: '60035-150',
  parteContrariaEndereco: 'Rua Pedro Pereira, 383', parteContrariaNumero: '', parteContrariaBairro: 'Centro',
  parteContrariaCidade: 'Fortaleza', parteContrariaUf: 'CE',
  beneficioRequerido: 'BPC/LOAS para idoso', viaProcesso: 'Administrativa', der: '', nb: '', numCadUnico: '',
  rendaFamiliarTotal: '', motivoIndeferimento: '',
  areaJuridica: 'Previdenciário',
  resumoCaso: '',
};

const ClientForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [selectedDocs, setSelectedDocs] = useState<Record<string, boolean>>({});
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ message: '', percentage: 0 });
  const [results, setResults] = useState<GeneratedFile[]>([]);
  const [createdFolderId, setCreatedFolderId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  // Efeitos para sincronização de dados
  useEffect(() => {
    setFormData(prev => {
        const newComposicao = [...prev.composicaoFamiliar];
        if (newComposicao[0]) {
            newComposicao[0] = { ...newComposicao[0], nome: prev.nome, dataNascimento: prev.dataNascimento };
        }
        return { ...prev, composicaoFamiliar: newComposicao };
    });
  }, [formData.nome, formData.dataNascimento]);

  useEffect(() => {
    if (formData.maeERepresentante) {
      setFormData(prev => ({
        ...prev, temRepresentante: true, repNome: prev.nomeMae, repCpf: prev.cpfMae, repRg: prev.rgMae,
        repDataNascimento: prev.dataNascimentoMae, repEstadoCivil: prev.estadoCivilMae,
        repProfissao: prev.profissaoMae, repGrauParentesco: 'Mãe',
      }));
    }
  }, [formData.maeERepresentante, formData.nomeMae, formData.cpfMae, formData.rgMae, formData.dataNascimentoMae, formData.estadoCivilMae, formData.profissaoMae]);

  useEffect(() => {
    if (!formData.temRepresentante) {
      setFormData(prev => ({
        ...prev, maeERepresentante: false, repNome: '', repCpf: '', repRg: '', repDataNascimento: '',
        repGrauParentesco: '', repEstadoCivil: '', repProfissao: '',
      }));
    }
  }, [formData.temRepresentante]);

  useEffect(() => {
    if (formData.informarComposicaoFamiliar) {
        const total = formData.composicaoFamiliar.reduce((sum, membro) => {
            const value = parseFloat(membro.renda.replace(/\./g, '').replace(',', '.')) || 0;
            return sum + value;
        }, 0);
        const formattedTotal = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        setFormData(prev => ({ ...prev, rendaFamiliarTotal: formattedTotal }));
    } else {
        setFormData(prev => ({...prev, rendaFamiliarTotal: ''}));
    }
  }, [formData.composicaoFamiliar, formData.informarComposicaoFamiliar]);


  // Handlers de formulário com Formatação
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    let formattedValue = value;

    // Aplica máscaras
    if (id.includes('cpf') || id.includes('Cpf')) formattedValue = formatCPF(value);
    if (id.includes('cnpj') || id.includes('Cnpj')) formattedValue = formatCNPJ(value);
    if (id.includes('telefone')) formattedValue = formatPhone(value);
    if (id.includes('cep') || id.includes('Cep')) formattedValue = formatCEP(value);
    
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({ ...prev, [id]: checked !== undefined ? checked : formattedValue }));
    
    // Limpa erro do campo ao digitar
    if (fieldErrors[id]) {
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
        });
    }
  };

  const handleMembroFamiliarChange = (index: number, field: keyof MembroFamiliar, value: string) => {
    let formattedValue = value;
    if (field === 'renda') formattedValue = formatCurrency(value);
    
    const updated = [...formData.composicaoFamiliar];
    updated[index] = { ...updated[index], [field]: formattedValue };
    setFormData(prev => ({ ...prev, composicaoFamiliar: updated }));
  };
  
  const addMembroFamiliar = () => {
    setFormData(prev => ({ ...prev, composicaoFamiliar: [...prev.composicaoFamiliar, { nome: '', grauParentesco: '', dataNascimento: '', renda: '' }] }));
  };
  
  const removeMembroFamiliar = (index: number) => {
    if (index === 0) return;
    setFormData(prev => ({ ...prev, composicaoFamiliar: prev.composicaoFamiliar.filter((_, i) => i !== index) }));
  };

  const handleDocSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDocs(prev => ({ ...prev, [e.target.id]: e.target.checked }));
  };
  
  // Validação por Etapa
  const validateStep = (step: number): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      if (step === 1) {
          if (!formData.nome) newErrors.nome = 'Nome é obrigatório.';
          if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório.';
          else if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido.';
          if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
          
          if (formData.email && !validateEmail(formData.email)) newErrors.email = 'E-mail inválido.';
          if (formData.cpfMae && !validateCPF(formData.cpfMae)) newErrors.cpfMae = 'CPF da mãe inválido.';

          if (formData.temRepresentante) {
              if (!formData.repNome) newErrors.repNome = 'Nome do representante é obrigatório.';
              if (!formData.repCpf) newErrors.repCpf = 'CPF do representante é obrigatório.';
              else if (!validateCPF(formData.repCpf)) newErrors.repCpf = 'CPF inválido.';
          }

          if (formData.clienteAnalfabeto) {
              if (!formData.testemunha1Nome) newErrors.testemunha1Nome = 'Nome da testemunha 1 é obrigatório.';
              if (!formData.testemunha1Cpf) newErrors.testemunha1Cpf = 'CPF da testemunha 1 é obrigatório.';
              else if (!validateCPF(formData.testemunha1Cpf)) newErrors.testemunha1Cpf = 'CPF inválido.';
              
              if (!formData.testemunha2Nome) newErrors.testemunha2Nome = 'Nome da testemunha 2 é obrigatório.';
              if (!formData.testemunha2Cpf) newErrors.testemunha2Cpf = 'CPF da testemunha 2 é obrigatório.';
              else if (!validateCPF(formData.testemunha2Cpf)) newErrors.testemunha2Cpf = 'CPF inválido.';
          }
      }

      if (step === 2) {
        if (formData.parteContrariaCnpj && !validateCNPJ(formData.parteContrariaCnpj) && !validateCPF(formData.parteContrariaCnpj)) {
             newErrors.parteContrariaCnpj = 'CPF/CNPJ inválido.';
        }
      }

      if (step === 3) {
         if (!formData.beneficioRequerido) newErrors.beneficioRequerido = 'Informe o benefício.';
      }

      if (Object.keys(newErrors).length > 0) {
          setFieldErrors(newErrors);
          isValid = false;
          const firstErrorId = Object.keys(newErrors)[0];
          const element = document.getElementById(firstErrorId);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
          setFieldErrors({});
      }

      return isValid;
  };

  // Lógica de IA e Submissão
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
        const summary = await gemini.generateCaseSummary(formData);
        setFormData(prev => ({ ...prev, resumoCaso: summary }));
    } catch (err) {
        setError("Falha ao gerar o resumo com IA.");
    } finally {
        setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const docsToGenerate = DOCUMENTOS_CONFIG.filter(doc => selectedDocs[doc.id]);
    if (docsToGenerate.length === 0) {
        setError("Por favor, selecione ao menos um documento para gerar.");
        return;
    }
    
    setIsProcessing(true);
    setError('');
    setCreatedFolderId(null); // Reseta ID da pasta
    setIsResultModalOpen(false);
    setProgress({ message: 'Enviando dados e iniciando processo no backend...', percentage: 25 });
    
    const result = await api.gerarDocumentosIniciais(formData, docsToGenerate);
    
    if (!result.success || !result.data) {
      setError(`Falha no processo: ${result.error || 'Ocorreu um erro desconhecido.'}`);
      setIsProcessing(false);
      return;
    }
    
    // Captura o ID da pasta criada se disponível
    if (result.data.pastas && result.data.pastas.clienteFolderId) {
        setCreatedFolderId(result.data.pastas.clienteFolderId);
    }
    
    setProgress({ message: 'Processando resultados...', percentage: 90 });
    
    const generatedFiles = docsToGenerate.map(doc => {
      const backendResult = result.data.documentos?.[doc.id];
      return {
        name: doc.label,
        url: backendResult?.pdfUrl || null,
        error: backendResult?.error || (backendResult?.pdfUrl ? undefined : 'O backend não retornou uma URL.'),
      };
    });

    setResults(generatedFiles);
    setProgress({ message: 'Processo concluído!', percentage: 100 });
    setIsProcessing(false);
    setIsResultModalOpen(true);
  };
  
  const resetApp = () => {
    setFormData(initialFormData);
    setSelectedDocs({});
    setResults([]);
    setError('');
    setFieldErrors({});
    setCreatedFolderId(null);
    setIsResultModalOpen(false);
    setCurrentStep(1);
  };

  // Navegação
  const handleNext = () => {
      if (validateStep(currentStep)) {
          setCurrentStep(prev => Math.min(prev + 1, 4));
      }
  };
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const goToStep = (step: number) => {
    if (step < currentStep) {
        setCurrentStep(step);
    } else {
        if (validateStep(currentStep)) {
             setCurrentStep(step);
        }
    }
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalData formData={formData} handleChange={handleChange} handleMembroFamiliarChange={handleMembroFamiliarChange} addMembroFamiliar={addMembroFamiliar} removeMembroFamiliar={removeMembroFamiliar} errors={fieldErrors} />;
      case 2:
        // FIX: Apontando para o novo arquivo FINAL
        return <Step2ParteContrariaFinal formData={formData} handleChange={handleChange} errors={fieldErrors} />;
      case 3:
        return <Step3Questions formData={formData} handleChange={handleChange} handleGenerateSummary={handleGenerateSummary} isGeneratingSummary={isGeneratingSummary} errors={fieldErrors} />;
      case 4:
        return <Step4SummaryAndActions selectedDocs={selectedDocs} handleDocSelectionChange={handleDocSelectionChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <StepIndicator currentStep={currentStep} goToStep={goToStep} />
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isProcessing}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Voltar
        </button>
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            Avançar
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait transition-all"
          >
            {isProcessing ? 'Processando...' : 'Finalizar e Gerar Documentos'}
          </button>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={isProcessing} onClose={() => {}} title="Gerando Documentação" hideCloseButton>
          <div className="p-6 text-center">
              <p className="text-lg text-gray-700 mb-4">{progress.message}</p>
              <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${progress.percentage}%` }}></div></div>
              <p className="text-sm font-bold text-blue-600 mt-2">{progress.percentage}%</p>
          </div>
      </Modal>

      <Modal isOpen={isResultModalOpen} onClose={resetApp} title="Processo Concluído">
            <div className="p-6">
                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-800">Integração com Drive realizada!</h3>
                        <p className="text-sm text-green-700">Os documentos foram gerados e salvos na nuvem.</p>
                    </div>
                </div>

                {/* Botão de Integração com Drive */}
                {createdFolderId && (
                    <a 
                        href={`https://drive.google.com/drive/folders/${createdFolderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-6 flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:-translate-y-0.5"
                    >
                        <FolderIcon className="w-6 h-6 mr-2" />
                        Abrir Pasta do Cliente no Drive
                        <ExternalLinkIcon className="w-4 h-4 ml-2 opacity-70" />
                    </a>
                )}

                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4">
                    {results.map((file, index) => (
                    <li key={index} className="p-3 bg-slate-50 border rounded-md">
                        <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 text-sm">{file.name}</span>
                        {file.url ? (
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600">
                            Abrir PDF
                            </a>
                        ) : (
                            <span className="text-sm text-red-500 font-semibold">Falhou</span>
                        )}
                        </div>
                        {file.error && <p className="text-xs text-red-600 mt-1 pl-1">{file.error}</p>}
                    </li>
                    ))}
                </ul>
                <div className="mt-4 text-center border-t pt-4">
                    <button onClick={resetApp} className="text-gray-500 hover:text-gray-800 font-medium">
                        Fechar e Iniciar Novo Atendimento
                    </button>
                </div>
            </div>
        </Modal>

      <Modal isOpen={!!error} onClose={() => setError('')} title="Ocorreu um Erro">
        <div className="p-6"><p className="text-red-600 bg-red-50 p-4 rounded-md">{error}</p></div>
      </Modal>
    </div>
  );
};

export default ClientForm;