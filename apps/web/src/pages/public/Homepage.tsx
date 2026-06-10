import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  BookOpen,
  Laptop,
  GraduationCap,
  MapPin,
  Clock,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  Target
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/Navbar';

export const Homepage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedDay, setSelectedDay] = useState(1);

  const handleScrollToProgram = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('programacao');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scheduleData = [
    {
      day: 1,
      date: 'Segunda-feira, 22 de Outubro',
      activities: [
        {
          time: '08:30 - 09:00',
          title: 'Credenciamento e Acolhimento',
          type: 'Credenciamento',
          location: 'Auditório Principal',
          speaker: 'Comissão Organizadora',
          category: 'Geral',
        },
        {
          time: '09:00 - 10:00',
          title: 'Solenidade de Abertura Oficial da SITEC',
          type: 'Abertura',
          location: 'Auditório Principal',
          speaker: 'Direção Geral e Coordenação de Informática',
          category: 'Abertura',
        },
        {
          time: '10:00 - 12:00',
          title: 'Palestra Magna: O Futuro da Informática e Sociedade',
          type: 'Palestra',
          location: 'Auditório Principal',
          speaker: 'Dr. Alexandre Souza',
          category: 'Tecnologia',
        },
        {
          time: '14:00 - 17:30',
          title: 'Oficina Prática: Introdução ao Desenvolvimento Web Moderno',
          type: 'Oficina',
          location: 'Laboratório de Informática 2',
          speaker: 'Prof. Roberto Mendes',
          category: 'Oficina',
        },
        {
          time: '19:00 - 20:30',
          title: 'Palestra: Segurança de Dados e Privacidade na Era Digital',
          type: 'Palestra',
          location: 'Auditório Principal',
          speaker: 'Msc. Fernando Silva',
          category: 'Segurança',
        }
      ]
    },
    {
      day: 2,
      date: 'Terça-feira, 23 de Outubro',
      activities: [
        {
          time: '08:30 - 12:00',
          title: 'Oficina Prática: Internet das Coisas (IoT) com Arduino',
          type: 'Oficina',
          location: 'Laboratório de Eletrônica e IoT',
          speaker: 'Prof. Carlos Lima',
          category: 'Oficina',
        },
        {
          time: '10:30 - 12:00',
          title: 'Mesa Redonda: Mulheres na Tecnologia e Integração',
          type: 'Atividade Especial',
          location: 'Auditório Principal',
          speaker: 'Convidadas Especiais do Setor de TI',
          category: 'Integração',
        },
        {
          time: '14:00 - 17:30',
          title: 'Oficina Prática: Princípios de Design e Usabilidade Centrada no Usuário',
          type: 'Oficina',
          location: 'Laboratório de Informática 1',
          speaker: 'Mariana Costa (Designer de UX)',
          category: 'Design',
        },
        {
          time: '19:30 - 21:00',
          title: 'Palestra: Inteligência Artificial Aplicada e Mercado de Trabalho',
          type: 'Palestra',
          location: 'Auditório Principal',
          speaker: 'Dr. Eduardo Santos',
          category: 'Tecnologia',
        }
      ]
    },
    {
      day: 3,
      date: 'Quarta-feira, 24 de Outubro',
      activities: [
        {
          time: '09:00 - 12:00',
          title: 'Mostra de Trabalhos: Apresentações de Projetos Acadêmicos',
          type: 'Atividades Especiais',
          location: 'Hall de Entrada do Campus',
          speaker: 'Discentes e Docentes do IFPR',
          category: 'Acadêmico',
        },
        {
          time: '14:00 - 17:00',
          title: 'Oficina Prática: Versionamento de Código com Git e GitHub',
          type: 'Oficina',
          location: 'Laboratório de Informática 1',
          speaker: 'Profª Aline Rocha',
          category: 'Oficina',
        },
        {
          time: '17:00 - 19:30',
          title: 'Atividade de Integração: Torneio de Programação e Desafios Digitais',
          type: 'Atividades Especiais',
          location: 'Laboratório de Informática 2',
          speaker: 'Grêmio Estudantil e Professores',
          category: 'Integração',
        },
        {
          time: '20:00 - 21:30',
          title: 'Encerramento e Cerimônia de Premiações',
          type: 'Encerramento',
          location: 'Auditório Principal',
          speaker: 'Comissão Organizadora da SITEC',
          category: 'Geral',
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 min-h-screen relative overflow-hidden font-sans transition-colors duration-300">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      
      <Navbar />

      
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-[#121212]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold tracking-wide uppercase select-none">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>IFPR Câmpus Paranaguá</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-outfit">
              SITEC
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-350 tracking-wide">
              Semana de Informática, Tecnologia e Integração Acadêmica
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Bem-vindo à SITEC, um espaço de encontro, aprendizado e troca de experiências entre estudantes, professores e comunidade. Acompanhe a programação, participe das atividades e aproveite tudo o que o evento preparou para esta edição.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
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
                <>
                  <Link to="/register">
                    <Button variant="outline" size="lg">
                      Fazer inscrição
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" size="lg" className="text-slate-655 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5">
                      Área do participante
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-6 shadow-xl dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
                Informações Importantes
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-[#040404] border border-slate-150 dark:border-[#121212] rounded-xl flex flex-col justify-between space-y-2 group hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg w-fit">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-850 dark:text-white">Oficinas</span>
                    <span className="text-[10px] text-slate-550 dark:text-slate-500 font-medium">Práticas de laboratório</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#040404] border border-slate-150 dark:border-[#121212] rounded-xl flex flex-col justify-between space-y-2 group hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all">
                  <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg w-fit">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-850 dark:text-white">Palestras</span>
                    <span className="text-[10px] text-slate-550 dark:text-slate-500 font-medium">Convidados e mercado</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#040404] border border-slate-150 dark:border-[#121212] rounded-xl flex flex-col justify-between space-y-2 group hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all">
                  <div className="p-2 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-lg w-fit">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-850 dark:text-white">Certificados</span>
                    <span className="text-[10px] text-slate-550 dark:text-slate-500 font-medium">Horas complementares</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#040404] border border-slate-150 dark:border-[#121212] rounded-xl flex flex-col justify-between space-y-2 group hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all">
                  <div className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg w-fit">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-850 dark:text-white">Atividades</span>
                    <span className="text-[10px] text-slate-550 dark:text-slate-500 font-medium">Integração e torneios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white dark:bg-[#050505]/40 border-b border-slate-200 dark:border-[#121212] transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Acolhimento</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-outfit">
            Seja bem-vindo à SITEC
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg">
            A SITEC foi pensada para reunir conhecimento, tecnologia e participação em uma programação construída para aproximar a comunidade acadêmica de diferentes experiências formativas. Durante o evento, os participantes poderão acompanhar atividades, oficinas, palestras e outros momentos de integração ao longo da programação.
          </p>
        </div>
      </section>

      
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 border-b border-slate-200 dark:border-[#121212]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Sobre o evento</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-outfit">O que é a SITEC?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              A SITEC é um evento acadêmico voltado à promoção de atividades relacionadas à informática, tecnologia, inovação e formação estudantil. Sua proposta é criar um ambiente de aprendizagem, compartilhamento de experiências e integração entre participantes, convidados e organização.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card variant="default" title="Programação diversificada">
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Atividades planejadas para abranger diversos temas da área de informática e tecnologia, trazendo o que há de mais atual no mercado.
              </p>
            </Card>

            <Card variant="default" title="Atividades acadêmicas">
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Palestras, workshops e oficinas ministradas por profissionais experientes do mercado tecnológico e corpo docente do IFPR.
              </p>
            </Card>

            <Card variant="default" title="Participação estudantil">
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Espaço totalmente aberto para a integração, o protagonismo juvenil, competições recreativas e a troca ativa de ideias entre os estudantes.
              </p>
            </Card>

            <Card variant="default" title="Certificação das atividades">
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Emissão eletrônica de certificados oficiais de participação com carga horária reconhecida para validação de atividades complementares.
              </p>
            </Card>
          </div>
        </div>
      </section>

      
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-b border-slate-200 dark:border-[#121212]">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Destaques</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Destaques da edição</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Descubra as principais experiências e diferenciais preparados com dedicação para a nossa semana acadêmica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none transition-all">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Laptop className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Oficinas práticas</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-2 leading-relaxed">
                Laboratórios práticos focados em desenvolvimento, novas linguagens e ferramentas fundamentais do setor tecnológico.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none transition-all">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Palestras e apresentações</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-2 leading-relaxed">
                Diálogos inspiradores com palestrantes e apresentação de pesquisas inovadoras desenvolvidas no âmbito acadêmico.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none transition-all">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Award className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Certificados digitais</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-2 leading-relaxed">
                Comprovação digital imediata após a conclusão de atividades presenciais para enriquecer sua formação profissional.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none transition-all">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Inscrições por atividade</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-2 leading-relaxed">
                Reserve seu lugar nos workshops e painéis com facilidade, garantindo a sua grade de atividades personalizada.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none transition-all">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CalendarDays className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Programação organizada</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-2 leading-relaxed">
                Grade de horários clara e dividida para equilibrar palestras teóricas, oficinas dinâmicas e momentos livres.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none transition-all">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Target className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Experiências de integração</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-2 leading-relaxed">
                Atividades projetadas para estreitar laços entre estudantes, professores da instituição e comunidade acadêmica.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section id="programacao" className="py-20 bg-slate-50/50 dark:bg-[#050505]/10 border-b border-slate-200 dark:border-[#121212] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Agenda Completa</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Programação</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
              Navegue pelos dias e acompanhe a agenda detalhada de aberturas, oficinas, palestras e atividades de integração.
            </p>
          </div>

          
          <div className="flex flex-col items-center space-y-8">
            <div className="inline-flex p-1 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl gap-1 shadow-sm">
              {scheduleData.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    selectedDay === d.day
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Dia {d.day}
                </button>
              ))}
            </div>

            
            <div className="w-full max-w-3xl space-y-6">
              <div className="text-center lg:text-left border-b border-slate-200 dark:border-slate-900 pb-3 mb-6">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Edição Atual • </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{scheduleData[selectedDay - 1].date}</span>
              </div>

              <div className="relative border-l-2 border-slate-200 dark:border-slate-900 pl-6 ml-4 space-y-8">
                {scheduleData[selectedDay - 1].activities.map((activity, idx) => (
                  <div key={idx} className="relative group">
                    
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-50 dark:bg-black border-2 border-emerald-500 group-hover:scale-125 transition-transform" />
                    
                    <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] p-5 rounded-2xl space-y-3 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-[#2f2f2f] transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-650 dark:text-emerald-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{activity.time}</span>
                        </div>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                          {activity.type}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide">
                        {activity.title}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#121212]/80 pt-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="truncate">{activity.speaker}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-b border-slate-200 dark:border-[#121212]">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Guia Rápido</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Informações para participantes</h3>
          <p className="text-slate-650 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Descubra os passos necessários para aproveitar ao máximo a semana acadêmica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="p-5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 shadow-sm dark:shadow-none">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 font-mono text-sm">
              1
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Consulte a programação do evento</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Navegue pela lista completa de atividades e horários disponíveis na agenda para selecionar as que mais coincidem com sua formação de interesse.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 shadow-sm dark:shadow-none">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 font-mono text-sm">
              2
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Realize sua inscrição nas atividades disponíveis</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cadastre-se na área restrita e garanta sua vaga diretamente nas palestras e oficinas desejadas para assegurar a sua participação.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 shadow-sm dark:shadow-none">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 font-mono text-sm">
              3
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Acompanhe sua participação</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Consulte em seu espaço pessoal os detalhes de horários e locais das atividades nas quais obteve êxito na reserva de vaga.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl flex items-start gap-4 shadow-sm dark:shadow-none">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 font-mono text-sm">
              4
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Acesse seus certificados após as atividades</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Emita os certificados de participação oficiais com chave digital de validação assim que as presenças forem homologadas pela coordenação.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-slate-50/50 dark:bg-[#050505]/20 border-b border-slate-200 dark:border-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Comunidade</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Quem participa da SITEC</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
              Cada perfil desempenha um papel fundamental para enriquecer a experiência de aprendizado e colaboração.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] p-6 rounded-2xl space-y-4 shadow-md dark:shadow-none hover:border-slate-350 dark:hover:border-[#2f2f2f] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  <span>Participantes</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Discentes & Comunidade</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Acompanham a programação oficial, realizam inscrições nas oficinas práticas, participam de torneios e acessam seus certificados de forma simplificada.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] p-6 rounded-2xl space-y-4 shadow-md dark:shadow-none hover:border-slate-350 dark:hover:border-[#2f2f2f] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-blue-500/10 text-blue-605 dark:text-blue-400 border border-blue-500/20 rounded-lg uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Organizadores</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Docentes & Staff</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Acompanham o andamento de cada palestra e oficina, organizam o cronograma de horários e realizam o credenciamento de presença para a emissão oficial.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] p-6 rounded-2xl space-y-4 shadow-md dark:shadow-none hover:border-slate-350 dark:hover:border-[#2f2f2f] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-purple-500/10 text-purple-605 dark:text-purple-400 border border-purple-500/20 rounded-lg uppercase tracking-wider">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Palestrantes</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Convidados Especiais</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Participam ativamente compartilhando conteúdos valiosos, vivências acadêmicas, tendências profissionais e conduzindo workshops enriquecedores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-24 max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-outfit">
          Participe da SITEC
        </h2>
        <p className="text-slate-600 dark:text-slate-450 text-base max-w-xl mx-auto leading-relaxed">
          Explore a programação, acompanhe as atividades e aproveite a experiência do evento.
        </p>
        
        <div className="flex justify-center gap-4">
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
      </section>

      
      <footer className="bg-slate-100 dark:bg-[#050505] border-t border-slate-200 dark:border-[#121212] py-12 text-slate-600 dark:text-slate-400 text-xs font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-wider">SITEC</span>
            <p className="text-slate-500 dark:text-slate-500 leading-relaxed">
              Semana de Informática, Tecnologia e Integração Acadêmica
            </p>
            <p className="text-slate-500 dark:text-slate-500 font-bold">
              IFPR Câmpus Paranaguá
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Atividades</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Área do Participante</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">Contato</h4>
            <p>E-mail: sitec.paranagua@ifpr.edu.br</p>
            <p>Tel: (41) 3721-1200</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">Câmpus Paranaguá</h4>
            <p className="leading-relaxed">
              Rua Antônio Carlos Rodrigues, 453 - Porto Seguro, Paranaguá - PR, CEP 83215-750.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-550 dark:text-slate-500">
          <p>© {new Date().getFullYear()} SITEC - IFPR Câmpus Paranaguá. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="https://paranagua.ifpr.edu.br" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-650 dark:hover:text-emerald-400 transition-colors">
              Página do Câmpus
            </a>
            <a href="https://ifpr.edu.br" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-655 dark:hover:text-emerald-400 transition-colors">
              Portal IFPR
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
