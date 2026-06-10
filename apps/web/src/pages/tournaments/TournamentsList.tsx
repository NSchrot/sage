import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, ArrowRight, Plus, Award } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface Tournament {
  id: string;
  title: string;
  description: string;
  game: string;
  location: string;
  teamsCount: number;
  maxTeams: number;
  startsAt: string;
  status: 'EM_ANDAMENTO' | 'AGENDADO' | 'CONCLUIDO';
}

export const TournamentsList: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 'chess-2026',
      title: 'III Torneio de Xadrez Rápido IFPR',
      description: 'Olimpíada escolar de xadrez em formato suíço com tempo de reflexão de 10 min + 5 seg.',
      game: 'Xadrez',
      location: 'Biblioteca Central',
      teamsCount: 16,
      maxTeams: 16,
      startsAt: '2026-06-15T14:00',
      status: 'EM_ANDAMENTO',
    },
    {
      id: 'lol-2026',
      title: 'Campeonato de Programação Competitiva Maratona',
      description: 'Disputa de programação algorítmica em equipes de 3 estudantes utilizando C/C++/Java/Python.',
      game: 'Maratona Algoritmos',
      location: 'Laboratório de Informática 2',
      teamsCount: 8,
      maxTeams: 12,
      startsAt: '2026-06-20T08:00',
      status: 'AGENDADO',
    },
  ]);

  const getStatusBadge = (status: Tournament['status']) => {
    switch (status) {
      case 'EM_ANDAMENTO':
        return <Badge variant="success">Em Andamento</Badge>;
      case 'AGENDADO':
        return <Badge variant="info">Inscrições Abertas</Badge>;
      case 'CONCLUIDO':
        return <Badge variant="neutral">Concluído</Badge>;
    }
  };

  const handleCreateTournament = () => {
    alert('Nova competição acadêmica configurada!');
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Torneios e Competições</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gestão de chaves, equipes e chaveamentos das competições ativas do IFPR.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={handleCreateTournament}
        >
          Nova Competição
        </Button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((t) => (
          <Card
            key={t.id}
            variant="glow"
            title={
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <span>{t.title}</span>
              </div>
            }
            actions={getStatusBadge(t.status)}
            className="flex flex-col justify-between"
          >
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.description}
              </p>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Modalidade</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{t.game}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Local</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{t.location}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Equipes</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{t.teamsCount} / {t.maxTeams}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Início</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {new Date(t.startsAt).toLocaleDateString('pt-BR')} {new Date(t.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(`/admin/tournaments/${t.id}/matches`)}
              >
                Visualizar Partidas & Chaves
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
