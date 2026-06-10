import React from 'react';
import { BarChart3, FileSpreadsheet, Download, Calendar, Users, Award, TrendingUp } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const Reports: React.FC = () => {
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Relatório exportado em formato ${format.toUpperCase()} com sucesso!`);
  };

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
          <Button variant="outline" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={() => handleExport('csv')}>
            Exportar CSV
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => handleExport('pdf')}>
            Exportar PDF
          </Button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        
        <Card variant="default">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-550 dark:text-slate-500 uppercase font-bold tracking-wider block">Total Participantes</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">142</span>
            </div>
          </div>
        </Card>

        
        <Card variant="default">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-550 dark:text-slate-500 uppercase font-bold tracking-wider block">Certificados Homologados</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">118</span>
            </div>
          </div>
        </Card>

        
        <Card variant="default">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-550 dark:text-slate-500 uppercase font-bold tracking-wider block">Taxa de Presença</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">83.1%</span>
            </div>
          </div>
        </Card>

      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-6 shadow-sm dark:shadow-none space-y-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adesão por Oficina (Inscrições)</h3>
          
          <div className="space-y-4">
            
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Workshop de React e Tailwind v4</span>
                <span>30 / 30 Inscritos (100%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                <div className="bg-emerald-600 dark:bg-emerald-500 h-full w-[100%]" />
              </div>
            </div>

            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Maratona de Programação Interna</span>
                <span>28 / 30 Inscritos (93%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                <div className="bg-emerald-600 dark:bg-emerald-500 h-full w-[93%]" />
              </div>
            </div>

            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Apresentação de TCC - Computação</span>
                <span>15 / 30 Inscritos (50%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                <div className="bg-emerald-600 dark:bg-emerald-500 h-full w-[50%]" />
              </div>
            </div>

          </div>
        </div>

        
        <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-6 shadow-sm dark:shadow-none space-y-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resumo por Categoria</h3>
          
          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Palestras</span>
              <span className="font-bold text-slate-900 dark:text-white">4 palestras</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Oficinas</span>
              <span className="font-bold text-slate-900 dark:text-white">6 oficinas</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
              <span className="text-slate-550 dark:text-slate-400">Bancas TCC</span>
              <span className="font-bold text-slate-900 dark:text-white">12 bancas</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
