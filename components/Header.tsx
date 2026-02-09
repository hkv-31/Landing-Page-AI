
import React from 'react';

interface HeaderProps {
  onStartRoast: () => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartRoast, onNavigateHome }) => {
  const scrollToSection = (id: string) => {
    onNavigateHome();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
        <div className="bg-orange-600/20 p-2 rounded-lg">
          <i className="fas fa-fire text-orange-500 text-xl"></i>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">
          Landing Page Roaster AI
        </h1>
      </div>
      
      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
        <button onClick={() => scrollToSection('examples')} className="hover:text-white transition-colors">Examples</button>
      </nav>
      
      <button 
        onClick={onStartRoast}
        className="bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-600/20"
      >
        Try Free Roast
      </button>
    </header>
  );
};

export default Header;
