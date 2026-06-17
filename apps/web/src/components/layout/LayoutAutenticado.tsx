import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Calendar,
  ClipboardList,
  Shield,
  Users,
  Award,
  BarChart3,
  Trophy,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '../common/Button';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export const LayoutAutenticado: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isOrganizer, isParticipant, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const renderLinks = (onLinkClick?: () => void) => {
    return (
      <div className="space-y-1">
        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider px-4 mb-2.5">
          Painel Geral
        </span>
        <SidebarLink
          to="/dashboard"
          icon={<LayoutDashboard className="w-4.5 h-4.5" />}
          label="Início / Geral"
          active={isActive('/dashboard')}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/activities"
          icon={<Calendar className="w-4.5 h-4.5" />}
          label="Listagem Pública"
          active={isActive('/activities') || location.pathname.startsWith('/activities/')}
          onClick={onLinkClick}
        />

        {isParticipant && (
          <>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider px-4 pt-6 mb-2.5">
              Participação
            </span>
            <SidebarLink
              to="/my-enrollments"
              icon={<ClipboardList className="w-4.5 h-4.5" />}
              label="Minhas Inscrições"
              active={isActive('/my-enrollments')}
              onClick={onLinkClick}
            />
            <SidebarLink
              to="/certificates"
              icon={<Award className="w-4.5 h-4.5" />}
              label="Meus Certificados"
              active={isActive('/certificates')}
              onClick={onLinkClick}
            />
          </>
        )}

        {isOrganizer && (
          <>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider px-4 pt-6 mb-2.5">
              Organização & Admin
            </span>
            <SidebarLink
              to="/admin/activities"
              icon={<Shield className="w-4.5 h-4.5" />}
              label="Gestão de Atividades"
              active={isActive('/admin/activities') || location.pathname.startsWith('/admin/activities/')}
              onClick={onLinkClick}
            />
            {isAdmin && (
              <SidebarLink
                to="/admin/users"
                icon={<Users className="w-4.5 h-4.5" />}
                label="Gestão de Usuários"
                active={isActive('/admin/users')}
                onClick={onLinkClick}
              />
            )}
            <SidebarLink
              to="/admin/tournaments"
              icon={<Trophy className="w-4.5 h-4.5" />}
              label="Torneios IFPR"
              active={isActive('/admin/tournaments') || location.pathname.includes('/tournaments')}
              onClick={onLinkClick}
            />
            <SidebarLink
              to="/admin/reports"
              icon={<BarChart3 className="w-4.5 h-4.5" />}
              label="Relatórios & Export"
              active={isActive('/admin/reports')}
              onClick={onLinkClick}
            />
          </>
        )}
      </div>
    );
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Geral';
    if (path === '/activities') return 'Explorar Atividades';
    if (path.startsWith('/activities/')) return 'Detalhes da Atividade';
    if (path === '/my-enrollments') return 'Minhas Inscrições';
    if (path === '/certificates') return 'Meus Certificados';
    if (path === '/admin/activities') return 'Gestão de Atividades';
    if (path === '/admin/activities/new') return 'Cadastrar Nova Atividade';
    if (path.startsWith('/admin/activities/edit/')) return 'Editar Atividade';
    if (path === '/admin/users') return isAdmin ? 'Gestão de Usuários' : 'Consulta de Usuários';
    if (path === '/admin/tournaments') return 'Torneios IFPR';
    if (path === '/admin/reports') return 'Relatórios e Exportações';
    return 'Área Autenticada';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-slate-200 dark:border-[#121212] bg-white dark:bg-[#0c0c0c] shrink-0">
        <div className="px-6 py-5.5 border-b border-slate-200 dark:border-[#121212] flex items-center gap-3">
          <div className="bg-emerald-600/10 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white">SITEC</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase">IFPR Paranaguá</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-7">
          {renderLinks()}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-[#121212] bg-slate-50/50 dark:bg-[#0c0c0c]/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-[#0c0c0c] border-r border-slate-200 dark:border-[#1f1f1f] h-full z-10 animate-slide-in">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-[#1f1f1f]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-base font-extrabold text-slate-900 dark:text-white">SITEC IFPR</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              {renderLinks(() => setSidebarOpen(false))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-[#1f1f1f]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-500/5 transition-all cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      
      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-[#121212] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">SITEC</span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] transition-all cursor-pointer"
              title="Alternar Tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-650" />
              )}
            </button>

            
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-300 tracking-wide">
                    {user.name}
                  </span>
                  <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isOrganizer
                      ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                      : 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="bg-slate-100 dark:bg-[#0c0c0c] p-2 rounded-xl text-slate-500 dark:text-slate-450 border border-slate-200 dark:border-[#1f1f1f] shadow-inner">
                  <UserIcon className="w-4 h-4 text-emerald-650 dark:text-emerald-400" />
                </div>
              </div>
            )}
          </div>
        </header>

        
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
