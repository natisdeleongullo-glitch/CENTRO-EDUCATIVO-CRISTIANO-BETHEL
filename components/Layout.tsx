
import React, { useState } from 'react';
import { UserRole, User, InstitutionInfo } from '../types';
import { NAVIGATION_ITEMS, NavItem } from '../constants';
import { LogOut, ChevronRight, ChevronDown, User as UserIcon, MapPin } from 'lucide-react';

interface LayoutProps {
  user: User;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  institution: InstitutionInfo;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeTab, onTabChange, onLogout, institution, children }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 'seguimiento': true, 'calificaciones': false });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredNav = NAVIGATION_ITEMS.filter(item => item.roles.includes(user.role));

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections[item.id];
    const isActive = activeTab === item.id || (item.children?.some(c => c.id === activeTab)) || (item.children?.some(c => c.children?.some(gc => gc.id === activeTab)));

    if (item.isSection) {
      return (
        <div key={item.id} className="mb-2">
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest`}
          >
            <span>{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isOpen && (
            <div className="mt-1 space-y-1 ml-2 border-l-2 border-slate-100 pl-2">
              {item.children?.filter(child => child.roles.includes(user.role)).map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              onTabChange(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
            activeTab === item.id 
            ? 'bg-blue-600 text-white font-semibold shadow-md' 
            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
          }`}
          style={{ paddingLeft: `${(depth * 0.5) + 1}rem` }}
        >
          <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
            {item.icon}
          </span>
          <span className={`flex-1 text-left ${depth > 0 ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
          {hasChildren && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </button>
        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1 ml-4 border-l border-slate-100 pl-2">
            {item.children?.filter(child => child.roles.includes(user.role)).map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex flex-col items-center border-b border-slate-100 bg-gradient-to-b from-blue-50/30 to-white">
          <div className="w-20 h-20 mb-4 relative group">
             <div className="absolute inset-0 bg-blue-600 rounded-full scale-105 opacity-5 group-hover:scale-115 transition-transform duration-500 blur-sm"></div>
             <div className="w-full h-full bg-white rounded-full p-1 shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
               <img 
                 src={institution.logoUrl} 
                 alt="Escudo Bethel" 
                 className="w-full h-full object-contain"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Bethel&background=1e3a8a&color=fff&size=128';
                 }}
               />
             </div>
          </div>
          <div className="text-center">
            <h1 className="font-extrabold text-slate-800 text-[10px] uppercase leading-tight tracking-tight px-2">{institution.name}</h1>
            <p className="text-[8px] text-blue-700 font-black italic mt-1 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-full inline-block">
              {institution.slogan}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {filteredNav.map(item => renderNavItem(item))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100/50">
            <div className="flex items-center gap-3">
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-extrabold text-slate-800">
              {/* Encontrar etiqueta del ID activo, incluso si es un hijo */}
              {(() => {
                const findLabel = (items: NavItem[]): string | undefined => {
                  for (const item of items) {
                    if (item.id === activeTab) return item.label;
                    if (item.children) {
                      const found = findLabel(item.children);
                      if (found) return found;
                    }
                  }
                  return undefined;
                };
                return findLabel(NAVIGATION_ITEMS) || 'Panel';
              })()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[10px] text-emerald-500 font-medium">Conectado</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                  <UserIcon size={18} />
               </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
