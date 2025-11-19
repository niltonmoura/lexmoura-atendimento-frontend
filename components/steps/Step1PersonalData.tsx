import React from 'react';
import { ClientFormData, MembroFamiliar } from '../../types.ts';
import Input from '../Input.tsx';
import { PlusIcon, XIcon } from '../icons.tsx';
import FormStepShell from '../FormStepShell.tsx';

interface Step1Props {
  formData: ClientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMembroFamiliarChange: (index: number, field: keyof MembroFamiliar, value: string) => void;
  addMembroFamiliar: () => void;
  removeMembroFamiliar: (index: number) => void;
  errors: Record<string, string>; // Recebe erros de validação
}

const Step1PersonalData: React.FC<Step1Props> = ({
  formData,
  handleChange,
  handleMembroFamiliarChange,
  addMembroFamiliar,
  removeMembroFamiliar,
  errors
}) => {
  return (
    <FormStepShell title="Qualificação do Segurado e Família">
      {/* Qualificação do Segurado */}
      <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Dados do Segurado(a)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Nome Completo" id="nome" value={formData.nome} onChange={handleChange} required error={errors.nome} />
          <Input label="CPF" id="cpf" value={formData.cpf} onChange={handleChange} required error={errors.cpf} placeholder="000.000.000-00" maxLength={14} />
          <Input label="RG" id="rg" value={formData.rg} onChange={handleChange} />
          <Input label="Data de Nascimento" id="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} required error={errors.dataNascimento} />
          <Input label="Estado Civil" id="estadoCivil" value={formData.estadoCivil} onChange={handleChange} />
          <Input label="Profissão" id="profissao" value={formData.profissao} onChange={handleChange} />
          <Input label="E-mail" id="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input label="Telefone/WhatsApp" id="telefone" type="tel" value={formData.telefone} onChange={handleChange} maxLength={15} placeholder="(00) 00000-0000" />
        </div>
      </div>
      
       {/* Dados da Mãe */}
       <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Dados da Mãe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Nome da Mãe" id="nomeMae" value={formData.nomeMae} onChange={handleChange} />
            <Input label="CPF da Mãe" id="cpfMae" value={formData.cpfMae} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} error={errors.cpfMae} />
            <Input label="RG da Mãe" id="rgMae" value={formData.rgMae} onChange={handleChange} />
            <Input label="Data de Nascimento da Mãe" id="dataNascimentoMae" type="date" value={formData.dataNascimentoMae} onChange={handleChange} />
            <Input label="Profissão da Mãe" id="profissaoMae" value={formData.profissaoMae} onChange={handleChange} />
            <Input label="Estado Civil da Mãe" id="estadoCivilMae" value={formData.estadoCivilMae} onChange={handleChange} />
        </div>
      </div>

      {/* Endereço */}
      <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Endereço do Segurado(a)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="CEP" id="cep" value={formData.cep} onChange={handleChange} maxLength={9} placeholder="00000-000" />
            <Input label="Endereço" id="endereco" value={formData.endereco} className="md:col-span-2" error={errors.endereco} />
            <Input label="Número" id="numero" value={formData.numero} onChange={handleChange} error={errors.numero} />
            <Input label="Complemento" id="complemento" value={formData.complemento} onChange={handleChange} />
            <Input label="Bairro" id="bairro" value={formData.bairro} onChange={handleChange} error={errors.bairro} />
            <Input label="Cidade" id="cidade" value={formData.cidade} onChange={handleChange} error={errors.cidade} />
            <Input label="UF" id="uf" value={formData.uf} onChange={handleChange} maxLength={2} error={errors.uf} />
            <div className="flex items-center gap-2 mt-auto">
                <input type="checkbox" id="temComprovanteEndereco" checked={formData.temComprovanteEndereco} onChange={handleChange} className="h-4 w-4" />
                <label htmlFor="temComprovanteEndereco">Tem comprovante de endereço</label>
            </div>
        </div>
      </div>

       {/* Representação e Composição Familiar */}
      <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Representação e Família</h3>
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2">
                  <input type="checkbox" id="temRepresentante" checked={formData.temRepresentante} onChange={handleChange} className="h-4 w-4" />
                  <label htmlFor="temRepresentante">Cliente é representado?</label>
               </div>
               <div className="flex items-center gap-2">
                  <input type="checkbox" id="maeERepresentante" checked={formData.maeERepresentante} onChange={handleChange} className="h-4 w-4" disabled={!formData.temRepresentante} />
                  <label htmlFor="maeERepresentante">A mãe é a representante legal</label>
               </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="informarComposicaoFamiliar" checked={formData.informarComposicaoFamiliar} onChange={handleChange} className="h-4 w-4" />
                  <label htmlFor="informarComposicaoFamiliar">Informar composição familiar?</label>
               </div>
            </div>
            
            {formData.temRepresentante && (
                <div className="p-4 bg-white border rounded-lg space-y-3">
                    <h4 className="font-semibold">Dados do Representante</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input label="Nome do Representante" id="repNome" value={formData.repNome} onChange={handleChange} disabled={formData.maeERepresentante} required error={errors.repNome} />
                        <Input label="CPF do Representante" id="repCpf" value={formData.repCpf} onChange={handleChange} disabled={formData.maeERepresentante} required maxLength={14} placeholder="000.000.000-00" error={errors.repCpf} />
                        <Input label="RG do Representante" id="repRg" value={formData.repRg} onChange={handleChange} disabled={formData.maeERepresentante} />
                        <Input label="Data de Nascimento" id="repDataNascimento" type="date" value={formData.repDataNascimento} onChange={handleChange} disabled={formData.maeERepresentante} />
                        <Input label="Grau de Parentesco" id="repGrauParentesco" value={formData.repGrauParentesco} onChange={handleChange} disabled={formData.maeERepresentante} />
                        <Input label="Estado Civil" id="repEstadoCivil" value={formData.repEstadoCivil} onChange={handleChange} disabled={formData.maeERepresentante} />
                        <Input label="Profissão" id="repProfissao" value={formData.repProfissao} onChange={handleChange} disabled={formData.maeERepresentante} />
                    </div>
                </div>
            )}

            {formData.informarComposicaoFamiliar && (
                <div className="p-4 bg-white border rounded-lg space-y-3">
                    <h4 className="font-semibold">Membros da Família</h4>
                    {formData.composicaoFamiliar.map((membro, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-2 border-b">
                            <Input label="Nome Completo" id={`membro-nome-${index}`} value={membro.nome} onChange={e => handleMembroFamiliarChange(index, 'nome', e.target.value)} readOnly={index === 0} />
                            <Input label="Grau Parentesco" id={`membro-grau-${index}`} value={membro.grauParentesco} onChange={e => handleMembroFamiliarChange(index, 'grauParentesco', e.target.value)} readOnly={index === 0} />
                            <Input label="Nascimento" id={`membro-nasc-${index}`} type="date" value={membro.dataNascimento} onChange={e => handleMembroFamiliarChange(index, 'dataNascimento', e.target.value)} readOnly={index === 0} />
                            <div className="flex items-center gap-2">
                                <Input label="Renda (R$)" id={`membro-renda-${index}`} value={membro.renda} onChange={e => handleMembroFamiliarChange(index, 'renda', e.target.value)} />
                                {index > 0 && (
                                    <button type="button" onClick={() => removeMembroFamiliar(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full h-10 w-10 mb-1">
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addMembroFamiliar} className="mt-2 text-sm text-blue-600 font-semibold flex items-center gap-1"><PlusIcon className="w-4 h-4"/> Adicionar Membro</button>
                </div>
            )}
        </div>
      </div>
      
      {/* Casos Específicos */}
      <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Casos Específicos</h3>
        <div className="flex items-center gap-2">
            <input type="checkbox" id="clienteAnalfabeto" checked={formData.clienteAnalfabeto} onChange={handleChange} className="h-4 w-4" />
            <label htmlFor="clienteAnalfabeto">Cliente é analfabeto/não assina (requer testemunhas)</label>
        </div>

        {formData.clienteAnalfabeto && (
            <div className="p-4 bg-white border rounded-lg mt-4 space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Testemunha 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Nome da Testemunha 1" id="testemunha1Nome" value={formData.testemunha1Nome} onChange={handleChange} required={formData.clienteAnalfabeto} error={errors.testemunha1Nome} />
                        <Input label="CPF da Testemunha 1" id="testemunha1Cpf" value={formData.testemunha1Cpf} onChange={handleChange} required={formData.clienteAnalfabeto} placeholder="000.000.000-00" maxLength={14} error={errors.testemunha1Cpf} />
                        <Input label="RG da Testemunha 1" id="testemunha1Rg" value={formData.testemunha1Rg} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Testemunha 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Nome da Testemunha 2" id="testemunha2Nome" value={formData.testemunha2Nome} onChange={handleChange} required={formData.clienteAnalfabeto} error={errors.testemunha2Nome} />
                        <Input label="CPF da Testemunha 2" id="testemunha2Cpf" value={formData.testemunha2Cpf} onChange={handleChange} required={formData.clienteAnalfabeto} placeholder="000.000.000-00" maxLength={14} error={errors.testemunha2Cpf} />
                        <Input label="RG da Testemunha 2" id="testemunha2Rg" value={formData.testemunha2Rg} onChange={handleChange} />
                    </div>
                </div>
            </div>
        )}
      </div>

    </FormStepShell>
  );
};

export default Step1PersonalData;