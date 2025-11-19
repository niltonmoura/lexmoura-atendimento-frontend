import { BACKEND_URL } from '../config.ts';
import { ClientFormData, EntrevistaListItem, VisitaListItem, DocumentoSelecionado, NewVisitaData } from '../types.ts';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// Mensagem de erro padrão para respostas de API sem detalhes.
const GENERIC_ERROR_MESSAGE = "Ocorreu uma falha na comunicação com o backend. A resposta não continha detalhes do erro.";

/**
 * Normaliza a resposta da API para garantir consistência.
 */
const normalizeApiResponse = (response: any): ApiResponse => {
    if (typeof response !== 'object' || response === null) {
        return { success: false, error: 'Resposta inválida do backend: não é um objeto JSON.', data: response };
    }
  
    if (typeof response.success === 'undefined' && typeof response.ok !== 'undefined') {
        response.success = response.ok;
    }

    if (typeof response.success !== 'boolean') {
       response.success = false; 
    }

    return response as ApiResponse;
};

export const isBackendConfigured = (): boolean => {
    return (BACKEND_URL as string) && !(BACKEND_URL as string).startsWith('COLE_AQUI');
}

/**
 * Realiza uma requisição POST para o backend.
 * Usado para enviar dados (criar pastas, salvar formulários).
 */
const postToAction = async (payload: object): Promise<ApiResponse> => {
  if (!isBackendConfigured()) {
    return { success: false, error: "A URL do backend não está configurada." };
  }
  
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8', // Evita preflight OPTIONS CORS
      },
      body: JSON.stringify(payload),
    });

    const resultText = await response.text();

    if (!response.ok) {
        throw new Error(`Erro de Servidor (${response.status}): ${resultText}`);
    }

    try {
        const result = JSON.parse(resultText);
        return normalizeApiResponse(result);
    } catch (parseError) {
        return { 
            success: false, 
            error: `Falha ao processar JSON. Resposta: ${resultText.substring(0, 100)}...`
        };
    }
  } catch (error) {
    console.error('API POST Error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

/**
 * Realiza uma requisição GET para o backend.
 * Usado para listar dados e verificar status.
 * Constrói a URL no formato: BACKEND_URL?action=nome&param=valor
 */
const getAction = async (action: string, params: Record<string, string> = {}): Promise<ApiResponse> => {
    if (!isBackendConfigured()) {
        return { success: false, error: "A URL do backend não está configurada." };
    }

    try {
        // Constrói a Query String (ex: ?action=listar_entrevistas&id=123)
        const url = new URL(BACKEND_URL);
        url.searchParams.append('action', action);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: 'GET',
            // Não enviamos headers complexos no GET para evitar problemas de CORS simples
        });

        const resultText = await response.text();

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        try {
            const result = JSON.parse(resultText);
            return normalizeApiResponse(result);
        } catch (e) {
            return { success: false, error: "Resposta inválida (não é JSON)." };
        }

    } catch (error) {
        console.error('API GET Error:', error);
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
             return { success: false, error: 'Erro de Conexão/CORS. Verifique se o script está publicado como "Qualquer pessoa".' };
        }
        return { success: false, error: msg };
    }
};

// --- FUNÇÕES DE NEGÓCIO ---

export const verificarConexaoBackend = async (): Promise<ApiResponse> => {
    if (!isBackendConfigured()) {
        return { success: false, error: "A URL do backend não está configurada." };
    }

    try {
        // FIX: Fazemos um GET direto na URL base, SEM o parâmetro ?action=ping.
        // Motivo: O backend retorna sucesso na raiz, mas erro se enviarmos uma action desconhecida.
        const url = new URL(BACKEND_URL);
        url.search = ''; // Remove query params para pegar a resposta padrão

        const response = await fetch(url.toString(), { method: 'GET' });
        const resultText = await response.text();

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        try {
            const result = JSON.parse(resultText);
            return normalizeApiResponse(result);
        } catch (e) {
            return { success: false, error: "O backend respondeu, mas não retornou um JSON válido." };
        }

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
             return { success: false, error: 'Erro de Conexão/CORS. Verifique se o script está publicado como "Qualquer pessoa".' };
        }
        return { success: false, error: msg };
    }
};

export const listarEntrevistas = async (): Promise<{ success: boolean; data?: EntrevistaListItem[]; error?: string }> => {
    const response = await getAction('listar_entrevistas');
    if (response.success) {
        return { success: true, data: response.data };
    }
    return { success: false, error: response.error || response.message || GENERIC_ERROR_MESSAGE };
};

export const getEntrevistaDetalhes = async (id: string): Promise<{ success: boolean; data?: ClientFormData; error?: string }> => {
    const response = await getAction('get_entrevista_detalhes', { id });
    if (response.success) {
        return { success: true, data: response.data };
    }
    return { success: false, error: response.error || response.message || GENERIC_ERROR_MESSAGE };
};

export const listarVisitas = async (): Promise<{ success: boolean; data?: VisitaListItem[]; error?: string }> => {
    const response = await getAction('listar_visitas');
    if (response.success) {
        return { success: true, data: response.data };
    }
    return { success: false, error: response.error || response.message || GENERIC_ERROR_MESSAGE };
};

export const cadastrarVisita = async (dados: NewVisitaData): Promise<ApiResponse> => {
    const payload = {
        action: 'cadastrar_visita',
        ...dados
    };
    return postToAction(payload);
};

export const gerarDocumentosIniciais = async (dados: ClientFormData, documentosSelecionados: DocumentoSelecionado[]): Promise<ApiResponse> => {
    const payload = {
        action: 'gerar_documentos_iniciais',
        ...dados,
        documentos: documentosSelecionados.map(doc => ({ id: doc.id, templateId: doc.templateId, label: doc.label })),
    };
    return postToAction(payload);
};