import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Navbar } from '../../components/Navbar';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar login');
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (type: 'admin' | 'organizer' | 'participant') => {
    if (type === 'admin') {
      setEmail('admin@sage.com');
    } else if (type === 'organizer') {
      setEmail('organizador@sage.com');
    } else {
      setEmail('participante@sage.com');
    }
    setPassword('password123');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-black transition-colors duration-300">
        <Card variant="glow" className="w-full max-w-md bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="relative">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit">
                Área do Participante
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                SITEC • Câmpus Paranaguá
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="E-mail Institucional"
                type="email"
                required
                placeholder="exemplo@ifpr.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Senha
                  </label>
                  <Link to="/recovery" className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-semibold transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-[#040404] border border-slate-250 dark:border-[#1f1f1f] focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none placeholder-slate-400 dark:placeholder-slate-650"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full text-xs font-semibold py-2.5 mt-2"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Entrar
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3.5 text-center">
                Acesso Rápido para Avaliação (TCC)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleFillCredentials('admin')}
                  className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 px-3.5 py-2.5 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all flex flex-col items-center cursor-pointer"
                >
                  <span className="text-sky-600 dark:text-sky-400 mb-0.5">Admin</span>
                  <span className="text-[9px] text-slate-500 font-medium">Acessos & Perfis</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('organizer')}
                  className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 px-3.5 py-2.5 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all flex flex-col items-center cursor-pointer"
                >
                  <span className="text-violet-600 dark:text-violet-400 mb-0.5">Organizador</span>
                  <span className="text-[9px] text-slate-500 font-medium">Bancas & Oficinas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('participant')}
                  className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 px-3.5 py-2.5 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all flex flex-col items-center cursor-pointer"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 mb-0.5">Participante</span>
                  <span className="text-[9px] text-slate-500 font-medium">Inscrições & Aluno</span>
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 font-medium">
              Ainda não tem conta?{' '}
              <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-550 dark:hover:text-emerald-300 font-bold hover:underline transition-colors">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
