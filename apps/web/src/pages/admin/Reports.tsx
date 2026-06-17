import React, { useEffect, useState } from 'react';
import { AlertCircle, BarChart3, Calendar, Download, FileSpreadsheet, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface ReportActivity {
  id: string;
  title: string;
  startsAt: string;
  capacity: number;
  activeEnrollments: number;
  occupancyRate: number;
}

interface ReportSummary {
  participantsTotal: number;
  organizersTotal: number;
  activitiesTotal: number;
  activeEnrollmentsTotal: number;
  attendancesConfirmedTotal: number;
  certificatesIssuedTotal: number;
  capacityTotal: number;
  occupancyRate: number;
  activities: ReportActivity[];
}

export const Reports: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/reports/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao carregar relatórios.');
      }

      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar relatórios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
    }
  }, [token]);

  const handleExportCsv = () => {
    if (!summary) return;

    const header = ['Atividade', 'Inscritos ativos', 'Capacidade', 'Ocupacao (%)', 'Inicio'];
    const rows = summary.activities.map(activity => [
      activity.title,
      activity.activeEnrollments,
      activity.capacity,
      activity.occupancyRate,
      new Date(activity.startsAt).toLocaleString('pt-BR')
    ]);
    const csv = [header, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-sage.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const topActivities = summary?.activities.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Relatórios Acadêmicos</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Geração de relatórios de aderência, controle de presenças e horas complementares emitidas.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={handleExportCsv} disabled={!summary}>
            Exportar CSV
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => window.print()} disabled={!summary}>
            Imprimir
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : error ? (
        <Card variant="default" className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Falha ao carregar relatórios</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchSummary} className="mt-4">
            Tentar Novamente
          </Button>
        </Card>
      ) : summary && (
      <>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        
        <Card variant="default">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-550 dark:text-slate-500 uppercase font-bold tracking-wider block">Total Participantes</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">{summary.participantsTotal}</span>
            </div>
          </div>
        </Card>

        
        <Card variant="default">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-550 dark:text-slate-500 uppercase font-bold tracking-wider block">Presenças Homologadas</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">{summary.attendancesConfirmedTotal}</span>
            </div>
          </div>
        </Card>

        
        <Card variant="default">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-550 dark:text-slate-500 uppercase font-bold tracking-wider block">Certificados Emitidos</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">{summary.certificatesIssuedTotal}</span>
            </div>
          </div>
        </Card>

      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-6 shadow-sm dark:shadow-none space-y-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adesão por Oficina (Inscrições)</h3>
          
          <div className="space-y-4">
            {topActivities.length === 0 ? (
              <p className="text-xs text-slate-550 dark:text-slate-400">Nenhuma atividade cadastrada para compor o relatório.</p>
            ) : topActivities.map(activity => (
              <div key={activity.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{activity.title}</span>
                  <span>{activity.activeEnrollments} / {activity.capacity} inscritos ({activity.occupancyRate}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-500 h-full"
                    style={{ width: `${Math.min(100, activity.occupancyRate)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-6 shadow-sm dark:shadow-none space-y-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resumo por Categoria</h3>
          
          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Inscrições ativas</span>
              <span className="font-bold text-slate-900 dark:text-white">{summary.activeEnrollmentsTotal}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Atividades</span>
              <span className="font-bold text-slate-900 dark:text-white">{summary.activitiesTotal}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Ocupação geral</span>
              <span className="font-bold text-slate-900 dark:text-white">{summary.occupancyRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Capacidade total</span>
              <span className="font-bold text-slate-900 dark:text-white">{summary.capacityTotal}</span>
            </div>
          </div>
        </div>

      </div>
      </>
      )}
    </div>
  );
};
