import React, { useEffect, useState } from 'react';
import { AlertCircle, ShieldCheck, User as UserIcon, Trash2, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'PARTICIPANTE' | 'ORGANIZADOR';
  createdAt: string;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const { token, user: currentUser } = useAuth();

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

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Gestão de Usuários</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gerencie perfis acadêmicos, controle acessos e homologue organizadores do IFPR.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4.5 h-4.5" />}
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
      <Card variant="default" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th className="py-4 pl-6">Usuário</th>
                <th className="py-4 px-4">E-mail</th>
                <th className="py-4 px-4">Função</th>
                <th className="py-4 px-4">Data de Cadastro</th>
                <th className="py-4 pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 text-sm">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-850/30 transition-colors text-slate-800 dark:text-slate-200">
                  <td className="py-4 pl-6 font-bold flex items-center gap-2.5">
                    <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400">
                      <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="py-4 px-4">
                    <Badge variant={u.role === 'ORGANIZADOR' ? 'success' : 'neutral'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-slate-550 dark:text-slate-450 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ShieldCheck className="w-4 h-4" />}
                        loading={busyUserId === u.id}
                        onClick={() => toggleRole(u)}
                        title={u.role === 'ORGANIZADOR' ? 'Rebaixar para Participante' : 'Promover para Organizador'}
                      >
                        Alternar Função
                      </Button>
                      <button
                        onClick={() => deleteUser(u)}
                        disabled={busyUserId === u.id || u.id === currentUser?.id}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-xl transition-all border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remover conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}
    </div>
  );
};
