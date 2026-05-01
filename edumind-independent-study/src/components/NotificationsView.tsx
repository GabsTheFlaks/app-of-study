import React from 'react';
import { CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="shrink-0 flex justify-between items-end">
          <div>
            <div className="h-1.5 w-16 bg-slate-800 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Notificações</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">MANTENHA-SE ATUALIZADO</p>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded text-xs font-bold text-slate-700 shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors uppercase tracking-widest">
            Marcar todas lidas
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
          <div className="p-4 px-6 hover:bg-slate-50 transition-colors flex gap-5 items-start bg-indigo-50/20 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1 text-indigo-600 border border-indigo-200">
              <MessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-800">Novo comentário no seu tópico</h4>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">Ana Silva respondeu à sua dúvida sobre List Comprehension no fórum de Programação.</p>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Há 2 horas</span>
            </div>
          </div>
          
          <div className="p-4 px-6 hover:bg-slate-50 transition-colors flex gap-5 items-start bg-emerald-50/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-1 text-emerald-600 border border-emerald-100">
              <CheckCircle size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-800">Módulo Concluído</h4>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">Parabéns! Você concluiu todas as aulas e tarefas do módulo de Arquitetura de Software.</p>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ontem</span>
            </div>
          </div>

          <div className="p-4 px-6 hover:bg-slate-50 transition-colors flex gap-5 items-start cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-1 text-amber-600 border border-amber-100">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Manutenção Programada</h4>
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">A plataforma passará por instabilidades neste fim de semana para atualizações na infraestrutura de servidores.</p>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Há 2 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
