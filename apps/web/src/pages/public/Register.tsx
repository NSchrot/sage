import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Navbar } from '../../components/Navbar';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PARTICIPANTE' | 'ORGANIZADOR'>('PARTICIPANTE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar cadastro');
      }

      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-black transition-colors duration-300">
        <Card variant="glow" className="w-full max-w-md bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit">
              Criar Conta Acadêmica
            </h1>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 font-medium">
              Faça sua inscrição em bancas, oficinas e certificados IFPR
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              required
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="E-mail Acadêmico"
              type="email"
              required
              placeholder="exemplo@ifpr.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Senha"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<KeyRound className="w-4 h-4" />}
            />

            
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tipo de Acesso (Perfil)
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setRole('PARTICIPANTE')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    role === 'PARTICIPANTE'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                  }`}
                >
                  Participante
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ORGANIZADOR')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    role === 'ORGANIZADOR'
                      ? 'bg-violet-500/10 text-violet-650 dark:text-violet-400 border-violet-500/20 shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                  }`}
                >
                  Organizador
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full text-xs font-semibold py-2.5 mt-4"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Criar Conta Acadêmica
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 font-medium">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-550 dark:hover:text-emerald-300 font-bold hover:underline transition-colors">
              Fazer Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  </>
  );
};
