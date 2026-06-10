import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  ClipboardList,
  Award,
  Trophy,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface Activity {
  id: string;
  title: string;
  location: string;
  startsAt: string;
  createdById: string;
  _count: {
    enrollments: number;
  };
}

export const Dashboard: React.FC = () => {
  const { user, token, isOrganizer, isParticipant, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activitiesCount, setActivitiesCount] = useState(0);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const actRes = await fetch(`${import.meta.env.VITE_API_URL}/activities`);
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivitiesCount(actData.length);
          
          const sorted = [...actData]
            .filter((act: any) => new Date(act.startsAt) > new Date())
            .slice(0, 3);
          setRecentActivities(sorted);
        }

        if (isParticipant && token) {
          const enrollRes = await fetch(`${import.meta.env.VITE_API_URL}/my-enrollments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (enrollRes.ok) {
            const enrollData = await enrollRes.json();
            const activeOnly = enrollData.filter((e: any) => e.status === 'ATIVA');
            setEnrollmentsCount(activeOnly.length);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, isAuthenticated, isParticipant]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 font-sans">
      
      <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm dark:shadow-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider select-none">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Ambiente IFPR Ativo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
            Olá, {user?.name}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
            Seja bem-vindo ao portal da SITEC. Aqui está uma visão geral do seu progresso acadêmico e das atividades disponíveis.
          </p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card variant="default" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider block">Atividades</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white block tracking-tight font-mono">
                {loading ? '...' : activitiesCount}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Ativas no Câmpus
            </span>
            <Link to="/activities" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5">
              Ver <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        
        <Card variant="default" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider block">Minhas Inscrições</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white block tracking-tight font-mono">
                {loading ? '...' : isParticipant ? enrollmentsCount : 'N/A'}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400">
              <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              {isOrganizer ? 'Perfil Organizador' : 'Inscrições confirmadas'}
            </span>
            {isParticipant && (
              <Link to="/my-enrollments" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5">
                Ver <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </Card>

        
        <Card variant="default" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider block">Certificados</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white block tracking-tight font-mono">
                {isParticipant ? (enrollmentsCount > 0 ? 1 : 0) : 15}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Assinatura Digital</span>
            {isParticipant && (
              <Link to="/certificates" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5">
                Ver <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </Card>

        
        <Card variant="default" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider block">Torneios IFPR</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white block tracking-tight font-mono">
                2
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400">
              <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Competições integradas</span>
            {isOrganizer && (
              <Link to="/admin/tournaments" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5">
                Gerenciar <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide font-outfit">Próximos Eventos & Oficinas</h3>
          
          {loading ? (
            <div className="p-8 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="p-8 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl text-center text-slate-600 dark:text-slate-400 text-sm">
              Nenhuma atividade agendada para os próximos dias.
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-[#2f2f2f] p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all shadow-sm dark:shadow-none"
                >
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{act.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {formatDate(act.startsAt)}
                      </span>
                      <span>Local: <strong className="text-slate-700 dark:text-slate-300">{act.location}</strong></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3.5">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#1f1f1f]">
                      {act._count?.enrollments || 0} inscritos
                    </span>
                    <Link to={`/activities/${act.id}`}>
                      <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900">
                        Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide font-outfit">Atalhos do Portal</h3>
          <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none">
            
            {isParticipant && (
              <>
                <Link
                  to="/activities"
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-[#2f2f2f] rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold text-slate-800 dark:text-white">Inscrever-se</span>
                      <span className="block text-[11px] text-slate-500">Explorar atividades abertas</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/my-enrollments"
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-[#2f2f2f] rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold text-slate-800 dark:text-white">Minhas Vagas</span>
                      <span className="block text-[11px] text-slate-500">Verificar status de inscrições</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </>
            )}

            {isOrganizer && (
              <>
                <Link
                  to="/admin/activities/new"
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-[#2f2f2f] rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold text-slate-800 dark:text-white">Criar Atividade</span>
                      <span className="block text-[11px] text-slate-500">Cadastrar palestra ou oficina</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/admin/tournaments"
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-[#2f2f2f] rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold text-slate-800 dark:text-white">Chaves de Torneio</span>
                      <span className="block text-[11px] text-slate-500">Configurar partidas e chaves</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/admin/reports"
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-[#1f1f1f] hover:border-slate-300 dark:hover:border-[#2f2f2f] rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold text-slate-800 dark:text-white">Exportar Relatórios</span>
                      <span className="block text-[11px] text-slate-500">Planilhas e dados analíticos</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </>
            )}
            
          </div>
        </div>

      </div>

    </div>
  );
};
