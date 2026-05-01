import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, GraduationCap } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthForms: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstname: '',
    lastname: ''
  });
  const [error, setError] = useState('');
  const { login: setAuthLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          setAuthLogin(data.user.username, data.user.userId);
        } else {
          setIsLogin(true);
          alert('Registro concluído! Agora você pode fazer login.');
        }
      } else {
        setError(data.message || 'Erro na autenticação');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
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
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Usuário</label>
          <input
            type="text"
            required
            className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />
        </div>

        {!isLogin && (
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
        )}

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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded shadow-sm transition-all transform active:scale-[0.98] mt-4 text-[11px] uppercase tracking-widest"
        >
          {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
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
