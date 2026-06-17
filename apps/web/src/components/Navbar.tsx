import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from './common/Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#050505]/85 backdrop-blur-xl border-b border-neutral-200 dark:border-[#1a1a1a] px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-neutral-900 dark:text-white font-display">SITEC</span>
            <span className="text-[9px] text-neutral-500 dark:text-neutral-500 font-mono font-medium uppercase tracking-widest">
              IFPR Paranaguá
            </span>
          </div>
        </Link>

        
        <div className="hidden sm:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            Início
          </Link>
          <Link
            to="/activities"
            className={`text-sm font-medium transition-colors ${
              isActive('/activities')
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            Atividades
          </Link>
        </div>

        
        <div className="flex items-center gap-3">
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white bg-neutral-100 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] transition-all cursor-pointer"
            title="Alternar Tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-500" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-neutral-600" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="primary" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Painel
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                icon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
                className="hidden md:inline-flex"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-3 py-2 rounded-xl transition-all"
              >
                Entrar
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={<LogIn className="w-4 h-4" />}>
                  Inscrever-se
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
