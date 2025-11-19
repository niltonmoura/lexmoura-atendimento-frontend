import React from 'react';
import { ClientFormData } from '../../types.ts';
import Input from '../Input.tsx';
import FormStepShell from '../FormStepShell.tsx';

interface Step2Props {
  formData: ClientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
}

const Step2ParteContrariaFinal: React.FC<Step2Props> = ({ formData, handleChange, errors = {} }) => {
  return (
    <FormStepShell title="Parte Contrária (INSS/Empresa)">
      {/* Bloco 1 – Dados da Instituição/Empresa */}
      <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          Dados da Instituição/Empresa
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CNPJ/CPF"
            id="parteContrariaCnpj"
            value={formData.parteContrariaCnpj}
            onChange={handleChange}
            error={errors.parteContrariaCnpj}
            maxLength={18}
          />

          <Input
            label="Nome Fantasia"
            id="parteContrariaNome"
            value={formData.parteContrariaNome}
            onChange={handleChange}
            error={errors.parteContrariaNome}
          />

          <Input
            label="Razão Social"
            id="parteContrariaRazaoSocial"
            value={formData.parteContrariaRazaoSocial}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Bloco 2 – Endereço da Parte Contrária */}
      <div className="p-4 bg-slate-50 border rounded-lg space-y-3 mt-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Endereço da Parte Contrária
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            id="parteContrariaCep"
            value={formData.parteContrariaCep}
            onChange={handleChange}
            maxLength={9}
          />

          <Input
            label="Endereço"
            id="parteContrariaEndereco"
            value={formData.parteContrariaEndereco}
            onChange={handleChange}
            className="md:col-span-2"
          />

          <Input
            label="Número"
            id="parteContrariaNumero"
            value={formData.parteContrariaNumero}
            onChange={handleChange}
          />

          <Input
            label="Bairro"
            id="parteContrariaBairro"
            value={formData.parteContrariaBairro}
            onChange={handleChange}
          />

          <Input
            label="Cidade"
            id="parteContrariaCidade"
            value={formData.parteContrariaCidade}
            onChange={handleChange}
          />

          <Input
            label="UF"
            id="parteContrariaUf"
            value={formData.parteContrariaUf}
            onChange={handleChange}
            maxLength={2}
          />
        </div>
      </div>
    </FormStepShell>
  );
};

export default Step2ParteContrariaFinal;