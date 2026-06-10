import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, Edit, Trash2, Plus, AlertCircle, Eye } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface Activity {
  id: string;
  title: string;
  location: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  createdById: string;
  _count: {
    enrollments: number;
  };
}

export const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { user, token, isAuthenticated, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const fetchMyActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities`);
      if (!res.ok) {
        throw new Error('Falha ao buscar atividades.');
      }
      
      const data = await res.json();
      
      const myActs = data.filter((act: Activity) => act.createdById === user?.id);
      setActivities(myActs);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isOrganizer) {
      navigate('/login');
      return;
    }
    fetchMyActivities();
  }, [user, token, isAuthenticated, isOrganizer]);

  const handleDelete = async (activityId: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a atividade "${title}"?`)) {
      return;
    }

    setActionError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao excluir atividade.');
      }

      fetchMyActivities();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Gestão de Atividades</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gerencie as atividades acadêmicas cadastradas sob o seu perfil de organizador.
          </p>
        </div>

        <Link to="/admin/activities/new">
          <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
            Nova Atividade
          </Button>
        </Link>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
        <Card variant="default" className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Falha ao buscar atividades</h3>
          <p className="text-xs text-slate-605 dark:text-slate-400 mt-2">{error}</p>
        </Card>
      ) : activities.length === 0 ? (
        <Card variant="default" className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhuma atividade cadastrada</h3>
          <p className="text-xs text-slate-605 dark:text-slate-400 mt-2 mb-6">
            Você ainda não criou nenhuma atividade acadêmica.
          </p>
          <Link to="/admin/activities/new">
            <Button variant="primary" size="sm">
              Cadastrar Primeira Atividade
            </Button>
          </Link>
        </Card>
      ) : (
        <Card variant="default" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                  <th className="py-4 pl-6">Atividade</th>
                  <th className="py-4 px-4">Local</th>
                  <th className="py-4 px-4">Data/Horário</th>
                  <th className="py-4 px-4 text-center">Inscritos / Vagas</th>
                  <th className="py-4 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 text-sm">
                {activities.map((act) => {
                  const activeCount = act._count?.enrollments || 0;
                  const isFull = activeCount >= act.capacity;

                  return (
                    <tr key={act.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-855/30 transition-colors text-slate-800 dark:text-slate-200">
                      <td className="py-4 pl-6 font-bold max-w-xs truncate" title={act.title}>
                        {act.title}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-[150px] truncate" title={act.location}>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span>{act.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span>{formatDate(act.startsAt)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={isFull ? 'danger' : 'success'}>
                          {activeCount} / {act.capacity}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link
                            to={`/activities/${act.id}`}
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl transition-all border border-slate-200 dark:border-slate-850"
                            title="Ver participantes inscritos"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/activities/edit/${act.id}`}
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl transition-all border border-slate-200 dark:border-slate-850"
                            title="Editar atividade"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(act.id, act.title)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-xl transition-all border border-rose-500/20"
                            title="Excluir atividade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
