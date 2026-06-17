import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSpreadsheet,
  LayoutDashboard,
  MapPin,
  QrCode,
  Trophy,
  Users,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface Activity {
  id: string;
  title: string;
  location: string;
  startsAt: string;
  endsAt?: string;
  createdById: string;
  _count: {
    enrollments: number;
  };
}

interface Enrollment {
  id: string;
  status: 'ATIVA' | 'CANCELADA';
  attendanceConfirmedAt?: string | null;
  certificateIssuedAt?: string | null;
  activity: {
    id: string;
    title: string;
    location: string;
    startsAt: string;
    endsAt?: string;
    creator?: {
      name: string;
    };
  };
}

interface ReportSummary {
  activeEnrollmentsTotal: number;
  attendancesConfirmedTotal: number;
  certificatesIssuedTotal: number;
  occupancyRate: number;
  activitiesTotal: number;
}

export const Dashboard: React.FC = () => {
  const { user, token, isOrganizer, isParticipant, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const activityRes = await fetch(`${import.meta.env.VITE_API_URL}/activities`);
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivities(activityData);
        }

        if (isParticipant && token) {
          const enrollRes = await fetch(`${import.meta.env.VITE_API_URL}/my-enrollments`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (enrollRes.ok) {
            const enrollData = await enrollRes.json();
            setEnrollments(enrollData);
          }
        }

        if (isOrganizer && token) {
          const summaryRes = await fetch(`${import.meta.env.VITE_API_URL}/reports/summary`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            setSummary(summaryData);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, isAuthenticated, isParticipant, isOrganizer, navigate]);

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });

  const isAdmin = user?.role === 'ADMINISTRADOR';
  const activeEnrollments = useMemo(() => enrollments.filter(enrollment => enrollment.status === 'ATIVA'), [enrollments]);
  const confirmedAttendances = activeEnrollments.filter(enrollment => enrollment.attendanceConfirmedAt).length;
  const issuedCertificates = activeEnrollments.filter(enrollment => enrollment.certificateIssuedAt).length;

  const upcomingActivities = useMemo(() => {
    const now = Date.now();
    return activities
      .filter(activity => new Date(activity.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 5);
  }, [activities]);

  const upcomingEnrollments = useMemo(() => {
    const now = Date.now();
    return activeEnrollments
      .filter(enrollment => new Date(enrollment.activity.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.activity.startsAt).getTime() - new Date(b.activity.startsAt).getTime());
  }, [activeEnrollments]);

  const managedActivities = useMemo(() => {
    if (!isOrganizer) return [];
    if (isAdmin) return activities;
    return activities.filter(activity => activity.createdById === user?.id);
  }, [activities, isAdmin, isOrganizer, user?.id]);

  const managedUpcomingActivities = useMemo(() => {
    const now = Date.now();
    return managedActivities
      .filter(activity => new Date(activity.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [managedActivities]);

  const nextFocus = isParticipant
    ? upcomingEnrollments[0]?.activity
    : managedUpcomingActivities[0] ?? upcomingActivities[0];

  const roleLabel = isAdmin ? 'Administração' : isOrganizer ? 'Organização' : 'Participação';
  const managedEnrollmentCount = managedActivities.reduce((total, activity) => total + (activity._count?.enrollments ?? 0), 0);

  const metricCards = isOrganizer
    ? [
        {
          label: isAdmin ? 'Atividades publicadas' : 'Suas atividades',
          value: isAdmin ? summary?.activitiesTotal ?? activities.length : managedActivities.length,
          detail: `${managedUpcomingActivities.length} próximas`,
          icon: <CalendarDays className="w-4 h-4" />,
          className: 'border-teal-500/20 bg-teal-500/[0.04] text-teal-700 dark:text-teal-400',
        },
        {
          label: 'Inscrições ativas',
          value: isAdmin ? summary?.activeEnrollmentsTotal ?? managedEnrollmentCount : managedEnrollmentCount,
          detail: `${summary?.occupancyRate ?? 0}% de ocupação geral`,
          icon: <Users className="w-4 h-4" />,
          className: 'border-sky-500/20 bg-sky-500/[0.04] text-sky-700 dark:text-sky-400',
        },
        {
          label: 'Presenças',
          value: summary?.attendancesConfirmedTotal ?? 0,
          detail: 'confirmadas no evento',
          icon: <ClipboardCheck className="w-4 h-4" />,
          className: 'border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-700 dark:text-emerald-400',
        },
        {
          label: 'Certificados',
          value: summary?.certificatesIssuedTotal ?? 0,
          detail: 'emitidos até agora',
          icon: <Award className="w-4 h-4" />,
          className: 'border-amber-500/20 bg-amber-500/[0.04] text-amber-700 dark:text-amber-400',
        },
      ]
    : [
        {
          label: 'Inscrições ativas',
          value: activeEnrollments.length,
          detail: `${upcomingEnrollments.length} próximas`,
          icon: <ClipboardCheck className="w-4 h-4" />,
          className: 'border-teal-500/20 bg-teal-500/[0.04] text-teal-700 dark:text-teal-400',
        },
        {
          label: 'Presenças',
          value: confirmedAttendances,
          detail: 'confirmadas por QR ou banca',
          icon: <CheckCircle2 className="w-4 h-4" />,
          className: 'border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-700 dark:text-emerald-400',
        },
        {
          label: 'Certificados',
          value: issuedCertificates,
          detail: 'disponíveis para imprimir',
          icon: <Award className="w-4 h-4" />,
          className: 'border-amber-500/20 bg-amber-500/[0.04] text-amber-700 dark:text-amber-400',
        },
        {
          label: 'Programação',
          value: activities.length,
          detail: 'atividades publicadas',
          icon: <CalendarDays className="w-4 h-4" />,
          className: 'border-sky-500/20 bg-sky-500/[0.04] text-sky-700 dark:text-sky-400',
        },
      ];

  const quickActions = isOrganizer
    ? [
        {
          title: 'Cadastrar atividade',
          text: 'Publicar oficina, banca ou palestra',
          to: '/admin/activities/new',
          icon: <CalendarDays className="w-4 h-4" />,
        },
        {
          title: 'Abrir presença por QR',
          text: 'Entrar na atividade e exibir o código',
          to: '/admin/activities',
          icon: <QrCode className="w-4 h-4" />,
        },
        {
          title: 'Relatórios',
          text: 'Acompanhar adesão e certificados',
          to: '/admin/reports',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        },
        {
          title: 'Torneios',
          text: 'Organizar chaves e partidas',
          to: '/admin/tournaments',
          icon: <Trophy className="w-4 h-4" />,
        },
      ]
    : [
        {
          title: 'Explorar programação',
          text: 'Encontrar atividades abertas',
          to: '/activities',
          icon: <CalendarDays className="w-4 h-4" />,
        },
        {
          title: 'Minhas inscrições',
          text: 'Ver vagas e presença',
          to: '/my-enrollments',
          icon: <ClipboardCheck className="w-4 h-4" />,
        },
        {
          title: 'Certificados',
          text: 'Imprimir documentos emitidos',
          to: '/certificates',
          icon: <Award className="w-4 h-4" />,
        },
      ];

  return (
    <div className="space-y-7">
      <section className="rounded-2xl border border-slate-250 dark:border-[#1f1f1f] bg-white dark:bg-[#0c0c0c] overflow-hidden">
        <div className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isOrganizer ? 'info' : 'success'}>{roleLabel}</Badge>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 capitalize">
                {currentDate}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight font-outfit">
                Olá, {user?.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isOrganizer
                  ? 'Acompanhe a operação da SITEC, revise presença, certificados e próximas atividades sob responsabilidade da equipe.'
                  : 'Veja sua próxima atividade, acompanhe presença e acesse os certificados emitidos pelo portal.'}
              </p>
            </div>
          </div>

          <Link to={isOrganizer ? '/admin/activities' : '/activities'}>
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              {isOrganizer ? 'Ver gestão' : 'Ver programação'}
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {metricCards.map(metric => (
          <div key={metric.label} className={`rounded-xl border p-3.5 ${metric.className}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{metric.label}</span>
              {metric.icon}
            </div>
            <span className="block text-2xl font-extrabold font-mono mt-2 text-slate-950 dark:text-white">
              {loading ? '...' : metric.value}
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-450 mt-1">{metric.detail}</span>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 dark:text-white font-outfit">Agenda próxima</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isOrganizer ? 'Atividades que exigem acompanhamento da equipe.' : 'Atividades abertas e oportunidades de participação.'}
              </p>
            </div>
            <Link to="/activities" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1">
              Programação completa <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-250 dark:border-[#1f1f1f] bg-white dark:bg-[#0c0c0c] p-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500" />
            </div>
          ) : upcomingActivities.length === 0 ? (
            <div className="rounded-2xl border border-slate-250 dark:border-[#1f1f1f] bg-white dark:bg-[#0c0c0c] p-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Nenhuma atividade agendada para os próximos dias.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-250 dark:border-[#1f1f1f] bg-white dark:bg-[#0c0c0c] overflow-hidden">
              {upcomingActivities.map((activity, index) => (
                <Link
                  key={activity.id}
                  to={`/activities/${activity.id}`}
                  className={`grid gap-4 md:grid-cols-[120px_minmax(0,1fr)_120px] md:items-center px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-950/70 transition-colors ${
                    index > 0 ? 'border-t border-slate-200/70 dark:border-[#1f1f1f]' : ''
                  }`}
                >
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {formatShortDate(activity.startsAt)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-slate-950 dark:text-white truncate">{activity.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="truncate">{activity.location}</span>
                    </p>
                  </div>
                  <div className="flex md:justify-end">
                    <Badge variant="neutral">{activity._count?.enrollments ?? 0} inscritos</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card
            variant="glow"
            title={
              <div className="flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-teal-500" />
                <span>Próximo foco</span>
              </div>
            }
          >
            {nextFocus ? (
              <div className="space-y-3">
                <h2 className="text-lg font-extrabold text-slate-950 dark:text-white leading-tight">
                  {nextFocus.title}
                </h2>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    {formatFullDate(nextFocus.startsAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    {nextFocus.location}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Nenhuma atividade futura vinculada ao seu perfil no momento.
              </p>
            )}
          </Card>

          <Card
            variant="default"
            title={
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-teal-500" />
                <span>Ações rápidas</span>
              </div>
            }
            subtitle={isOrganizer ? 'Rotina da organização' : 'Seu caminho no evento'}
          >
            <div className="space-y-2.5">
              {quickActions.map(action => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-250 dark:border-[#1f1f1f] bg-slate-50 dark:bg-slate-950 hover:border-teal-500/30 dark:hover:border-teal-500/30 px-4 py-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-white dark:bg-[#0c0c0c] border border-slate-250 dark:border-[#1f1f1f] flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                      {action.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">{action.title}</span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-450 truncate">{action.text}</span>
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
