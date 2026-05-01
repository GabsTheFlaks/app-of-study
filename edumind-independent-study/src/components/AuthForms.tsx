import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthForms: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstname,
              last_name: formData.lastname,
            }
          }
        });
        if (error) throw error;
        alert('Registro concluído! Você já pode fazer login (ou verifique seu email se o Supabase exigir).');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] bg-white p-10 rounded shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
          <GraduationCap className="text-white" size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-none">EduMind</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Portal de Acesso</p>
        </div>
      </div>
      
      <p className="text-gray-500 mb-8 text-xs font-medium leading-relaxed">
        {isLogin ? 'Faça login para continuar sua trilha de aprendizado.' : 'Junte-se à nossa comunidade de estudantes independentes.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nome</label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                value={formData.firstname}
                onChange={e => setFormData({ ...formData, firstname: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sobrenome</label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                value={formData.lastname}
                onChange={e => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
          <input
            type="email"
            required
            className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Senha</label>
          <input
            type="password"
            required
            className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded border border-red-100">{error.toUpperCase()}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2.5 rounded shadow-sm transition-all transform active:scale-[0.98] mt-4 text-[11px] uppercase tracking-widest"
        >
          {loading ? 'Aguarde...' : (isLogin ? 'Entrar no Sistema' : 'Criar Conta')}
        </button>
      </form>

      <div className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
        {isLogin ? (
          <>
            Novo por aqui?{' '}
            <button onClick={() => setIsLogin(false)} className="text-indigo-600 hover:underline">
              Registrar
            </button>
          </>
        ) : (
          <>
            Já possui acesso?{' '}
            <button onClick={() => setIsLogin(true)} className="text-indigo-600 hover:underline">
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};
