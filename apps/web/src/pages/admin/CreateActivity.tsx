import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, ArrowLeft, AlertCircle, Save } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const CreateActivity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [capacity, setCapacity] = useState<number>(30);
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  
  const { token, isAuthenticated, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const formatISOToInput = (isoString: string) => {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!isAuthenticated || !isOrganizer) {
      navigate('/login');
      return;
    }

    const fetchActivity = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/${id}`);
        if (!res.ok) {
          throw new Error('Falha ao carregar dados da atividade.');
        }
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setCapacity(data.capacity);
        setStartsAt(formatISOToInput(data.startsAt));
        setEndsAt(formatISOToInput(data.endsAt));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes.');
      } finally {
        setFetchLoading(false);
      }
    };

    if (isEditMode) {
      fetchActivity();
    }
  }, [id, isEditMode, isAuthenticated, isOrganizer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (new Date(startsAt) >= new Date(endsAt)) {
      setError('A data de fim deve ser posterior à data de início.');
      setLoading(false);
      return;
    }

    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/activities/${id}`
        : `${import.meta.env.VITE_API_URL}/activities`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          location,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
          capacity: Number(capacity)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao salvar atividade.');
      }

      navigate('/admin/activities');
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/admin/activities"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Painel Admin
      </Link>

      <Card
        variant="default"
        title={isEditMode ? 'Editar Atividade' : 'Nova Atividade Acadêmica'}
        subtitle="Cadastre bancas de TCC, oficinas ou palestras do Câmpus IFPR"
      >
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Título da Atividade / Oficina"
            required
            placeholder="Ex: Apresentação de TCC - Ciências Exatas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Descrição da Atividade
            </label>
            <textarea
              required
              rows={4}
              placeholder="Descreva a atividade, palestrantes, requisitos ou cronograma..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-[#040404] border border-slate-250 dark:border-[#1f1f1f] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all outline-none resize-none leading-relaxed placeholder-slate-400 dark:placeholder-slate-600"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Local"
              required
              placeholder="Ex: Sala 202 - Bloco B"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
            />

            <Input
              label="Capacidade (Vagas)"
              type="number"
              required
              min={1}
              placeholder="Ex: 30"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              icon={<Users className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Horário de Início
              </label>
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full bg-white dark:bg-[#040404] border border-slate-255 dark:border-[#1f1f1f] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-505 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Horário de Fim
              </label>
              <input
                type="datetime-local"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full bg-white dark:bg-[#040404] border border-slate-255 dark:border-[#1f1f1f] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-all outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full text-xs font-semibold py-2.5 mt-4"
            icon={<Save className="w-4.5 h-4.5" />}
          >
            {isEditMode ? 'Atualizar Atividade' : 'Cadastrar Atividade'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
