import React, { useState } from 'react';
import { Search, GraduationCap, LogOut, User, Menu, Play, FileText, LayoutDashboard, Compass, Settings, Bell, MoreVertical, Home, Folder, MessageSquare, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Course } from '../types';
import { HomeView } from './HomeView';
import { MaterialsView } from './MaterialsView';
import { DiscussionsView } from './DiscussionsView';
import { SettingsView } from './SettingsView';
import { NotificationsView } from './NotificationsView';

type Tab = 'inicio' | 'cursos' | 'materiais' | 'discussoes' | 'configuracoes' | 'notificacoes';

interface CourseViewerProps {
  courses: Course[];
  onLogout: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ courses, onLogout }) => {
  const { user } = useAuth();
  const [activeLesson, setActiveLesson] = useState<Course | null>(courses[0] || null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'apps' | 'notifications' | 'profile'>('none');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Update active lesson when courses load
  React.useEffect(() => {
    if (!activeLesson && courses.length > 0) {
      setActiveLesson(courses[0]);
    }
  }, [courses, activeLesson]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCourses = Array.isArray(courses) ? courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const CourseView = () => {
    const activeLessonIndex = filteredCourses.findIndex(c => c.id === activeLesson?.id);
    const hasPrevious = activeLessonIndex > 0;
    const hasNext = activeLessonIndex < filteredCourses.length - 1;

    const goToPrevious = () => {
      if (hasPrevious) setActiveLesson(filteredCourses[activeLessonIndex - 1]);
    };

    const goToNext = () => {
      if (hasNext) setActiveLesson(filteredCourses[activeLessonIndex + 1]);
    };

    return (
      <div className="flex flex-col lg:flex-row flex-1 p-4 md:p-8 gap-6 md:gap-8 overflow-y-auto lg:overflow-hidden bg-[#F8FAFC]">
        
        {/* Left Column: Lesson List */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:max-w-3xl order-2 lg:order-1 pt-2 lg:pt-0">
        
        {/* List Header (Stylized like wireframe) */}
        <div className="mb-6 shrink-0">
          <div className="h-1.5 w-16 bg-slate-800 rounded-full mb-4"></div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Conteúdo do Módulo</h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                <span className="text-slate-800">&lt; / &gt;</span>
                <span>VISÃO GERAL DO CURSO</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded shrink-0 text-xs font-bold text-slate-700 shadow-sm hover:bg-gray-50 transition-colors">
              FILTRAR
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 lg:pb-4">
          {filteredCourses.length === 0 ? (
            <div className="py-8 text-center text-sm font-semibold text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              Nenhum resultado encontrado.
            </div>
          ) : (
            filteredCourses.map((lesson) => {
              const isActive = activeLesson?.id === lesson.id;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all group ${
                    isActive 
                      ? 'border-slate-800 bg-white shadow-md ring-1 ring-slate-800 z-10 relative' 
                      : 'border-gray-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-14 h-14 shrink-0 rounded flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'border-slate-800 bg-white' : 'border-gray-200 bg-gray-50 group-hover:border-slate-300'
                  }`}>
                    {lesson.file_type === 'pdf' ? (
                      <span className={`font-mono font-bold text-lg ${isActive ? 'text-slate-800' : 'text-gray-400'}`}>P</span>
                    ) : (
                      <Play size={20} className={isActive ? 'text-slate-800' : 'text-gray-400 ml-1'} />
                    )}
                  </div>
                  
                  <div className="flex flex-col py-1 overflow-hidden flex-1">
                    <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {lesson.category}
                    </span>
                    <h4 className={`text-sm font-bold truncate mb-1 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {lesson.title}
                    </h4>
                    <div className={`h-1 rounded-full mt-1.5 w-16 ${isActive ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className="px-2 shrink-0">
                    <MoreVertical size={18} className={isActive ? 'text-slate-800' : 'text-gray-300'} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

        {/* Right Column: Video Player Container */}
        <div className="w-full lg:w-[45%] xl:w-5/12 shrink-0 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pb-4 lg:pt-1 order-1 lg:order-2">
          {activeLesson ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden lg:sticky lg:top-0">
            {/* Video Block */}
            <div className="aspect-video bg-slate-900 relative flex items-center justify-center group overflow-hidden border-b border-gray-200">
              <img 
                src={activeLesson.thumbnail_url} 
                alt={activeLesson.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <a 
                href={activeLesson.link_drive} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-16 h-16 rounded-full border-2 border-white flex items-center justify-center hover:scale-110 shadow-2xl transition-transform bg-white/10 backdrop-blur-sm z-10"
              >
                <Play size={28} fill="white" className="text-white ml-2" />
              </a>
              
              {/* Fake Player Controls for visual matching */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 z-10 bg-black/40 px-3 py-2 rounded-lg backdrop-blur-md">
                <Play size={14} className="text-white" />
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-white rounded-full"></div>
                </div>
                <Settings size={14} className="text-white" />
              </div>
            </div>
            
              {/* Text Block */}
              <div className="p-5 md:p-8">
                <div className="h-1.5 w-12 bg-slate-800 rounded-full mb-4"></div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight leading-snug">{activeLesson.title}</h2>
                <div className="h-px w-full bg-gray-100 mb-4"></div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                  {activeLesson.description}
                </p>
                
                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                  <button 
                    onClick={goToPrevious}
                    disabled={!hasPrevious}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      hasPrevious 
                        ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-gray-200' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-transparent'
                    }`}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <button 
                    onClick={goToNext}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${
                      hasNext 
                        ? 'bg-slate-800 text-white hover:bg-slate-700' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed hidden'
                    }`}
                  >
                    Próxima <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm aspect-video flex flex-col items-center justify-center text-gray-300">
            <Play size={40} className="mb-4 text-gray-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">NENHUMA AULA ATIVA</span>
          </div>
        )}
      </div>

    </div>
  );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return <HomeView courses={courses} onNavigate={setActiveTab} />;
      case 'materiais': return <MaterialsView courses={courses} />;
      case 'discussoes': return <DiscussionsView />;
      case 'configuracoes': return <SettingsView />;
      case 'notificacoes': return <NotificationsView />;
      case 'cursos':
      default:
        return <CourseView />;
    }
  };

  const getNavClass = (tab: Tab) => {
    return `flex items-center gap-3 px-6 py-3 text-sm transition-colors relative ${
      activeTab === tab 
        ? 'font-bold text-white bg-slate-800 shadow-sm' 
        : 'font-semibold text-gray-500 hover:bg-gray-50'
    }`;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0 gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <GraduationCap className="text-slate-800" size={28} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">EduMind</h1>
          </div>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          <button onClick={() => setActiveTab('inicio')} className={getNavClass('inicio')}>
            {activeTab === 'inicio' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
            <Home size={18} />
            Início
          </button>
          <button onClick={() => setActiveTab('cursos')} className={getNavClass('cursos')}>
            {activeTab === 'cursos' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
            <LayoutDashboard size={18} />
            Aulas e Trilhas
          </button>
          <button onClick={() => setActiveTab('materiais')} className={getNavClass('materiais')}>
            {activeTab === 'materiais' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
            <Folder size={18} />
            Materiais
          </button>
          <button onClick={() => setActiveTab('discussoes')} className={getNavClass('discussoes')}>
            {activeTab === 'discussoes' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
            <MessageSquare size={18} />
            Discussões
          </button>
          <button onClick={() => setActiveTab('configuracoes')} className={getNavClass('configuracoes')}>
            {activeTab === 'configuracoes' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
            <Settings size={18} />
            Configurações
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded text-sm font-semibold text-gray-500 hover:bg-slate-50 transition-colors"
          >
            <LogOut size={18} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 flex items-center justify-center">
              <GraduationCap className="text-slate-800" size={24} />
            </div>
            <h1 className="text-sm font-bold text-slate-800">EduMind</h1>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-start md:ml-4">
            <div className="relative group w-full max-w-lg hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar conteúdos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 bg-white border-2 border-gray-200 rounded text-sm font-medium focus:border-slate-800 focus:ring-0 transition-all shadow-sm text-slate-700"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5 pl-6 text-gray-500 relative" ref={dropdownRef}>
            {/* Grid Icon */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(prev => prev === 'apps' ? 'none' : 'apps')}
                className={`hover:text-slate-800 transition-colors hidden sm:block p-1 rounded ${activeDropdown === 'apps' ? 'text-slate-800 bg-gray-100' : ''}`}
              >
                <LayoutGrid size={20} />
              </button>
              {activeDropdown === 'apps' && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Aplicativos Rápidos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all text-slate-700">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Compass size={18} /></div>
                      <span className="text-[10px] font-bold">Explorar</span>
                    </button>
                    <button onClick={() => {setActiveTab('materiais'); setActiveDropdown('none');}} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all text-slate-700">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600"><FileText size={18} /></div>
                      <span className="text-[10px] font-bold">Artigos</span>
                    </button>
                    <button onClick={() => {setActiveTab('configuracoes'); setActiveDropdown('none');}} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all text-slate-700">
                      <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600"><Settings size={18} /></div>
                      <span className="text-[10px] font-bold">Ajustes</span>
                    </button>
                    <button onClick={() => {setActiveTab('materiais'); setActiveDropdown('none');}} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all text-slate-700">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Folder size={18} /></div>
                      <span className="text-[10px] font-bold">Arquivos</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bell Icon */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(prev => prev === 'notifications' ? 'none' : 'notifications')}
                className={`hover:text-slate-800 transition-colors relative p-1 rounded ${activeDropdown === 'notifications' ? 'text-slate-800 bg-gray-100' : ''}`}
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {activeDropdown === 'notifications' && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Notificações</h3>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">2 NOVAS</span>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-64 custom-scrollbar">
                    <div className="p-3 border-b border-gray-50 hover:bg-slate-50 transition-colors cursor-pointer bg-indigo-50/10">
                      <h4 className="text-xs font-bold text-slate-800 mb-1">Módulo Concluído</h4>
                      <p className="text-[10px] text-gray-600 line-clamp-2">Você completou todas as aulas de Arquitetura de Software.</p>
                    </div>
                    <div className="p-3 border-b border-gray-50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <h4 className="text-xs font-bold text-slate-800 mb-1">Nova Resposta</h4>
                      <p className="text-[10px] text-gray-600 line-clamp-2">Ana comentou no seu tópico sobre List Comprehension.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('notificacoes');
                      setActiveDropdown('none');
                    }}
                    className="p-3 bg-white text-xs font-bold text-indigo-600 hover:bg-slate-50 transition-colors uppercase tracking-widest text-center border-t border-gray-100"
                  >
                    Ver todas as notificações
                  </button>
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(prev => prev === 'profile' ? 'none' : 'profile')}
                className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center overflow-hidden ml-2 ${activeDropdown === 'profile' ? 'border-slate-800 bg-gray-100' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              >
                <span className="text-sm font-bold text-slate-600">{user?.username?.charAt(0).toUpperCase()}</span>
              </button>
              {activeDropdown === 'profile' && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-5 border-b border-gray-100 flex flex-col items-center bg-[#F8FAFC]">
                     <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm bg-indigo-100 flex items-center justify-center mb-3">
                         <span className="text-2xl font-bold text-indigo-600">{user?.username?.charAt(0).toUpperCase()}</span>
                     </div>
                     <h3 className="text-sm font-bold text-slate-900">{user?.username}</h3>
                     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase mt-1">Aluno(a)</span>
                  </div>
                  <div className="py-2">
                    <button onClick={() => {setActiveTab('configuracoes'); setActiveDropdown('none');}} className="w-full px-5 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-3">
                      <User size={14} /> Minha Conta
                    </button>
                    <button onClick={() => {setActiveTab('configuracoes'); setActiveDropdown('none');}} className="w-full px-5 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-3">
                       <Settings size={14} /> Preferências
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button 
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors uppercase tracking-widest"
                    >
                      Sair da Conta
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="md:hidden text-gray-400 focus:outline-none ml-2">
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        {renderContent()}

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-50 h-16 pb-safe px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'inicio' ? 'text-indigo-600' : 'text-gray-500'}`}>
            <Home size={20} />
            <span className="text-[10px] font-bold">Início</span>
          </button>
          <button onClick={() => setActiveTab('cursos')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'cursos' ? 'text-indigo-600' : 'text-gray-500'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold">Aulas</span>
          </button>
          <button onClick={() => setActiveTab('discussoes')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'discussoes' ? 'text-indigo-600' : 'text-gray-500'}`}>
            <MessageSquare size={20} />
            <span className="text-[10px] font-bold">Fórum</span>
          </button>
          <button onClick={() => setActiveTab('notificacoes')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'notificacoes' ? 'text-indigo-600' : 'text-gray-500'}`}>
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="text-[10px] font-bold">Avisos</span>
          </button>
        </nav>

      </main>
    </div>
  );
};


