import React from 'react';
import { FileText, Download, Filter, Search, FileVideo, CheckCircle2 } from 'lucide-react';
import { Course } from '../types';

interface MaterialsViewProps {
  courses: Course[];
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ courses }) => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="shrink-0 flex justify-between items-end">
          <div>
            <div className="h-1.5 w-16 bg-slate-800 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Materiais de Apoio</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">DOWLOADS E DOCUMENTOS</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded text-xs font-bold text-slate-700 shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <Filter size={14} /> FILTRAR
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Todos os Arquivos</h3>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Buscar material..." className="w-full sm:w-64 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all focus:ring-0 text-slate-700" />
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 bg-white">
            {courses.length === 0 ? (
               <div className="p-8 text-center text-sm font-semibold text-gray-400">
                 Não há materiais disponíveis no momento.
               </div>
            ) : (
                courses.map((course) => (
                <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors group gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                        {course.file_type === 'pdf' ? (
                            <span className="font-mono font-bold text-slate-400 text-sm">PDF</span>
                        ) : (
                            <FileVideo size={20} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-1">{course.title}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{course.category} • Adicionado recentemente</p>
                    </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-4 ml-16 sm:ml-0">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
                        <CheckCircle2 size={12} /> VERIFICADO
                    </span>
                    <a href={course.link_drive} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-md transition-colors border border-transparent hover:border-gray-200 shadow-sm hover:shadow-none">
                        <Download size={16} />
                    </a>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
