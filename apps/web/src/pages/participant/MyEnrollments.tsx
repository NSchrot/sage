import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, ClipboardList, AlertCircle, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface Enrollment {
  id: string;
  status: 'ATIVA' | 'CANCELADA';
  createdAt: string;
  activity: {
    id: string;
    title: string;
    description: string;
    location: string;
    startsAt: string;
    endsAt: string;
    creator: {
      name: string;
    };
  };
}

export const MyEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/my-enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Falha ao carregar suas inscrições.');
      }

      const data = await res.json();
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchEnrollments();
  }, [token, isAuthenticated]);

  const handleCancelEnrollment = async (activityId: string) => {
    setActionError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${activityId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao cancelar inscrição.');
      }
      
      fetchEnrollments();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeEnrollments = enrollments.filter(e => e.status === 'ATIVA');
  const canceledEnrollments = enrollments.filter(e => e.status === 'CANCELADA');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Minhas Inscrições</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Confira o cronograma e gerencie a presença nas atividades em que você garantiu vaga.
        </p>
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
      ) : error ? (
        <Card variant="default" className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Erro ao carregar dados</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{error}</p>
        </Card>
      ) : enrollments.length === 0 ? (
        <Card variant="default" className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhuma inscrição ativa</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-6">
            Você ainda não reservou vagas em oficinas ou bancas acadêmicas.
          </p>
          <Link to="/activities">
            <Button variant="primary" size="sm">
              Ver Atividades Disponíveis
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-10">
          
          {activeEnrollments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-900 pb-2">
                Atividades Confirmadas ({activeEnrollments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeEnrollments.map((enroll) => (
                  <Card
                    key={enroll.id}
                    variant="glow"
                    title={enroll.activity.title}
                    subtitle={`Organizador: ${enroll.activity.creator.name}`}
                    actions={<Badge variant="success">Confirmada</Badge>}
                    className="flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{formatDate(enroll.activity.startsAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{enroll.activity.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-3">
                      <Link
                        to={`/activities/${enroll.activity.id}`}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
                      >
                        Ver Detalhes
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelEnrollment(enroll.activity.id)}
                      >
                        Cancelar Inscrição
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          
          {canceledEnrollments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-900 pb-2">
                Inscrições Canceladas ({canceledEnrollments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                {canceledEnrollments.map((enroll) => (
                  <Card
                    key={enroll.id}
                    variant="default"
                    title={enroll.activity.title}
                    subtitle={`Organizador: ${enroll.activity.creator.name}`}
                    actions={<Badge variant="neutral">Cancelada</Badge>}
                    className="flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-450 border-t border-slate-100 dark:border-slate-900 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                          <span>{formatDate(enroll.activity.startsAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                          <span className="truncate">{enroll.activity.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                      <Link
                        to={`/activities/${enroll.activity.id}`}
                        className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/80 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
                      >
                        Ver Detalhes
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
