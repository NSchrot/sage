import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, Crown, GraduationCap, Mail, Search, ShieldCheck, Trash2, User as UserIcon, UserCog, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'PARTICIPANTE' | 'ORGANIZADOR' | 'ADMINISTRADOR';
  createdAt: string;
}

type RoleFilter = 'TODOS' | ManagedUser['role'];

const roleLabels: Record<ManagedUser['role'], string> = {
  PARTICIPANTE: 'Participante',
  ORGANIZADOR: 'Organizador',
  ADMINISTRADOR: 'Administrador',
};

const roleDescriptions: Record<ManagedUser['role'], string> = {
  PARTICIPANTE: 'Inscrições e certificados',
  ORGANIZADOR: 'Atividades e presenças',
  ADMINISTRADOR: 'Acessos e permissões',
};

const roleAccents: Record<ManagedUser['role'], string> = {
  PARTICIPANTE: 'bg-slate-400',
  ORGANIZADOR: 'bg-teal-500',
  ADMINISTRADOR: 'bg-sky-500',
};

const rolePanels: Record<ManagedUser['role'], string> = {
  PARTICIPANTE: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800',
  ORGANIZADOR: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400',
  ADMINISTRADOR: 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-400',
};

const roleBadgeVariant: Record<ManagedUser['role'], 'success' | 'info' | 'neutral'> = {
  PARTICIPANTE: 'neutral',
  ORGANIZADOR: 'success',
  ADMINISTRADOR: 'info',
};

const getInitials = (name: string) => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map(part => part[0])
  .join('')
  .toUpperCase();

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('TODOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const { token, user: currentUser, isAdmin } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao carregar usuários.');
      }

      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const toggleRole = async (managedUser: ManagedUser) => {
    if (!isAdmin) {
      setActionError('Apenas administradores podem alterar funções de usuários.');
      return;
    }

    const newRole = managedUser.role === 'ORGANIZADOR' ? 'PARTICIPANTE' : 'ORGANIZADOR';
    setActionError(null);
    setBusyUserId(managedUser.id);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${managedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao atualizar perfil.');
      }

      setUsers(prev => prev.map(u => u.id === data.id ? data : u));
    } catch (err: any) {
      setActionError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setBusyUserId(null);
    }
  };

  const deleteUser = async (managedUser: ManagedUser) => {
    if (managedUser.id === currentUser?.id) {
      setActionError('Você não pode remover a própria conta.');
      return;
    }

    if (!window.confirm(`Tem certeza de que deseja remover o usuário ${managedUser.name}?`)) {
      return;
    }

    setActionError(null);
    setBusyUserId(managedUser.id);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${managedUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao remover usuário.');
      }

      setUsers(prev => prev.filter(u => u.id !== managedUser.id));
    } catch (err: any) {
      setActionError(err.message || 'Erro ao remover usuário.');
    } finally {
      setBusyUserId(null);
    }
  };

  const summary = useMemo(() => ({
    total: users.length,
    participantes: users.filter(u => u.role === 'PARTICIPANTE').length,
    organizadores: users.filter(u => u.role === 'ORGANIZADOR').length,
    administradores: users.filter(u => u.role === 'ADMINISTRADOR').length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter(u => {
      const matchesRole = roleFilter === 'TODOS' || u.role === roleFilter;
      const matchesSearch = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, search]);

  const filterOptions: Array<{ value: RoleFilter; label: string; count: number; icon: React.ReactNode }> = [
    { value: 'TODOS', label: 'Todos', count: summary.total, icon: <Users className="w-4 h-4" /> },
    { value: 'PARTICIPANTE', label: 'Participantes', count: summary.participantes, icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'ORGANIZADOR', label: 'Organizadores', count: summary.organizadores, icon: <UserCog className="w-4 h-4" /> },
    { value: 'ADMINISTRADOR', label: 'Admins', count: summary.administradores, icon: <Crown className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-7">
      <div className="space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Controle institucional
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight font-outfit">
              Usuários e permissões
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Acompanhe os perfis cadastrados e mantenha organizadores homologados sem misturar permissões administrativas.
            </p>
          </div>

          <div className="grid grid-cols-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0c0c0c] overflow-hidden min-w-full sm:min-w-[420px] xl:min-w-[460px]">
            <div className="p-4 border-r border-slate-200 dark:border-slate-850">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Usuários</span>
              <span className="block text-2xl font-extrabold text-slate-950 dark:text-white font-mono mt-1">{summary.total}</span>
            </div>
            <div className="p-4 border-r border-slate-200 dark:border-slate-850">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Equipe</span>
              <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono mt-1">{summary.organizadores}</span>
            </div>
            <div className="p-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Admins</span>
              <span className="block text-2xl font-extrabold text-sky-600 dark:text-sky-400 font-mono mt-1">{summary.administradores}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px] items-stretch">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
            {filterOptions.map(option => {
              const active = roleFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRoleFilter(option.value)}
                  className={`min-h-20 text-left rounded-2xl border px-4 py-3 transition-all cursor-pointer ${
                    active
                      ? 'border-teal-500/40 bg-teal-500/10 text-slate-950 dark:text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0c0c0c] hover:border-slate-300 dark:hover:border-slate-750 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${active ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {option.icon}
                    {option.label}
                  </span>
                  <span className="block text-2xl font-extrabold font-mono mt-2">{option.count}</span>
                </button>
              );
            })}
          </div>

          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4.5 h-4.5" />}
            className="h-full min-h-20 text-base"
          />
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : error ? (
        <Card variant="default" className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Falha ao carregar usuários</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="mt-4">
            Tentar Novamente
          </Button>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card variant="default" className="text-center py-12">
          <UserIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum usuário encontrado</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">
            {search ? 'Ajuste os termos de busca e tente novamente.' : 'Ainda não há usuários cadastrados.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="hidden lg:grid grid-cols-[minmax(0,1.4fr)_minmax(220px,0.9fr)_180px_220px] gap-4 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <span>Perfil</span>
            <span>Contato</span>
            <span>Entrada</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map(u => (
              <article
                key={u.id}
                className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0c0c0c] hover:border-slate-300 dark:hover:border-slate-750 transition-all"
              >
                <div className={`absolute left-0 top-0 h-full w-1 ${roleAccents[u.role]}`} />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.9fr)_180px_220px] lg:items-center p-4 sm:p-5 pl-5 sm:pl-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-sm font-extrabold shrink-0 ${rolePanels[u.role]}`}>
                      {getInitials(u.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-950 dark:text-white truncate">
                          {u.name}
                        </h3>
                        {u.id === currentUser?.id && (
                          <Badge variant="info" className="text-[9px]">Você</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={roleBadgeVariant[u.role]}>
                          {roleLabels[u.role]}
                        </Badge>
                        <span className="text-[11px] text-slate-500 dark:text-slate-450">
                          {roleDescriptions[u.role]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 min-w-0">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-450">
                    <CalendarDays className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end gap-2.5">
                      {isAdmin && u.role !== 'ADMINISTRADOR' && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<ShieldCheck className="w-4 h-4" />}
                          loading={busyUserId === u.id}
                          onClick={() => toggleRole(u)}
                          title={u.role === 'ORGANIZADOR' ? 'Rebaixar para Participante' : 'Promover para Organizador'}
                        >
                          {u.role === 'ORGANIZADOR' ? 'Rebaixar' : 'Promover'}
                        </Button>
                      )}
                      <button
                        onClick={() => deleteUser(u)}
                        disabled={busyUserId === u.id || u.id === currentUser?.id}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 p-2 rounded-xl transition-all border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remover conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
