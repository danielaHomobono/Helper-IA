import React, { useState, useEffect } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import '../styles/components/DarkModeToggle.css';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <button 
      className="dark-mode-toggle" 
      onClick={toggleDarkMode}
      title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
    >
      {isDark ? <MdLightMode className="toggle-icon" /> : <MdDarkMode className="toggle-icon" />}
      <span className="toggle-text">{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  );
}

export default DarkModeToggle;
