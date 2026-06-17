import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toDataURL } from 'qrcode';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, ArrowLeft, AlertCircle, CheckCircle2, ClipboardList, Info, Mail, Award, QrCode, RefreshCw } from 'lucide-react';
import { LayoutAutenticado } from '../../components/layout/LayoutAutenticado';
import { Navbar } from '../../components/Navbar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  registrationDeadline: string;
  capacity: number;
  createdById: string;
  _count: {
    enrollments: number;
  };
  creator: {
    name: string;
    email: string;
  };
}

interface Enrollment {
  id: string;
  createdAt: string;
  attendanceConfirmedAt?: string | null;
  certificateIssuedAt?: string | null;
  certificateCode?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrExpiresAt, setQrExpiresAt] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [bulkCertificateLoading, setBulkCertificateLoading] = useState(false);

  const { isAuthenticated, isOrganizer, isParticipant, user, token } = useAuth();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const activityRes = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}`);
      if (!activityRes.ok) {
        if (activityRes.status === 404) throw new Error('Atividade não encontrada.');
        throw new Error('Erro ao carregar detalhes da atividade.');
      }
      const activityData = await activityRes.json();
      setActivity(activityData);

      if (isAuthenticated && isOrganizer && token) {
        const enrollRes = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}/enrollments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (enrollRes.ok) {
          const enrollData = await enrollRes.json();
          setEnrollments(enrollData);
        }
      }

      if (isAuthenticated && isParticipant && token) {
        const myEnrollRes = await fetch(`${import.meta.env.VITE_API_URL}/my-enrollments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (myEnrollRes.ok) {
          const myEnrollData = await myEnrollRes.json();
          const activeEnrollment = myEnrollData.find(
            (e: any) => e.activityId === id && e.status === 'ATIVA'
          );
          setIsEnrolled(!!activeEnrollment);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, isAuthenticated, isOrganizer, isParticipant, token]);

  const fetchAttendanceQr = async () => {
    if (!id || !token) return;

    setQrLoading(true);
    setQrError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}/attendance-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao gerar QR Code.');
      }

      const confirmUrl = `${window.location.origin}/attendance/confirm?token=${encodeURIComponent(data.token)}`;
      const dataUrl = await toDataURL(confirmUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });

      setQrCodeUrl(dataUrl);
      setQrExpiresAt(data.expiresAt);
    } catch (err: any) {
      setQrError(err.message || 'Erro ao gerar QR Code.');
    } finally {
      setQrLoading(false);
    }
  };

  useEffect(() => {
    if (!activity || !isAuthenticated || !isOrganizer || user?.id !== activity.createdById) return;

    fetchAttendanceQr();
    const interval = window.setInterval(fetchAttendanceQr, 45000);

    return () => window.clearInterval(interval);
  }, [activity?.id, isAuthenticated, isOrganizer, token, user?.id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id || !token) return;

    setActionError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}/enroll`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao se inscrever.');
      }
      
      setIsEnrolled(true);
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!id || !token) return;

    setActionError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao cancelar inscrição.');
      }

      setIsEnrolled(false);
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleToggleAttendance = async (enrollment: Enrollment) => {
    if (!token) return;

    setActionError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/enrollments/${enrollment.id}/attendance`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ present: !enrollment.attendanceConfirmedAt })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao homologar presença.');
      }

      setEnrollments(prev => prev.map(item => item.id === data.id ? data : item));
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleIssueCertificate = async (enrollment: Enrollment) => {
    if (!token) return;

    setActionError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/enrollments/${enrollment.id}/certificate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao emitir certificado.');
      }

      setEnrollments(prev => prev.map(item => item.id === data.id ? data : item));
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleIssueAllCertificates = async () => {
    if (!id || !token) return;

    setActionError(null);
    setActionMessage(null);
    setBulkCertificateLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}/certificates`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao emitir certificados em lote.');
      }

      if (data.issuedCount === 0) {
        setActionMessage('Não há certificados pendentes para participantes presentes.');
        return;
      }

      setEnrollments(prev => prev.map(item => data.enrollments.find((updated: Enrollment) => updated.id === item.id) ?? item));
      setActionMessage(`${data.issuedCount} certificado(s) emitido(s) com sucesso.`);
    } catch (err: any) {
      setActionError(err.message || 'Erro ao emitir certificados em lote.');
    } finally {
      setBulkCertificateLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Oops! Algo deu errado</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">{error || 'Atividade não encontrada.'}</p>
        <Link
          to="/activities"
          className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Atividades
        </Link>
      </div>
    );
  }

  const activeEnrollments = activity._count.enrollments;
  const spotsLeft = Math.max(0, activity.capacity - activeEnrollments);
  const isFull = spotsLeft === 0;
  const isCreator = user?.id === activity.createdById;
  const enrollmentClosed = new Date() > new Date(activity.registrationDeadline);
  const pendingCertificatesCount = enrollments.filter(enroll => enroll.attendanceConfirmedAt && !enroll.certificateIssuedAt).length;

  const pageBody = (
    <div className={`${!isAuthenticated ? 'max-w-5xl mx-auto px-4 sm:px-6 py-10' : 'space-y-6'}`}>
      
      {!isAuthenticated && (
        <Link
          to="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Atividades
        </Link>
      )}

      {actionError && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {actionMessage && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-xl text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{actionMessage}</span>
        </div>
      )}

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        
        <div className="lg:col-span-2 space-y-6">
          <Card
            variant="default"
            title={activity.title}
            subtitle={`Organizador: ${activity.creator.name} (${activity.creator.email})`}
          >
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
                <Info className="w-4 h-4 text-emerald-400" />
                Descrição da Atividade
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                {activity.description}
              </p>
            </div>
          </Card>
        </div>

        
        <div className="space-y-6">
          <Card variant="glow" title="Informações Gerais">
            <div className="space-y-5">
              <div className="flex gap-3 text-xs">
                <Calendar className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Horário</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block capitalize">
                    {formatDateTime(activity.startsAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <MapPin className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Local</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                    {activity.location}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vagas e Ocupação</span>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-1 items-center">
                    <span>{activeEnrollments} de {activity.capacity} inscritos</span>
                    {isFull ? (
                      <Badge variant="danger">Esgotado</Badge>
                    ) : (
                      <Badge variant="success">{spotsLeft} vagas</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <Calendar className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Prazo de Inscrição</span>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-1 items-center">
                    <span>{formatDateTime(activity.registrationDeadline)}</span>
                    <Badge variant={enrollmentClosed ? 'danger' : 'success'}>
                      {enrollmentClosed ? 'Encerrado' : 'Aberto'}
                    </Badge>
                  </div>
                </div>
              </div>

              
              <div className="pt-4 border-t border-slate-800/80">
                {isParticipant && (
                  <>
                    {isEnrolled ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-semibold select-none">
                          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                          Você está inscrito!
                        </div>
                        <Button
                          variant="danger"
                          className="w-full text-xs font-semibold py-2.5"
                          disabled={enrollmentClosed}
                          onClick={handleCancelEnrollment}
                        >
                          {enrollmentClosed ? 'Cancelamento Encerrado' : 'Cancelar Inscrição'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        disabled={isFull || enrollmentClosed}
                        className="w-full text-xs font-semibold py-2.5"
                        onClick={handleEnroll}
                      >
                        {enrollmentClosed ? 'Inscrições Encerradas' : isFull ? 'Sem Vagas' : 'Realizar Inscrição'}
                      </Button>
                    )}
                  </>
                )}

                {!isAuthenticated && (
                  <Button
                    variant="primary"
                    className="w-full text-xs font-semibold py-2.5"
                    onClick={() => navigate('/login')}
                  >
                    Entrar para se Inscrever
                  </Button>
                )}

                {isOrganizer && !isCreator && (
                  <div className="p-3 bg-slate-950 border border-slate-850 text-slate-500 text-[11px] font-medium rounded-xl flex items-start gap-2.5 leading-relaxed">
                    <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                    <span>Conectado como Organizador. Apenas participantes podem realizar inscrições.</span>
                  </div>
                )}
                
                {isOrganizer && isCreator && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[11px] font-semibold rounded-xl flex items-start gap-2.5 leading-relaxed">
                    <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>Você é o organizador desta banca. Visualize a lista de inscritos abaixo.</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {isOrganizer && isCreator && (
            <Card
              variant="default"
              title={
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span>QR Code de Presença</span>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white p-4 flex items-center justify-center min-h-[248px]">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code para confirmação de presença" className="w-60 h-60" />
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {qrLoading ? 'Gerando QR Code...' : 'QR Code indisponível'}
                    </div>
                  )}
                </div>

                {qrError ? (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{qrError}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Participantes inscritos escaneiam este código com a câmera do celular para confirmar presença. O QR expira e renova automaticamente a cada minuto.
                  </p>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                    {qrExpiresAt ? `Válido até ${new Date(qrExpiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Aguardando geração'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={qrLoading}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={fetchAttendanceQr}
                  >
                    Renovar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      
      {isOrganizer && isCreator && (
        <Card
          variant="default"
          title={
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-400" />
              <span>Participantes Inscritos ({enrollments.length})</span>
            </div>
          }
          actions={
            <Button
              variant="primary"
              size="sm"
              icon={<Award className="w-3.5 h-3.5" />}
              loading={bulkCertificateLoading}
              disabled={pendingCertificatesCount === 0}
              onClick={handleIssueAllCertificates}
            >
              Emitir presentes ({pendingCertificatesCount})
            </Button>
          }
        >
          {enrollments.length === 0 ? (
            <div className="p-8 bg-slate-950 border border-slate-850 rounded-xl text-center text-slate-500 text-xs font-medium">
              Nenhum aluno se inscreveu nesta atividade ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-4">Nome</th>
                    <th className="pb-3">E-mail</th>
                    <th className="pb-3">Presença</th>
                    <th className="pb-3">Certificado</th>
                    <th className="pb-3 pr-4 text-right">Inscrito em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs text-slate-200">
                  {enrollments.map((enroll) => (
                    <tr key={enroll.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="py-3.5 pl-4 font-bold">{enroll.user.name}</td>
                      <td className="py-3.5 text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {enroll.user.email}
                      </td>
                      <td className="py-3.5">
                        <Button
                          variant={enroll.attendanceConfirmedAt ? 'secondary' : 'outline'}
                          size="sm"
                          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          onClick={() => handleToggleAttendance(enroll)}
                        >
                          {enroll.attendanceConfirmedAt ? 'Presente' : 'Confirmar'}
                        </Button>
                      </td>
                      <td className="py-3.5">
                        <Button
                          variant={enroll.certificateIssuedAt ? 'secondary' : 'primary'}
                          size="sm"
                          disabled={!enroll.attendanceConfirmedAt}
                          icon={<Award className="w-3.5 h-3.5" />}
                          onClick={() => handleIssueCertificate(enroll)}
                        >
                          {enroll.certificateIssuedAt ? 'Emitido' : 'Emitir'}
                        </Button>
                      </td>
                      <td className="py-3.5 pr-4 text-right text-slate-400">
                        {new Date(enroll.createdAt).toLocaleDateString('pt-BR')} {new Date(enroll.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );

  if (isAuthenticated) {
    return <LayoutAutenticado>{pageBody}</LayoutAutenticado>;
  }

  return (
    <>
      <Navbar />
      {pageBody}
    </>
  );
};
