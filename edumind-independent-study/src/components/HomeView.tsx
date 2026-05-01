import React from 'react';
import { BookOpen, Clock, Trophy, Play } from 'lucide-react';
import { Course } from '../types';

interface HomeViewProps {
  courses: Course[];
  onNavigate: (tab: 'inicio' | 'cursos' | 'materiais' | 'discussoes' | 'configuracoes') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ courses, onNavigate }) => {
  const recentCourses = courses.slice(0, 3);

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="shrink-0 flex justify-between items-end">
          <div>
            <div className="h-1.5 w-16 bg-slate-800 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Visão Geral</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">RESUMO DO SEU PROGRESSO</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aulas Concluídas</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-800 leading-none">12</h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 rounded">+2 hoje</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:border-emerald-100 transition-colors">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
              <Clock size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horas de Estudo</p>
              <h3 className="text-2xl font-bold text-slate-800 leading-none mt-1">34h</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:border-amber-100 transition-colors">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
              <Trophy size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Score</p>
              <h3 className="text-2xl font-bold text-emerald-600 leading-none mt-1">84/100</h3>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Continue Aprendendo</h3>
            <button onClick={() => onNavigate('cursos')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">VER TODAS</button>
          </div>
          
          {recentCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-gray-400">Nenhum curso iniciado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group cursor-pointer hover:border-slate-300 hover:shadow-md transition-all flex flex-col" onClick={() => onNavigate('cursos')}>
                  <div className="aspect-video bg-gray-100 relative overflow-hidden shrink-0">
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                        <Play size={18} className="text-slate-800 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded w-max mb-3">{course.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 mb-2 truncate leading-snug">{course.title}</h4>
                    <div className="mt-auto pt-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            <span>Progresso</span>
                            <span className="text-slate-700">45%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
