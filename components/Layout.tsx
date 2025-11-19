// src/components/Layout.tsx
import React, { useState } from 'react';
import { HomeIcon, FileTextIcon, CalendarIcon, ShieldIcon, FolderIcon, BookOpenIcon, MenuIcon, ShieldCheckIcon } from './icons.tsx';
import Chatbot from './Chatbot.tsx';
import Header from './Header.tsx';

const mainNavItems = [
    { href: '#home', label: 'Início', icon: HomeIcon },
    { href: '#entrevistas', label: 'Entrevistas', icon: FileTextIcon },
    { href: '#visitas', label: 'Visitas', icon: CalendarIcon },
    { href: '#portal-previdenciario', label: 'Previdenciário', icon: ShieldIcon },
];

const toolsNavItems = [
    { href: '#gestor-documentos', label: 'Documentos', icon: FolderIcon },
    { href: '#observacoes', label: 'Observações', icon: BookOpenIcon },
    { href: '#diagnostico', label: 'Diagnóstico', icon: ShieldCheckIcon },
];

type LayoutProps = {
  children: React.ReactNode;
  currentHash: string;
};

const NavLink: React.FC<{ item: any; currentHash: string }> = ({ item, currentHash }) => {
    const isActive = currentHash === item.href;
    return (
      <a
        href={item.href}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span>{item.label}</span>
      </a>
    );
};

const SidebarContent: React.FC<{ currentHash: string }> = ({ currentHash }) => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b">
            <span className="text-2xl font-bold text-gray-800">LexMoura</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">Principal</p>
            {mainNavItems.map(item => <NavLink key={item.href} item={item} currentHash={currentHash} />)}
            
            <p className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase">Ferramentas</p>
            {toolsNavItems.map(item => <NavLink key={item.href} item={item} currentHash={currentHash} />)}
        </nav>
    </div>
);

const Layout: React.FC<LayoutProps> = ({ children, currentHash }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent currentHash={currentHash} />
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default Layout;