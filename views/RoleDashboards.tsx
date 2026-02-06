
import React from 'react';
import { InstitutionInfo, User } from '../types';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  DollarSign, 
  FileCheck, 
  AlertCircle,
  Calendar,
  Wallet,
  School,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Components ---

const StatCard = ({ title, value, change, icon, color, subtitle }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} p-3 rounded-2xl`}>
        {icon}
      </div>
      {change && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{change}</span>}
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    {subtitle && <p className="text-[10px] text-slate-400 mt-2">{subtitle}</p>}
  </div>
);

// --- RECTOR / ADMIN DASHBOARD ---
export const AdminDashboard: React.FC = () => {
  const enrollmentData = [
    { name: 'Pre-J', value: 25 }, { name: 'Jardín', value: 28 }, { name: 'Tran', value: 30 },
    { name: '1º', value: 32 }, { name: '2º', value: 30 }, { name: '3º', value: 28 },
    { name: '4º', value: 35 }, { name: '5º', value: 33 }, { name: '6º', value: 30 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-800">Panel de Rectoría</h2>
            <p className="text-slate-500 font-medium">Visión global de la institución en tiempo real.</p>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">
            <TrendingUp size={16} /> Indicadores SIEE Actualizados
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Matrícula Total" value="385" change="+5.2%" icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Cartera Vencida" value="$12.4M" change="-2.1%" icon={<DollarSign className="text-red-600" />} color="bg-red-50" />
        <StatCard title="Planillas Pendientes" value="12" subtitle="De 45 totales" icon={<FileCheck className="text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Promedio General" value="4.2" change="+0.1" icon={<GraduationCap className="text-emerald-600" />} color="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Población Estudiantil por Grado</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Aprobaciones Pendientes</h3>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 font-bold border border-slate-100">JM</div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">Juan Martínez</p>
                        <p className="text-[10px] text-slate-500 uppercase">Solicitud cambio de nota 8º</p>
                     </div>
                     <button className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors"><ArrowRight size={16} /></button>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

// --- SECRETARY / COORDINATOR DASHBOARD ---
export const SecretaryDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
         <h2 className="text-2xl font-black text-slate-800">Secretaría Académica</h2>
         <p className="text-slate-500 font-medium">Gestión administrativa, certificados y atención al público.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
           <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><Wallet size={24} /></div>
           <div>
              <p className="text-2xl font-black text-slate-800">24</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pagos Hoy</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
           <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><ClipboardList size={24} /></div>
           <div>
              <p className="text-2xl font-black text-slate-800">5</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Certificados Solicitados</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Calendar size={24} /></div>
           <div>
              <p className="text-2xl font-black text-slate-800">8</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Citas Agendadas</p>
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Agenda del Día</h3>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700">Nueva Cita</button>
         </div>
         <div className="space-y-4">
             {/* Mock Items */}
             <div className="flex items-start gap-4 pb-4 border-b border-slate-50">
                <div className="w-16 text-center">
                   <p className="text-lg font-black text-slate-800">08:00</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">AM</p>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-500">
                   <h4 className="font-bold text-slate-800">Entrevista Padre de Familia - Nuevo Ingreso</h4>
                   <p className="text-xs text-slate-500 mt-1">Familia González - Grado 3º</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-16 text-center">
                   <p className="text-lg font-black text-slate-800">10:30</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">AM</p>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border-l-4 border-amber-500">
                   <h4 className="font-bold text-slate-800">Revisión de Cartera con Contabilidad</h4>
                   <p className="text-xs text-slate-500 mt-1">Sala de Juntas</p>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

// --- GRADE SELECTOR (For Teachers with >1 Grade) ---

interface GradeSelectorProps {
  grades: string[];
  gradeIds: string[];
  onSelect: (gradeId: string) => void;
  user: User;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ grades, gradeIds, onSelect, user }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
         <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
             <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
         </div>
         <h2 className="text-3xl font-black text-slate-800 mb-2">¡Hola, {user.name.split(' ')[0]}!</h2>
         <p className="text-slate-500 font-medium text-lg">Selecciona el grupo de trabajo para esta sesión.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
         {grades.map((grade, idx) => (
           <button 
             key={idx}
             onClick={() => onSelect(gradeIds[idx] || grade)}
             className="group bg-white hover:bg-blue-600 p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-600 shadow-xl shadow-slate-200/50 hover:shadow-blue-200/50 transition-all duration-300 text-left relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:text-white transition-all">
                 <School size={100} />
              </div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <GraduationCap size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 group-hover:text-white mb-2 transition-colors">{grade}</h3>
                 <p className="text-xs font-bold text-slate-400 group-hover:text-blue-100 uppercase tracking-widest transition-colors">Director de Grupo</p>
                 
                 <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:text-white transition-colors">
                    Ingresar al Aula <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
           </button>
         ))}
      </div>
      
      <p className="mt-12 text-slate-400 text-sm font-medium">
         Puedes cambiar de grupo más tarde desde el menú principal.
      </p>
    </div>
  );
};
