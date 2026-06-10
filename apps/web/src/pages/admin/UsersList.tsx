import React, { useState } from 'react';
import { Users, ShieldCheck, User as UserIcon, Trash2, Search, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

interface UserMock {
  id: string;
  name: string;
  email: string;
  role: 'PARTICIPANTE' | 'ORGANIZADOR';
  createdAt: string;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserMock[]>([
    { id: '1', name: 'Organizador SITEC', email: 'organizador@sitec.com', role: 'ORGANIZADOR', createdAt: '2026-06-01' },
    { id: '2', name: 'Participante SITEC', email: 'participante@sitec.com', role: 'PARTICIPANTE', createdAt: '2026-06-02' },
    { id: '3', name: 'Ana Beatriz Souza', email: 'ana.souza@ifpr.edu.br', role: 'PARTICIPANTE', createdAt: '2026-06-05' },
    { id: '4', name: 'Dr. Roberto Carlos Mendes', email: 'roberto.mendes@ifpr.edu.br', role: 'ORGANIZADOR', createdAt: '2026-06-08' },
    { id: '5', name: 'Felipe Augusto Santos', email: 'felipe.santos@estudante.ifpr.edu.br', role: 'PARTICIPANTE', createdAt: '2026-06-09' },
  ]);
  const [search, setSearch] = useState('');

  const toggleRole = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newRole = u.role === 'ORGANIZADOR' ? 'PARTICIPANTE' : 'ORGANIZADOR';
          return { ...u, role: newRole as any };
        }
        return u;
      })
    );
  };

  const deleteUser = (userId: string, name: string) => {
    if (window.confirm(`Tem certeza de que deseja banir o usuário ${name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
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
                        onClick={() => toggleRole(u.id)}
                        title={u.role === 'ORGANIZADOR' ? 'Rebaixar para Participante' : 'Promover para Organizador'}
                      >
                        Alternar Função
                      </Button>
                      <button
                        onClick={() => deleteUser(u.id, u.name)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-xl transition-all border border-rose-500/20"
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
    </div>
  );
};
