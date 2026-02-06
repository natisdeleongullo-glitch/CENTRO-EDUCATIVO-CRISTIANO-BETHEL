
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, GraduationCap, TrendingUp, DollarSign } from 'lucide-react';

const data = [
  { name: 'Feb', revenue: 4500000, students: 240 },
  { name: 'Mar', revenue: 5200000, students: 245 },
  { name: 'Abr', revenue: 4800000, students: 250 },
  { name: 'May', revenue: 6100000, students: 255 },
];

const academicPerformanceData = [
  { grade: 'Pre-J', avg: 4.8 },
  { grade: 'Jard', avg: 4.7 },
  { grade: 'Tran', avg: 4.6 },
  { grade: '1º', avg: 4.2 },
  { grade: '2º', avg: 4.0 },
  { grade: '3º', avg: 3.8 },
  { grade: '4º', avg: 4.1 },
  { grade: '5º', avg: 4.3 },
  { grade: '6º', avg: 3.9 },
  { grade: '7º', avg: 4.2 },
  { grade: '8º', avg: 4.5 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Estudiantes Activos" value="255" change="+12% vs año anterior" icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Promedio General" value="4.1" change="+0.2 pts" icon={<GraduationCap className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Asistencia Promedio" value="94%" change="-1% esta semana" icon={<TrendingUp className="text-amber-600" />} color="bg-amber-50" />
        <StatCard title="Recaudo Mayo" value="$12.5M" change="+5% meta lograda" icon={<DollarSign className="text-indigo-600" />} color="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Desempeño Académico (Pre-Jardín a 8º)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="grade" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 5]} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Flow */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Flujo de Matrículas y Pensiones</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Notifications / Recent Activity */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Actividad Reciente</h3>
        <div className="space-y-4">
          {[
            { label: 'Boletines generados - Octavo Grado', time: 'Hace 10 min', type: 'academic' },
            { label: 'Pago recibido: Mateo Gómez (PSE)', time: 'Hace 45 min', type: 'finance' },
            { label: 'Nueva circular publicada: "Salida Pedagógica"', time: 'Hace 2 horas', type: 'comm' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <TrendingUp size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} p-3 rounded-2xl`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{change}</span>
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default Dashboard;
