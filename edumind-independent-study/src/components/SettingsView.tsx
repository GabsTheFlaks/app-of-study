import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Save, User, Bell, Shield, Palette, Settings } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('perfil');

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="shrink-0 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <div className="h-1.5 w-16 bg-slate-800 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Configurações</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">GERENCIE SUA CONTA E PREFERÊNCIAS</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded text-xs font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2 self-start sm:self-auto">
            <Save size={14} /> Salvar
          </button>
        </div>

        {/* Content Split */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="w-full md:w-64 bg-white border border-gray-200 rounded-xl p-2 shadow-sm shrink-0">
            <nav className="flex flex-col gap-1">
              <button onClick={() => setActiveMenu('perfil')} className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all ${activeMenu === 'perfil' ? 'bg-slate-50 text-slate-900' : 'text-gray-500'}`}>
                <User size={16} /> Meu Perfil
              </button>
              <button onClick={() => setActiveMenu('notificacoes')} className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all ${activeMenu === 'notificacoes' ? 'bg-slate-50 text-slate-900' : 'text-gray-500'}`}>
                <Bell size={16} /> Notificações
              </button>
            </nav>
          </div>

          <div className="flex-1 w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            {activeMenu === 'perfil' && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">Informações Pessoais</h3>
                  <div className="h-px w-full bg-gray-100 my-4"></div>
                </div>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-2 border-gray-200 text-3xl font-bold text-slate-400 shrink-0">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <button className="px-5 py-2 bg-white border border-gray-200 rounded text-xs font-bold text-slate-700 shadow-sm mb-3">
                       Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Usuário</label>
                    <input type="text" defaultValue={user?.username} className="w-full bg-white border-2 border-gray-100 rounded-md px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            )}
            
            {activeMenu !== 'perfil' && (
              <div className="h-64 flex items-center justify-center flex-col text-gray-400">
                <Settings size={40} className="mb-4 text-gray-200 animate-spin-slow" />
                <h3 className="text-sm font-bold text-slate-800 mb-1">Em Desenvolvimento</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
