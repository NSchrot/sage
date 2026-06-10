import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Calendar, LayoutDashboard, LogIn, LogOut, Sun, Moon } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/85 backdrop-blur-md border-b border-slate-200 dark:border-[#121212] px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-emerald-600/10 p-2 rounded-xl text-emerald-655 dark:text-emerald-400 border border-emerald-500/20 shadow-sm group-hover:bg-emerald-600/20 transition-all">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white">SITEC</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              IFPR Câmpus Paranaguá
            </span>
          </div>
        </Link>

        
        <div className="hidden sm:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${
              isActive('/')
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Início
          </Link>
          <Link
            to="/activities"
            className={`text-sm font-semibold transition-colors ${
              isActive('/activities')
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Atividades
          </Link>
        </div>

        
        <div className="flex items-center gap-3">
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] transition-all cursor-pointer"
            title="Alternar Tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-500" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-650" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="primary" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Acessar Painel
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
                className="text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl transition-all"
              >
                Entrar
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={<LogIn className="w-4 h-4" />}>
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
