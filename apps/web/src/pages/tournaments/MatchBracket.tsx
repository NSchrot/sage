import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Sword, Play } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface Match {
  id: string;
  round: 'quartas' | 'semi' | 'final';
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: 1 | 2;
  status: 'AGENDADO' | 'CONCLUIDO';
}

export const MatchBracket: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [matches, setMatches] = useState<Match[]>([
    { id: 'q1', round: 'quartas', team1: 'Equipe Turing', team2: 'Data Wizards', score1: 3, score2: 1, winner: 1, status: 'CONCLUIDO' },
    { id: 'q2', round: 'quartas', team1: 'Cyber Gladiators', team2: 'Lovelace Squad', score1: 0, score2: 2, winner: 2, status: 'CONCLUIDO' },
    { id: 'q3', round: 'quartas', team1: 'Binary Beasts', team2: 'Kernel Hackers', score1: 2, score2: 3, winner: 2, status: 'CONCLUIDO' },
    { id: 'q4', round: 'quartas', team1: 'DevOps Knights', team2: 'Bug Hunters', score1: 1, score2: 2, winner: 2, status: 'CONCLUIDO' },
    
    { id: 's1', round: 'semi', team1: 'Equipe Turing', team2: 'Lovelace Squad', score1: 2, score2: 3, winner: 2, status: 'CONCLUIDO' },
    { id: 's2', round: 'semi', team1: 'Kernel Hackers', team2: 'Bug Hunters', score1: 1, score2: 0, winner: 1, status: 'CONCLUIDO' },
    
    { id: 'f1', round: 'final', team1: 'Lovelace Squad', team2: 'Kernel Hackers', status: 'AGENDADO' },
  ]);

  const runMatchSimulation = (matchId: string) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id === matchId && m.status === 'AGENDADO') {
          const s1 = Math.floor(Math.random() * 4);
          const s2 = Math.floor(Math.random() * 4);
          const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : Math.random() > 0.5 ? 1 : 2;
          return {
            ...m,
            score1: s1,
            score2: s2,
            winner,
            status: 'CONCLUIDO'
          };
        }
        return m;
      })
    );
  };

  const renderMatchCard = (match: Match) => {
    const isCompleted = match.status === 'CONCLUIDO';
    
    return (
      <div
        key={match.id}
        className={`bg-white dark:bg-[#0c0c0c] border rounded-2xl p-4.5 space-y-3 transition-all relative ${
          match.round === 'final' ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Partida {match.id.toUpperCase()}</span>
          {isCompleted ? (
            <Badge variant="success">Finalizado</Badge>
          ) : (
            <Badge variant="warning">Próxima</Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs ${isCompleted && match.winner === 2 ? 'text-slate-450 dark:text-slate-500 font-medium' : 'text-slate-800 dark:text-slate-200 font-bold'}`}>
            {match.team1}
          </span>
          {isCompleted && (
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${match.winner === 1 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-550'}`}>
              {match.score1}
            </span>
          )}
        </div>

        
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-655 font-bold select-none justify-center">
          <span className="h-[1px] bg-slate-100 dark:bg-slate-850 flex-grow" />
          <Sword className="w-3.5 h-3.5" />
          <span className="h-[1px] bg-slate-100 dark:bg-slate-850 flex-grow" />
        </div>

        
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isCompleted && match.winner === 1 ? 'text-slate-450 dark:text-slate-500 font-medium' : 'text-slate-800 dark:text-slate-200 font-bold'}`}>
            {match.team2}
          </span>
          {isCompleted && (
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${match.winner === 2 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-550'}`}>
              {match.score2}
            </span>
          )}
        </div>

        
        {!isCompleted && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px] py-1 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900"
              icon={<Play className="w-3 h-3 text-emerald-650 dark:text-emerald-400" />}
              onClick={() => runMatchSimulation(match.id)}
            >
              Simular Resultado
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/tournaments"
            className="p-2 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Chaveamento do Torneio</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Fase eliminatória: oitavas, quartas, semi e grande final.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300">
          <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Premiação: Medalha de Ouro IFPR</span>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-neutral-50 dark:bg-[#0a0a0a] p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-[#1a1a1a] relative">
        
        <div className="hidden md:block absolute inset-0 opacity-10 pointer-events-none" />

        
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest text-center border-b border-slate-200 dark:border-slate-900 pb-2">
            Quartas de Final
          </h3>
          <div className="space-y-4">
            {matches.filter(m => m.round === 'quartas').map(renderMatchCard)}
          </div>
        </div>

        
        <div className="space-y-6 md:pt-16">
          <h3 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest text-center border-b border-slate-200 dark:border-slate-900 pb-2">
            Semifinal
          </h3>
          <div className="space-y-12">
            {matches.filter(m => m.round === 'semi').map(renderMatchCard)}
          </div>
        </div>

        
        <div className="space-y-6 md:pt-36">
          <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center border-b border-emerald-950/60 pb-2">
            Grande Final
          </h3>
          <div className="space-y-16">
            {matches.filter(m => m.round === 'final').map(renderMatchCard)}
          </div>
        </div>
      </div>
    </div>
  );
};
