import React from 'react';
import { ShieldIcon } from '../components/icons.tsx';
import ClientForm from '../components/ClientForm.tsx';

const PortalPrevidenciario: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
          <ShieldIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Atendimento Previdenciário
          </h1>
          <p className="text-gray-600">
            Ficha de atendimento completa para casos previdenciários.
          </p>
        </div>
      </div>
      
      <ClientForm />
    </>
  );
};

export default PortalPrevidenciario;
