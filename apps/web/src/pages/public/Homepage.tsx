import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  AlertCircle,
  Clock,
  MapPin,
  UserCheck,
  ChevronRight,
  Cpu,
  Presentation,
  Users,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Navbar } from '../../components/Navbar';

const SectionLabel: React.FC<{ number: string; text: string }> = ({ number, text }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-500 tracking-wider">
      {number}
    </span>
    <span className="h-px w-16 bg-neutral-300 dark:bg-[#2a2a2a]" />
    <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
      {text}
    </span>
  </div>
);

const CategoryTag: React.FC<{ children: React.ReactNode; color?: 'teal' | 'amber' | 'rose' }> = ({ children, color = 'teal' }) => {
  const colors = {
    teal: 'text-teal-600 dark:text-teal-400 border-teal-500/30',
    amber: 'text-amber-600 dark:text-amber-400 border-amber-500/30',
    rose: 'text-rose-600 dark:text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider border border-dashed px-2 py-0.5 rounded ${colors[color]}`}>
      {children}
    </span>
  );
};

interface HomepageActivity {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  creator: {
    name: string;
  };
  _count?: {
    enrollments: number;
  };
}

export const Homepage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedDay, setSelectedDay] = useState(1);
  const [activities, setActivities] = useState<HomepageActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const handleScrollToProgram = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('programacao')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        setActivitiesError(null);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/activities`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Erro ao carregar a programação.');
        }

        setActivities(data);
      } catch (err: any) {
        setActivitiesError(err.message || 'Erro ao carregar a programação.');
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDay = (date: string) => new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  const getDateKey = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: string) => new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getActivityType = (activity: HomepageActivity) => {
    const content = `${activity.title} ${activity.description}`.toLowerCase();
    if (content.includes('oficina') || content.includes('workshop')) return 'Oficina';
    if (content.includes('palestra') || content.includes('mesa')) return 'Palestra';
    if (content.includes('torneio') || content.includes('competição') || content.includes('mostra')) return 'Especial';
    return 'Atividade';
  };

  const getActivityColor = (type: string): 'teal' | 'amber' | 'rose' => {
    if (type === 'Oficina') return 'teal';
    if (type === 'Palestra') return 'amber';
    return 'rose';
  };

  const scheduleData = useMemo(() => {
    const grouped = activities.reduce<Record<string, HomepageActivity[]>>((acc, activity) => {
      const key = getDateKey(activity.startsAt);
      acc[key] = [...(acc[key] ?? []), activity];
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, dayActivities], index) => ({
        day: index + 1,
        label: `DIA ${String(index + 1).padStart(2, '0')}`,
        date: formatDay(dayActivities[0].startsAt),
        activities: dayActivities.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
      }));
  }, [activities]);

  useEffect(() => {
    if (scheduleData.length > 0 && selectedDay > scheduleData.length) {
      setSelectedDay(1);
    }
  }, [scheduleData.length, selectedDay]);

  const selectedSchedule = scheduleData[selectedDay - 1] ?? scheduleData[0];
  const totalCapacity = activities.reduce((total, activity) => total + activity.capacity, 0);
  const totalEnrollments = activities.reduce((total, activity) => total + (activity._count?.enrollments ?? 0), 0);
  const workshopCount = activities.filter(activity => getActivityType(activity) === 'Oficina').length;
  const lectureCount = activities.filter(activity => getActivityType(activity) === 'Palestra').length;

  const highlights = [
    { title: 'Oficinas Práticas', desc: 'Laboratórios hands-on focados em desenvolvimento, novas linguagens e ferramentas essenciais do setor tecnológico.', tag: 'oficina', color: 'teal' as const, wide: true },
    { title: 'Palestras Convidadas', desc: 'Diálogos com profissionais e pesquisadores sobre tendências, carreira e inovação no cenário tecnológico atual.', tag: 'palestra', color: 'amber' as const, wide: false },
    { title: 'Certificação Digital', desc: 'Emissão eletrônica de certificados oficiais com carga horária reconhecida para atividades complementares.', tag: 'certificado', color: 'teal' as const, wide: false },
    { title: 'Torneios e Competições', desc: 'Maratonas de programação, desafios lógicos e competições acadêmicas entre equipes de estudantes.', tag: 'torneio', color: 'rose' as const, wide: true },
    { title: 'Mostra de Trabalhos', desc: 'Espaço para apresentação de projetos acadêmicos, pesquisas e trabalhos de conclusão de curso.', tag: 'acadêmico', color: 'amber' as const, wide: false },
    { title: 'Integração Acadêmica', desc: 'Atividades de socialização, networking e troca de experiências entre estudantes, docentes e comunidade.', tag: 'integração', color: 'teal' as const, wide: false },
  ];

  const steps = [
    { n: '01', title: 'Consulte a programação', desc: 'Navegue pela agenda completa e selecione as atividades que mais combinam com seus interesses e formação.' },
    { n: '02', title: 'Faça sua inscrição', desc: 'Crie sua conta, garanta sua vaga nas oficinas e palestras desejadas e monte sua grade personalizada.' },
    { n: '03', title: 'Participe das atividades', desc: 'Compareça nos dias e horários indicados. Sua presença será registrada pela coordenação do evento.' },
    { n: '04', title: 'Acesse seus certificados', desc: 'Após homologação de presença, emita os certificados oficiais com validação digital diretamente pelo portal.' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-28 border-b border-neutral-200 dark:border-[#1a1a1a]">
        
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        
        <div className="hidden lg:block absolute left-[8%] top-0 bottom-0 w-px bg-neutral-200 dark:bg-[#1a1a1a]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <SectionLabel number="01" text="hero" />

              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tighter text-neutral-900 dark:text-white font-display leading-none">
                <span className="typing-logo">SITEC</span>
              </h1>

              <h2 className="text-lg sm:text-xl font-medium text-neutral-600 dark:text-neutral-400 tracking-wide max-w-xl mx-auto lg:mx-0">
                Semana de Informática, Tecnologia
                <br className="hidden sm:block" />
                e Integração Acadêmica
              </h2>

              <p className="text-neutral-500 dark:text-neutral-500 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Três dias de palestras, oficinas práticas, competições e apresentações acadêmicas no IFPR Câmpus Paranaguá. Um espaço para aprender, criar, compartilhar e construir futuro.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a href="#programacao" onClick={handleScrollToProgram}>
                  <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Ver programação
                  </Button>
                </a>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg">
                      Área do participante
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="outline" size="lg">
                      Fazer inscrição
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-neutral-900 dark:bg-[#0a0a0a] border border-neutral-800 dark:border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
                
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800 dark:border-[#1a1a1a] bg-neutral-900/80 dark:bg-[#080808]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50" />
                  </div>
                  <span className="ml-2 text-[10px] font-mono text-neutral-600">sitec_info.conf</span>
                </div>
                
                <div className="p-5 font-mono text-[13px] leading-relaxed space-y-1">
                  <div>
                    <span className="text-teal-400">evento</span>
                    <span className="text-neutral-600">: </span>
                    <span className="text-amber-400">"SITEC 2026"</span>
                  </div>
                  <div>
                    <span className="text-teal-400">local</span>
                    <span className="text-neutral-600">: </span>
                    <span className="text-amber-400">"IFPR Câmpus Paranaguá"</span>
                  </div>
                  <div>
                    <span className="text-teal-400">data</span>
                    <span className="text-neutral-600">: </span>
                    <span className="text-amber-400">"22–24 Out 2026"</span>
                  </div>
                  <div>
                    <span className="text-teal-400">edição</span>
                    <span className="text-neutral-600">: </span>
                    <span className="text-amber-400">"3ª Edição"</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 dark:border-[#1a1a1a] mt-3 text-neutral-500 text-[10px] tracking-wider">--- STATS ---</div>
                  <div className="grid grid-cols-3 gap-4 pt-3">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-white">{activitiesLoading ? '...' : workshopCount}</span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Oficinas</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-white">{activitiesLoading ? '...' : lectureCount}</span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Palestras</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-white">{activitiesLoading ? '...' : totalCapacity}<span className="text-teal-400 text-lg">+</span></span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Participantes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-24 md:py-32 border-b border-neutral-200 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel number="02" text="boas-vindas" />

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white font-display tracking-tight leading-tight">
                Um espaço para aprender,
                <br />
                <span className="text-teal-600 dark:text-teal-400">criar</span> e <span className="text-teal-600 dark:text-teal-400">compartilhar</span>.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                A SITEC foi pensada para reunir conhecimento, tecnologia e participação. Durante o evento, estudantes, professores e convidados compartilham experiências formativas em uma programação construída para aproximar a comunidade acadêmica de diferentes saberes.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <SectionLabel number="03" text="sobre" />
              <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">
                O que é a SITEC?
              </h3>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                <p>
                  A SITEC é o principal evento acadêmico de informática e tecnologia do IFPR Câmpus Paranaguá. Sua proposta é criar um ambiente de aprendizagem, compartilhamento de experiências e integração entre toda a comunidade acadêmica.
                </p>
                <p>
                  A programação reúne oficinas práticas em laboratório, palestras com profissionais atuantes no mercado, competições entre estudantes e apresentações de trabalhos acadêmicos — tudo pensado para enriquecer a formação e conectar saberes.
                </p>
              </div>
            </div>

            
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {[
                  { value: '3ª', label: 'Edição', sub: 'do evento' },
                  { value: activitiesLoading ? '...' : `${totalCapacity}+`, label: 'Participantes', sub: 'esperados' },
                  { value: activitiesLoading ? '...' : String(workshopCount), label: 'Oficinas', sub: 'práticas' },
                  { value: activitiesLoading ? '...' : String(activities.length), label: 'Atividades', sub: 'de programação' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl p-6 sm:p-8 hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all group"
                  >
                    <span className="block text-4xl sm:text-5xl font-bold font-mono text-neutral-900 dark:text-white tracking-tighter group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {stat.value}
                    </span>
                    <span className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-2 font-display">{stat.label}</span>
                    <span className="block text-xs text-neutral-400 dark:text-neutral-600 font-mono">{stat.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <SectionLabel number="04" text="destaques" />
            <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">
              Destaques da edição
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-xl mx-auto">
              Conheça as principais experiências preparadas para esta semana acadêmica.
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            {highlights.map((h, i) => (
              <div
                key={i}
                className={`${h.wide ? 'md:col-span-7' : 'md:col-span-5'}
                  bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl p-6
                  border-l-2 ${
                    h.color === 'teal' ? 'border-l-teal-500' :
                    h.color === 'amber' ? 'border-l-amber-500' :
                    'border-l-rose-500'
                  }
                  hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all group`}
              >
                <CategoryTag color={h.color}>// {h.tag}</CategoryTag>
                <h4 className="text-lg font-bold text-neutral-900 dark:text-white font-display mt-3 tracking-tight">
                  {h.title}
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="programacao" className="py-20 md:py-28 bg-neutral-100 dark:bg-[#080808] border-b border-neutral-200 dark:border-[#1a1a1a] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <SectionLabel number="05" text="agenda" />
            <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">
              Programação
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-xl mx-auto">
              Navegue pelos dias e acompanhe a agenda detalhada de abertura, oficinas, palestras e atividades de integração.
            </p>
          </div>

          
          <div className="flex flex-col items-center space-y-10">
            {activitiesError && (
              <div className="w-full max-w-3xl rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{activitiesError}</span>
              </div>
            )}

            {(activitiesLoading || scheduleData.length > 0) && (
              <div className="flex flex-wrap justify-center p-1 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl gap-1">
                {scheduleData.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                      selectedDay === d.day
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    [{d.label}]
                  </button>
                ))}
                {activitiesLoading && (
                  <span className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider text-neutral-400 dark:text-neutral-600">
                    carregando...
                  </span>
                )}
              </div>
            )}

            
            <div className="w-full max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-200 dark:border-[#1a1a1a] pb-3 mb-8">
                <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-wider">
                  {totalEnrollments} inscrito{totalEnrollments === 1 ? '' : 's'} //
                </span>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 font-display sm:text-right">
                  {selectedSchedule?.date ?? 'Programação em definição'}
                </span>
              </div>

              
              {activitiesLoading ? (
                <div className="relative border-l-2 border-neutral-200 dark:border-[#1a1a1a] pl-7 ml-3 space-y-6">
                  {[0, 1, 2].map(item => (
                    <div key={item} className="relative">
                      <div className="absolute -left-[33px] top-2 w-3 h-3 rounded-full border-2 border-neutral-300 dark:border-[#2a2a2a] bg-neutral-100 dark:bg-[#080808]" />
                      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] p-5 rounded-xl space-y-3">
                        <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-900 animate-pulse" />
                        <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-900 animate-pulse" />
                        <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-900/70 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !selectedSchedule ? (
                <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl p-8 text-center">
                  <BookOpen className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white font-display">Programação em construção</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                    As atividades cadastradas no sistema aparecerão aqui automaticamente.
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-neutral-200 dark:border-[#1a1a1a] pl-7 ml-3 space-y-6">
                  {selectedSchedule.activities.map((act) => {
                    const type = getActivityType(act);
                    const activeEnrollments = act._count?.enrollments ?? 0;

                    return (
                      <Link key={act.id} to={`/activities/${act.id}`} className="relative group block">
                        <div className="absolute -left-[33px] top-2 w-3 h-3 rounded-full border-2 border-teal-500 bg-neutral-100 dark:bg-[#080808] group-hover:bg-teal-500 transition-colors" />

                        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] p-5 rounded-xl space-y-3 hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                              <Clock className="w-3.5 h-3.5 text-teal-500" />
                              <span>{formatTime(act.startsAt)} - {formatTime(act.endsAt)}</span>
                            </div>
                            <CategoryTag color={getActivityColor(type)}>
                              {type}
                            </CategoryTag>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white font-display tracking-tight">
                            {act.title}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-500 border-t border-neutral-100 dark:border-[#1a1a1a] pt-3">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              <span className="min-w-0 truncate">{act.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <UserCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              <span className="min-w-0 truncate">{activeEnrollments}/{act.capacity} inscritos - {act.creator.name}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <SectionLabel number="06" text="guia" />
            <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">
              Como participar
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-lg mx-auto">
              Quatro passos para aproveitar ao máximo a semana acadêmica.
            </p>
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className={`flex items-start gap-6 sm:gap-8 py-8 ${
                  i < steps.length - 1 ? 'border-b border-neutral-100 dark:border-[#1a1a1a]' : ''
                } group`}
              >
                <span className="text-4xl sm:text-5xl font-bold font-mono text-neutral-200 dark:text-[#1a1a1a] group-hover:text-teal-500/30 dark:group-hover:text-teal-500/20 transition-colors select-none shrink-0 w-16 text-right">
                  {step.n}
                </span>
                <div className="space-y-2 pt-1">
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white font-display tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 md:py-28 border-b border-neutral-200 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <SectionLabel number="07" text="comunidade" />
            <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">
              Quem participa da SITEC
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-lg mx-auto">
              Cada perfil contribui para construir uma experiência acadêmica mais completa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            
            <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all">
              <div className="h-1 bg-teal-500" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white font-display">Participantes</h4>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                  Estudantes e comunidade que acompanham a programação, realizam inscrições nas oficinas e palestras, participam de competições e acessam certificados.
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-400 dark:text-neutral-600">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-teal-500" /> Inscrição em atividades</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-teal-500" /> Certificados digitais</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-teal-500" /> Torneios e competições</li>
                </ul>
              </div>
            </div>

            
            <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all">
              <div className="h-1 bg-amber-500" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white font-display">Organizadores</h4>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                  Docentes e equipe técnica que coordenam a programação, acompanham as atividades, registram presenças e homologam certificados.
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-400 dark:text-neutral-600">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-500" /> Gestão de atividades</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-500" /> Controle de presenças</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-500" /> Emissão de certificados</li>
                </ul>
              </div>
            </div>

            
            <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all">
              <div className="h-1 bg-rose-500" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Presentation className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white font-display">Palestrantes</h4>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                  Profissionais e pesquisadores convidados que compartilham conhecimento, vivências de mercado, tendências e conduzem workshops.
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-400 dark:text-neutral-600">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-rose-500" /> Palestras e workshops</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-rose-500" /> Mesas redondas</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-rose-500" /> Mentorias acadêmicas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-24 md:py-32 relative">
        
        <div className="absolute inset-0 bg-teal-500/[0.03] dark:bg-teal-500/[0.02]" />
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel number="08" text="participe" />

          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white font-display tracking-tight leading-tight">
              Faça parte da SITEC
            </h2>
            <p className="text-neutral-500 dark:text-neutral-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Explore a programação, escolha suas atividades, garanta sua vaga e aproveite a experiência completa do evento.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <a href="#programacao" onClick={handleScrollToProgram}>
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Ver programação
                </Button>
              </a>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Fazer inscrição
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      
      <footer className="bg-neutral-100 dark:bg-[#080808] border-t border-neutral-200 dark:border-[#1a1a1a] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          <div className="space-y-3">
            <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-wider font-display">SITEC</span>
            <p className="text-xs text-neutral-500 dark:text-neutral-600 leading-relaxed">
              Semana de Informática, Tecnologia e Integração Acadêmica
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 font-mono font-medium">
              IFPR Câmpus Paranaguá
            </p>
          </div>

          
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest text-[10px] font-mono">Navegação</h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-500">
              <li><Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Início</Link></li>
              <li><Link to="/activities" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Atividades</Link></li>
              <li><Link to="/login" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Área do Participante</Link></li>
            </ul>
          </div>

          
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest text-[10px] font-mono">Contato</h4>
            <div className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1.5">
              <p>sitec.paranagua@ifpr.edu.br</p>
              <p>(41) 3721-1200</p>
            </div>
          </div>

          
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest text-[10px] font-mono">Câmpus</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
              Rua Antônio Carlos Rodrigues, 453
              <br />
              Porto Seguro, Paranaguá — PR
              <br />
              CEP 83215-750
            </p>
          </div>
        </div>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600">
            © {new Date().getFullYear()} SITEC — IFPR Câmpus Paranaguá
          </p>
          <div className="flex gap-5 text-xs text-neutral-400 dark:text-neutral-600">
            <a href="https://paranagua.ifpr.edu.br" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Página do Câmpus
            </a>
            <a href="https://ifpr.edu.br" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Portal IFPR
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
