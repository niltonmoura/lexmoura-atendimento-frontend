import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import PortalPrevidenciario from './pages/PortalPrevidenciario.tsx';
import Entrevistas from './pages/Entrevistas.tsx';
import Visitas from './pages/Visitas.tsx';
import GestorDocumentos from './pages/GestorDocumentos.tsx';
import Observacoes from './pages/Observacoes.tsx';
import Diagnostico from './pages/Diagnostico.tsx';


const routes: { [key: string]: React.ComponentType } = {
  '': Home,
  '#home': Home,
  '#entrevistas': Entrevistas,
  '#visitas': Visitas,
  '#portal-previdenciario': PortalPrevidenciario,
  '#gestor-documentos': GestorDocumentos,
  '#observacoes': Observacoes,
  '#diagnostico': Diagnostico,
};

function App() {
  const [hash, setHash] = useState(window.location.hash || '#home');

  useEffect(() => {
    console.log("LexMoura App Iniciado"); // Log de debug
    const handleHashChange = () => {
      setHash(window.location.hash || '#home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const CurrentPage = routes[hash] || Home;

  return (
    <Layout currentHash={hash}>
      <CurrentPage />
    </Layout>
  );
}

export default App;