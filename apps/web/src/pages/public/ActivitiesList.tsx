import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, Search, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LayoutAutenticado } from '../../components/layout/LayoutAutenticado';
import { Navbar } from '../../components/Navbar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  _count: {
    enrollments: number;
  };
  creator: {
    name: string;
  };
}

export const ActivitiesList: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myEnrollmentIds, setMyEnrollmentIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated, isParticipant, token } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const actRes = await fetch(`${import.meta.env.VITE_API_URL}/activities`);
      if (!actRes.ok) throw new Error('Erro ao carregar atividades.');
      const actData = await actRes.json();
      setActivities(actData);

      if (isAuthenticated && isParticipant && token) {
        const enrollRes = await fetch(`${import.meta.env.VITE_API_URL}/my-enrollments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (enrollRes.ok) {
          const enrollData = await enrollRes.json();
          const activeIds = enrollData
            .filter((e: any) => e.status === 'ATIVA')
            .map((e: any) => e.activityId);
          setMyEnrollmentIds(new Set(activeIds));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, isParticipant, token]);

  const handleEnroll = async (activityId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setActionError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${activityId}/enroll`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao realizar inscrição.');
      }
      
      fetchData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

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
      
      fetchData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const filteredActivities = activities.filter(act =>
    act.title.toLowerCase().includes(search.toLowerCase()) ||
    act.location.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const content = (
    <div className={`${!isAuthenticated ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12' : 'space-y-8'}`}>
      
      
      {!isAuthenticated && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-outfit">
              Atividades Acadêmicas
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Descubra e garanta sua presença nas oficinas, palestras e atividades da SITEC do IFPR Câmpus Paranaguá.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Input
              placeholder="Buscar atividades ou locais..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4.5 h-4.5" />}
            />
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex justify-end mb-4">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Buscar por título ou local..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4.5 h-4.5" />}
            />
          </div>
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <Card variant="default" className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Falha ao carregar dados</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData} className="mt-4">
            Tentar Novamente
          </Button>
        </Card>
      ) : filteredActivities.length === 0 ? (
        <Card variant="default" className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhuma atividade registrada</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">
            {search ? 'Ajuste os termos de busca e tente novamente.' : 'Aguardando publicação de novas oficinas.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const enrolled = myEnrollmentIds.has(activity.id);
            const activeEnrollments = activity._count.enrollments;
            const spotsLeft = Math.max(0, activity.capacity - activeEnrollments);
            const isFull = spotsLeft === 0;

            return (
              <Card
                key={activity.id}
                variant={enrolled ? 'glow' : 'default'}
                title={activity.title}
                subtitle={`Organizador: ${activity.creator.name}`}
                actions={
                  enrolled && (
                    <Badge variant="success">Inscrito</Badge>
                  )
                }
                className="flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {activity.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{formatDate(activity.startsAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{activity.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Vagas: <strong className="text-slate-250 font-bold">{activeEnrollments}/{activity.capacity}</strong>
                        {isFull ? (
                          <span className="text-rose-400 font-bold ml-1.5">(Esgotado)</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold ml-1.5">({spotsLeft} livres)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3">
                  <button
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    Ver detalhes
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {isParticipant && (
                    <>
                      {enrolled ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelEnrollment(activity.id)}
                        >
                          Cancelar Inscrição
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isFull}
                          onClick={() => handleEnroll(activity.id)}
                        >
                          {isFull ? 'Sem Vagas' : 'Inscrever-se'}
                        </Button>
                      )}
                    </>
                  )}

                  {!isAuthenticated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/login')}
                    >
                      Entrar para Inscrever
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isAuthenticated) {
    return <LayoutAutenticado>{content}</LayoutAutenticado>;
  }

  return (
    <>
      <Navbar />
      {content}
    </>
  );
};
