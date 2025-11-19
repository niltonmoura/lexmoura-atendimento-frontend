import { GoogleGenAI, Chat } from "@google/genai";
import { ClientFormData } from '../types.ts';

// Inicialização ULTRA SEGURA
// Evita acessar variáveis globais que podem não existir e crashar o app
let ai: GoogleGenAI | null = null;

try {
    // Tenta ler a chave de forma segura
    let key: string | undefined = undefined;
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        key = process.env.API_KEY;
    }
    
    if (key) {
        ai = new GoogleGenAI({ apiKey: key });
    } else {
        console.warn("Gemini API: Chave não configurada. IA desativada.");
    }
} catch (e) {
    console.error("Gemini API: Erro fatal na inicialização (Ignorado para não travar o app):", e);
    ai = null;
}

function getClientDataAsText(formData: ClientFormData): string {
    return `
      DADOS DO CLIENTE:
      - Nome: ${formData.nome}
      - CPF: ${formData.cpf}
      - Data de Nascimento: ${formData.dataNascimento}
      - Profissão: ${formData.profissao}
      - Endereço: ${formData.endereco}, ${formData.numero}, ${formData.bairro}, ${formData.cidade}-${formData.uf}
      - Telefone: ${formData.telefone}
      - Email: ${formData.email}

      DADOS DA AÇÃO:
      - Área: ${formData.areaJuridica}
      - Benefício Requerido: ${formData.beneficioRequerido}
      - Via do Processo: ${formData.viaProcesso}
      - DER: ${formData.der}
      - Motivo do Indeferimento: ${formData.motivoIndeferimento}

      ${formData.temRepresentante ? `
      REPRESENTANTE:
      - Nome: ${formData.repNome}
      - Parentesco: ${formData.repGrauParentesco}
      ` : ''}

      ${formData.informarComposicaoFamiliar ? `
      COMPOSIÇÃO FAMILIAR:
      - Renda Total: R$ ${formData.rendaFamiliarTotal}
      - Membros: ${formData.composicaoFamiliar.map(m => `${m.nome} (${m.grauParentesco}, Renda: R$ ${m.renda})`).join(', ')}
      ` : ''}
    `.trim();
}

export const generateCaseSummary = async (formData: ClientFormData): Promise<string> => {
  if (!ai) return "Funcionalidade de IA indisponível (Chave de API não configurada).";

  try {
    const clientData = getClientDataAsText(formData);
    const prompt = `
      Você é um advogado especialista em direito previdenciário. Com base nos dados a seguir, elabore um resumo conciso e profissional do caso do cliente, destacando os pontos mais importantes para a análise jurídica inicial. O resumo deve ser em um único parágrafo.

      DADOS:
      ${clientData}

      RESUMO:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Sem resposta da IA.";
  } catch (error) {
    console.error("Error generating case summary:", error);
    return "Não foi possível gerar o resumo. Verifique a conexão e a configuração da API.";
  }
};

export const getAutomationSuggestions = async (workflowDescription: string): Promise<string> => {
    if (!ai) return "Funcionalidade de IA indisponível.";

    try {
        const prompt = `
            Você é um consultor especialista em automação de processos para escritórios de advocacia. Analise a seguinte descrição de um fluxo de trabalho e forneça sugestões detalhadas e práticas para otimizá-lo e automatizá-lo. Estruture sua resposta usando markdown (cabeçalhos, listas, negrito).

            FLUXO DE TRABALHO DESCRITO PELO USUÁRIO:
            "${workflowDescription}"

            SUA ANÁLISE E SUGESTÕES:
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });

        return response.text || "Sem sugestões disponíveis.";
    } catch (error) {
        console.error("Error getting automation suggestions:", error);
        return "Ocorreu um erro ao analisar o fluxo de trabalho. Tente novamente.";
    }
};

export const analyzeTechnicalError = async (errorMsg: string, context: string = ''): Promise<string> => {
    if (!ai) return "A IA não pode analisar o erro pois a chave de API não está configurada. Erro original: " + errorMsg;

    try {
        const prompt = `
            Você é um engenheiro de software sênior responsável pelo suporte técnico do sistema "LexMoura".
            O usuário encontrou um erro técnico. Sua tarefa é analisar a mensagem de erro e fornecer uma explicação clara e uma solução prática.

            ERRO TÉCNICO: "${errorMsg}"
            CONTEXTO: "${context}"

            INSTRUÇÕES:
            1. Explique o que aconteceu em linguagem simples (para um advogado).
            2. Se for um erro de conexão (NetworkError, Failed to fetch), sugira verificar a URL do Backend e as permissões do Google Apps Script.
            3. Se for erro de "blob" ou "script denied", sugira recarregar a página.
            4. Dê passos numerados para resolver.
            
            Seja direto e útil.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Não foi possível gerar uma análise automática.";
    } catch (e) {
        return "Falha ao contatar a IA para diagnóstico.";
    }
}

let chat: Chat | null = null;

export const startChat = (): Chat => {
    if (!ai) {
        throw new Error("API Key não configurada");
    }
    
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Você é um assistente jurídico prestativo para o escritório LexMoura Advocacia. Responda a perguntas sobre procedimentos legais, redação de documentos e como usar este sistema de gestão. Seja conciso e profissional.",
            },
        });
    }
    return chat;
};