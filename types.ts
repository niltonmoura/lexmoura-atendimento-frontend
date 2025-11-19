
// Tipos base

export interface MembroFamiliar {
  nome: string;
  grauParentesco: string;
  dataNascimento: string;
  renda: string;
}

export interface DocumentoSelecionado {
  id: string;
  label: string;
  descricao?: string;
  templateId?: string;
}

export interface GeneratedFile {
  name: string;
  url: string | null;
  error?: string;
}

export interface ProgressState {
  message: string;
  percentage: number;
}

export interface EntrevistaListItem {
  id: string;
  nome: string;
  cpf: string;
  data_cadastro: string;
  area_juridica: string;
  telefone?: string;
  pastaUrl?: string; // Link direto para o Google Drive
}

export interface VisitaListItem {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  telefone: string;
  data: string;
  hora: string;
  status: 'agendada' | 'concluida' | 'não concluida';
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface NewVisitaData {
  nome: string;
  endereco: string;
  numero?: string;
  bairro: string;
  telefone: string;
  data: string;
  hora: string;
  observacoes?: string;
  anexos?: Attachment[];
}

// Tipo principal do formulário do cliente

export interface ClientFormData {
  // 👇 Index genérico para não travar se surgir campo novo
  [key: string]: any;

  // 🔹 Etapa 1: Dados do Cliente (seção específica)
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  estadoCivil: string;
  profissao: string;
  email: string;
  telefone: string;

  // 🔹 Dados da Mãe
  nomeMae: string;
  cpfMae: string;
  rgMae: string;
  dataNascimentoMae: string;
  profissaoMae: string;
  estadoCivilMae: string;

  // 🔹 Endereço
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  pontoReferencia: string;
  temComprovanteEndereco: boolean;

  // 🔹 Representante
  temRepresentante: boolean;
  maeERepresentante: boolean;
  repNome: string;
  repCpf: string;
  repRg: string;
  repDataNascimento: string;
  repGrauParentesco: string;
  repEstadoCivil: string;
  repProfissao: string;

  // 🔹 Composição Familiar
  informarComposicaoFamiliar: boolean;
  composicaoFamiliar: MembroFamiliar[];

  // 🔹 Testemunhas (para analfabeto)
  clienteAnalfabeto: boolean;
  testemunha1Nome: string;
  testemunha1Cpf: string;
  testemunha1Rg: string;
  testemunha2Nome: string;
  testemunha2Cpf: string;
  testemunha2Rg: string;

  // 🔹 Etapa 2: Parte Contrária
  parteContrariaCnpj: string;
  parteContrariaNome: string;
  parteContrariaRazaoSocial: string;
  parteContrariaCep: string;
  parteContrariaEndereco: string;
  parteContrariaNumero: string;
  parteContrariaBairro: string;
  parteContrariaCidade: string;
  parteContrariaUf: string;

  // 🔹 Etapa 3: Dados da Ação / Benefício
  beneficioRequerido: string;
  viaProcesso: string; // 'Administrativa', 'Judicial' etc.
  der: string;         // Data de Entrada do Requerimento
  nb: string;          // Número do Benefício
  numCadUnico: string;
  rendaFamiliarTotal: string;
  motivoIndeferimento: string;

  // 🔹 Outros
  areaJuridica: string; // 'Previdenciário' | 'Trabalhista' | 'Outra';
  resumoCaso: string;   // Resumo gerado pela IA ou manual
}
