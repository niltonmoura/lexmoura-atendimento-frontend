import React from 'react';
import { MenuIcon } from './icons.tsx';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 lg:justify-end">
        <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={onMenuClick}
            aria-label="Abrir menu"
        >
            <MenuIcon className="w-6 h-6" />
        </button>
        <span className="font-semibold text-gray-800 lg:hidden">LexMoura</span>
        <div>{/* Placeholder for user profile, search, or other actions */}</div>
    </header>
  );
};

export default Header;
