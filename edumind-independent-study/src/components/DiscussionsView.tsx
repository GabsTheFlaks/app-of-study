import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, ChevronRight, Hash, X, Plus } from 'lucide-react';
import { useAuth } from '../AuthContext';

const initialMockDiscussions = [
  { id: 1, title: 'Dúvida sobre List Comprehension no Python', author: 'Lauro', category: 'Programação', replies: 12, likes: 5, time: '2h atrás' },
  { id: 2, title: 'Melhores práticas para Tailwind em React', author: 'Ana Silva', category: 'Frontend', replies: 8, likes: 15, time: '5h atrás' },
  { id: 3, title: 'Como organizar a arquitetura limpa em projetos de média escala?', author: 'DevJunior', category: 'Engenharia de Software', replies: 3, likes: 2, time: '10h atrás' },
  { id: 4, title: 'O que acharam do novo módulo de IA?', author: 'CarlosT', category: 'Geral', replies: 24, likes: 32, time: '1 dia atrás' },
];

const mockMoreDiscussions = [
  { id: 5, title: 'Alguém recomenda livros sobre Clean Code?', author: 'Maria', category: 'Engenharia de Software', replies: 45, likes: 89, time: '2 dias atrás' },
  { id: 6, title: 'Problemas com deploy na Vercel', author: 'João Dev', category: 'Frontend', replies: 1, likes: 4, time: '3 dias atrás' }
];

export const DiscussionsView: React.FC = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState(initialMockDiscussions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const [newTopic, setNewTopic] = useState({
    title: '',
    category: 'Programação',
    description: ''
  });

  const handleLoadMore = () => {
    setTopics(prev => [...prev, ...mockMoreDiscussions]);
    setHasLoadedMore(true);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title.trim() || !newTopic.description.trim()) return;

    const topic = {
      id: Date.now(),
      title: newTopic.title,
      author: user?.username || 'Usuário',
      category: newTopic.category,
      replies: 0,
      likes: 0,
      time: 'Agora mesmo'
    };

    setTopics(prev => [topic, ...prev]);
    setIsModalOpen(false);
    setNewTopic({ title: '', category: 'Programação', description: '' });
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F8FAFC] custom-scrollbar relative">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="h-1.5 w-16 bg-slate-800 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Fórum & Discussões</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">DÚVIDAS E NETWORKING</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-slate-800 text-white rounded text-xs font-bold shadow-md hover:bg-slate-700 hover:shadow-lg transition-all uppercase tracking-widest self-start sm:self-auto flex items-center gap-2"
          >
            <Plus size={16} /> Novo Tópico
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Topics List */}
          <div className="flex-1 space-y-4 w-full">
            {topics.map((topic) => (
              <div key={topic.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-slate-300 hover:shadow transition-all cursor-pointer group flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center shrink-0">
                     <span className="text-base font-bold text-slate-400 leading-none">{topic.author.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                        <Hash size={10} /> {topic.category}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{topic.time}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">{topic.title}</h3>
                    <p className="text-[11px] font-medium text-gray-500 mt-1">Por <span className="font-bold text-slate-700">{topic.author}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 shrink-0 ml-4">
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <ThumbsUp size={14} className="group-hover:text-indigo-400 transition-colors" />
                    <span className="text-[10px] font-bold">{topic.likes}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <MessageSquare size={14} className="group-hover:text-amber-400 transition-colors" />
                    <span className="text-[10px] font-bold">{topic.replies}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-slate-800 transition-colors hidden sm:block ml-2" />
                </div>
              </div>
            ))}
            
            {!hasLoadedMore && (
              <div className="pt-4 flex justify-center">
                  <button 
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-slate-600 shadow-sm hover:bg-gray-50 hover:text-slate-900 transition-colors uppercase tracking-widest"
                  >
                      Carregar Mais Tópicos
                  </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-6 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5 border-b border-gray-100 pb-3">Categorias Populares</h3>
              <ul className="space-y-4">
                {['Programação', 'Frontend', 'Engenharia de Software', 'Inteligência Artificial', 'Dúvidas Gerais'].map(cat => (
                  <li key={cat} className="flex justify-between items-center group cursor-pointer">
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-slate-900 transition-colors">{cat}</span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full group-hover:border-slate-300 transition-colors">{Math.floor(Math.random() * 30 + 1)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageSquare size={80} />
                </div>
                <h3 className="text-sm font-bold text-indigo-900 mb-2 relative z-10">Comunidade Ativa</h3>
                <p className="text-xs text-indigo-700 font-medium leading-relaxed mb-4 relative z-10">
                    Participe das discussões e ajude outros estudantes a resolverem problemas complexos.
                </p>
                <button className="text-xs font-bold text-indigo-700 uppercase tracking-widest hover:text-indigo-900 flex items-center gap-1 transition-colors relative z-10">
                    Ver Diretrizes <ChevronRight size={14} />
                </button>
            </div>
          </div>

        </div>

      </div>

      {/* New Topic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-slate-800">Criar Novo Tópico</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-800 transition-colors p-1 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="new-topic-form" onSubmit={handleCreateTopic} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Título do Tópico</label>
                  <input 
                    type="text" 
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                    placeholder="Ex: Como centralizar uma div com Tailwind CSS?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Categoria</label>
                  <select 
                    value={newTopic.category}
                    onChange={(e) => setNewTopic({...newTopic, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors appearance-none"
                  >
                    <option value="Programação">Programação</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Engenharia de Software">Engenharia de Software</option>
                    <option value="Inteligência Artificial">Inteligência Artificial</option>
                    <option value="Geral">Dúvidas Gerais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Descrição</label>
                  <textarea 
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                    placeholder="Descreva sua dúvida ou inicie a discussão..."
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none custom-scrollbar"
                    required
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 font-bold text-xs text-slate-600 hover:text-slate-900 hover:bg-gray-200 rounded-lg transition-colors uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="new-topic-form"
                className="px-5 py-2.5 bg-indigo-600 font-bold text-xs text-white shadow-sm hover:bg-indigo-700 hover:shadow rounded-lg transition-all uppercase tracking-widest"
              >
                Publicar Tópico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
