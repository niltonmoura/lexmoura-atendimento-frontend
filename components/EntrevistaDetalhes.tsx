
import React from 'react';
import { ClientFormData } from '../types.ts';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
      {children}
    </div>
  </div>
);

const DetailItem: React.FC<{ label: string; value?: string | number | boolean | null }> = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value;
    return (
        <div className="flex flex-col">
            <span className="font-semibold text-gray-500">{label}</span>
            <span className="text-gray-900">{String(displayValue)}</span>
        </div>
    );
};


const EntrevistaDetalhes: React.FC<{ entrevista: ClientFormData }> = ({ entrevista }) => {
  if (!entrevista) return null;

  return (
    <div className="p-6">
      <DetailSection title="Dados Pessoais do Segurado">
        <DetailItem label="Nome Completo" value={entrevista.nome} />
        <DetailItem label="CPF" value={entrevista.cpf} />
        <DetailItem label="RG" value={entrevista.rg} />
        <DetailItem label="Data de Nascimento" value={entrevista.dataNascimento} />
        <DetailItem label="Estado Civil" value={entrevista.estadoCivil} />
        <DetailItem label="Profissão" value={entrevista.profissao} />
        <DetailItem label="Email" value={entrevista.email} />
        <DetailItem label="Telefone" value={entrevista.telefone} />
      </DetailSection>

      <DetailSection title="Endereço">
        <DetailItem label="CEP" value={entrevista.cep} />
        <DetailItem label="Endereço" value={entrevista.endereco} />
        <DetailItem label="Número" value={entrevista.numero} />
        <DetailItem label="Complemento" value={entrevista.complemento} />
        <DetailItem label="Bairro" value={entrevista.bairro} />
        <DetailItem label="Cidade" value={entrevista.cidade} />
        <DetailItem label="UF" value={entrevista.uf} />
        <DetailItem label="Tem Comprovante?" value={entrevista.temComprovanteEndereco} />
      </DetailSection>

      <DetailSection title="Dados da Ação">
        <DetailItem label="Área Jurídica" value={entrevista.areaJuridica} />
        <DetailItem label="Benefício Requerido" value={entrevista.beneficioRequerido} />
        <DetailItem label="Via do Processo" value={entrevista.viaProcesso} />
        <DetailItem label="DER" value={entrevista.der} />
        <DetailItem label="Nº Benefício (NB)" value={entrevista.nb} />
        <DetailItem label="Nº CadÚnico" value={entrevista.numCadUnico} />
        <DetailItem label="Motivo do Indeferimento" value={entrevista.motivoIndeferimento} />
      </DetailSection>
      
      {entrevista.temRepresentante && (
         <DetailSection title="Representante Legal">
            <DetailItem label="Nome" value={entrevista.repNome} />
            <DetailItem label="CPF" value={entrevista.repCpf} />
            <DetailItem label="Parentesco" value={entrevista.repGrauParentesco} />
         </DetailSection>
      )}

    </div>
  );
};

export default EntrevistaDetalhes;