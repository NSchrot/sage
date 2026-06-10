import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, CheckCircle, Clock, Calendar, ShieldCheck, Printer } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface Enrollment {
  id: string;
  status: 'ATIVA' | 'CANCELADA';
  activity: {
    id: string;
    title: string;
    startsAt: string;
    location: string;
  };
}

export const Certificates: React.FC = () => {
  const { token, user } = useAuth();
  const [completedEnrollments, setCompletedEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Enrollment | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/my-enrollments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const active = data.filter((e: any) => e.status === 'ATIVA');
          setCompletedEnrollments(active);
          if (active.length > 0) {
            setSelectedCert(active[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">Meus Certificados</h1>
        <p className="text-sm text-slate-650 dark:text-slate-400 mt-1">
          Confira e emita os certificados de participação homologados nas atividades da SITEC do IFPR.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
        </div>
      ) : completedEnrollments.length === 0 ? (
        <Card variant="default" className="text-center py-12">
          <Award className="w-12 h-12 text-slate-400 dark:text-slate-650 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum certificado homologado</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Seus certificados de participação aparecerão aqui assim que sua presença for homologada em alguma atividade concluída.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Histórico de Eventos</h3>
            <div className="space-y-3">
              {completedEnrollments.map((enroll) => (
                <button
                  key={enroll.id}
                  onClick={() => setSelectedCert(enroll)}
                  className={`w-full text-left p-4.5 bg-white dark:bg-[#0c0c0c] border rounded-2xl transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    selectedCert?.id === enroll.id
                      ? 'border-emerald-500/50 bg-slate-50/50 dark:bg-[#0c0c0c]/80 shadow-lg shadow-emerald-500/5'
                      : 'border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{enroll.activity.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-emerald-500" /> 4 Horas</span>
                      <span>{new Date(enroll.activity.startsAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <Badge variant={selectedCert?.id === enroll.id ? 'success' : 'neutral'}>Ativo</Badge>
                </button>
              ))}
            </div>
          </div>

          
          <div className="lg:col-span-8 space-y-6">
            {selectedCert && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Visualização do Documento</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
                      Imprimir
                    </Button>
                    <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => alert('Certificado baixado como PDF simulado!')}>
                      Download PDF
                    </Button>
                  </div>
                </div>

                
                <div className="bg-white dark:bg-[#0c0c0c] border-4 border-double border-emerald-600/30 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[480px] print:bg-white print:text-black print:border-black print:shadow-none">
                  
                  <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-600/30 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-600/30 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-600/30 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-600/30 pointer-events-none" />
                  
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.02] pointer-events-none">
                    <Award className="w-96 h-96 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  
                  <div className="text-center space-y-2 relative z-10 border-b border-slate-200 dark:border-slate-900 pb-5 print:border-slate-300">
                    <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest print:text-emerald-700">Instituto Federal do Paraná</h2>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider font-outfit print:text-black">Câmpus Paranaguá - Certificado Oficial</h3>
                  </div>

                  
                  <div className="text-center py-8 space-y-6 relative z-10">
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest print:text-slate-600">Certifica-se que</p>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-outfit print:text-black">{user?.name}</h4>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto print:text-slate-700">
                      participou com aproveitamento na atividade acadêmica complementar{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-bold print:text-black">"{selectedCert.activity.title}"</strong>,{' '}
                      realizada em <strong className="text-slate-800 dark:text-slate-200 font-bold print:text-black">{new Date(selectedCert.activity.startsAt).toLocaleDateString('pt-BR')}</strong>{' '}
                      no local <strong className="text-slate-800 dark:text-slate-200 font-bold print:text-black">"{selectedCert.activity.location}"</strong>,{' '}
                      com carga horária total homologada de <strong className="text-slate-800 dark:text-slate-200 font-bold print:text-black">04 horas</strong> complementares.
                    </p>
                  </div>

                  
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-900 pt-6 text-center relative z-10 print:border-slate-300">
                    <div className="space-y-1">
                      <div className="h-6 w-32 border-b border-slate-200 dark:border-slate-800 mx-auto print:border-slate-350" />
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider print:text-slate-600">Direção Acadêmica IFPR</span>
                    </div>

                    <div className="space-y-1 flex flex-col justify-end items-center">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold select-none bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded print:border-black print:text-black">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Homologado</span>
                      </div>
                      <span className="text-[8px] text-slate-500 font-mono tracking-tighter truncate max-w-[150px] print:text-slate-600">
                        SHA256: {selectedCert.id.substring(0, 8).toUpperCase()}-SITEC-IFPR
                      </span>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
