import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface ConfirmedEnrollment {
  attendanceConfirmedAt: string | null;
  activity: {
    title: string;
    startsAt: string;
    endsAt: string;
  };
}

export const AttendanceConfirm: React.FC = () => {
  const location = useLocation();
  const { token: authToken, isAuthenticated, isParticipant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedEnrollment | null>(null);

  const qrToken = useMemo(() => new URLSearchParams(location.search).get('token'), [location.search]);
  const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);

  useEffect(() => {
    const confirmAttendance = async () => {
      if (!qrToken || !authToken || !isParticipant) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/attendance/confirm`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: qrToken })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Erro ao confirmar presença.');
        }

        setConfirmed(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao confirmar presença.');
      } finally {
        setLoading(false);
      }
    };

    confirmAttendance();
  }, [qrToken, authToken, isParticipant]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center px-4 py-12">
      <Card variant="glow" className="w-full max-w-md text-center p-8">
        {!qrToken ? (
          <>
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">QR Code inválido</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Abra novamente o QR Code exibido pelo organizador da atividade.
            </p>
          </>
        ) : !isAuthenticated ? (
          <>
            <LogIn className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">Entre para confirmar</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-6">
              Faça login como participante para registrar sua presença nesta atividade.
            </p>
            <Link to={`/login?redirect=${redirectTo}`}>
              <Button variant="primary" icon={<LogIn className="w-4 h-4" />}>
                Entrar e confirmar
              </Button>
            </Link>
          </>
        ) : !isParticipant ? (
          <>
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">Perfil incompatível</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              A presença por QR Code deve ser confirmada por uma conta de participante.
            </p>
          </>
        ) : loading ? (
          <>
            <Clock className="w-12 h-12 text-teal-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">Confirmando presença</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Aguarde enquanto validamos sua inscrição.
            </p>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">Não foi possível confirmar</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{error}</p>
          </>
        ) : confirmed ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">Presença confirmada</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Sua presença foi registrada em <strong>{confirmed.activity.title}</strong>.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
              {formatDateTime(confirmed.activity.startsAt)}
            </p>
            <Link to="/my-enrollments" className="inline-flex mt-6">
              <Button variant="outline" size="sm">
                Ver minhas inscrições
              </Button>
            </Link>
          </>
        ) : null}
      </Card>
    </div>
  );
};
