import React from 'react';

interface FrameGuardProps {
  children: React.ReactNode;
}

const FrameGuard: React.FC<FrameGuardProps> = ({ children }) => {
  // A lógica de bloqueio foi removida para permitir acesso direto ao sistema.
  return <>{children}</>;
};

export default FrameGuard;