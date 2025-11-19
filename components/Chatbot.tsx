import React, { useState, useRef, useEffect } from 'react';
import { startChat } from '../services/geminiService.ts';
import { MessageSquareIcon, SendIcon, XIcon, SparklesIcon, UserIcon } from './icons.tsx';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Olá! Sou o assistente jurídico da LexMoura. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chat = useRef(startChat()).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        let fullAiResponse = '';
        const responseStream = await chat.sendMessageStream({ message: input });

        // Adiciona um placeholder para a resposta da IA que será atualizado
        setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);
        
        for await (const chunk of responseStream) {
            fullAiResponse += chunk.text;
            // Atualiza a última mensagem (a resposta da IA)
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { sender: 'ai', text: fullAiResponse };
                return newMessages;
            });
        }
    } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, ocorreu um erro. Tente novamente.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-50"
        aria-label="Abrir chat de ajuda"
      >
        <MessageSquareIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-800">Assistente Jurídico IA</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800"><XIcon className="w-5 h-5"/></button>
      </div>
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center"><SparklesIcon className="w-5 h-5"/></div>}
              <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
               {msg.sender === 'user' && <div className="flex-shrink-0 bg-gray-300 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center"><UserIcon className="w-5 h-5"/></div>}
            </div>
          ))}
           {isLoading && messages[messages.length - 1].sender === 'user' && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center"><SparklesIcon className="w-5 h-5"/></div>
              <div className="max-w-xs px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none border">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua pergunta..."
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
