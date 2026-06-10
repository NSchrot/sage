import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/Navbar';

export const Recovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card variant="glow" className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="relative">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-outfit">
                Recuperar Senha
              </h1>
              <p className="text-xs text-slate-400 mt-2">
                Informe seu e-mail cadastrado para receber as instruções de acesso da SITEC.
              </p>
            </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <Send className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">E-mail de Recuperação Enviado!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Enviamos as instruções para <strong className="text-slate-300 font-semibold">{email}</strong>. Verifique sua caixa de entrada e spam.
                </p>
              </div>
              <Link to="/login" className="block pt-4">
                <Button variant="outline" size="sm" className="w-full" icon={<ArrowLeft className="w-4 h-4" />}>
                  Voltar para o Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="E-mail Acadêmico"
                type="email"
                required
                placeholder="exemplo@ifpr.edu.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full text-xs font-semibold py-2.5"
                icon={<Send className="w-4 h-4" />}
              >
                Enviar Instruções
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar para o Login
                </Link>
              </div>
            </form>
          )}
        </div>
        </Card>
      </div>
    </>
  );
};
