
import React, { useState, useEffect } from 'react';
import { Student, InstitutionInfo, PlanillaStatus, GradeActivity } from '../types';
import { 
  Folder, 
  ChevronRight, 
  ArrowLeft, 
  Users, 
  Layers, 
  Search, 
  FileSpreadsheet, 
  Save, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  History,
  Lock,
  // Added missing Edit3 icon import
  Edit3
} from 'lucide-react';

interface GradeSheetProps {
  students: Student[];
  institution: InstitutionInfo;
  activePeriod: number;
  onPeriodChange: (p: number) => void;
}

const GRADELIST = [
  'Pre-Jardín', 'Jardín', 'Transición', 'Primero', 'Segundo', 'Tercero', 
  'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo'
];

const DEFAULT_ACTIVITIES: GradeActivity[] = [
  { id: 'act-1', name: 'Exámenes', weight: 0.4 },
  { id: 'act-2', name: 'Talleres', weight: 0.3 },
  { id: 'act-3', name: 'Participación', weight: 0.3 }
];

const SUBJECTS = [
  { id: 'MAT', name: 'Matemáticas' },
  { id: 'LEN', name: 'Lengua Castellana' },
  { id: 'ING', name: 'Inglés' },
  { id: 'NAT', name: 'Naturales' },
  { id: 'SOC', name: 'Sociales' }
];

const GradeSheet: React.FC<GradeSheetProps> = ({ students, institution, activePeriod, onPeriodChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [planillaStatus, setPlanillaStatus] = useState<PlanillaStatus>(PlanillaStatus.DRAFT);
  const [showConfig, setShowConfig] = useState(false);
  const [activities, setActivities] = useState<GradeActivity[]>(DEFAULT_ACTIVITIES);

  const filteredGrades = GRADELIST.filter(grade => 
    grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentsInGrade = (grade: string) => 
    students.filter(s => s.grade === grade && (searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleAction = (status: PlanillaStatus) => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setPlanillaStatus(status);
      setIsSyncing(false);
      const messages = {
        [PlanillaStatus.IN_REVIEW]: 'Planilla enviada a coordinación para validación.',
        [PlanillaStatus.APPROVED]: 'Planilla aprobada y sincronizada con el SIEE.',
        [PlanillaStatus.REJECTED]: 'Planilla rechazada. Se han enviado comentarios al docente.',
        [PlanillaStatus.DRAFT]: 'Planilla guardada como borrador.'
      };
      alert(messages[status] || 'Operación exitosa');
    }, 1000);
  };

  const getPerformanceClass = (score: number) => {
    if (score >= 4.6) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 4.0) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (score >= 3.0) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const getStatusIcon = (status: PlanillaStatus) => {
    switch(status) {
      case PlanillaStatus.APPROVED: return <CheckCircle className="text-emerald-500" size={16} />;
      case PlanillaStatus.REJECTED: return <XCircle className="text-red-500" size={16} />;
      case PlanillaStatus.IN_REVIEW: return <Clock className="text-amber-500" size={16} />;
      // Fix: Now Edit3 is properly imported and available
      default: return <Edit3 className="text-slate-400" size={16} />;
    }
  };

  const isLocked = planillaStatus === PlanillaStatus.APPROVED || planillaStatus === PlanillaStatus.IN_REVIEW;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {selectedGrade && (
            <button 
              onClick={() => { setSelectedGrade(null); setPlanillaStatus(PlanillaStatus.DRAFT); }}
              className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm border border-slate-100 transition-all hover:-translate-x-1"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Registro Calificaciones</span>
              {selectedGrade && (
                <>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{selectedGrade}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {selectedGrade ? `Planilla Auxiliar: ${selectedGrade}` : 'Carpetas por Grados'}
            </h2>
          </div>
        </div>

        {selectedGrade && (
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
              planillaStatus === PlanillaStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              planillaStatus === PlanillaStatus.IN_REVIEW ? 'bg-amber-50 text-amber-700 border-amber-100' :
              planillaStatus === PlanillaStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' :
              'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              {getStatusIcon(planillaStatus)}
              {planillaStatus}
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {[1, 2, 3, 4].map(p => (
                <button 
                  key={p} 
                  disabled={isLocked}
                  onClick={() => onPeriodChange(p)} 
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${activePeriod === p ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:text-slate-800 disabled:opacity-50'}`}
                >
                  P{p}
                </button>
              ))}
            </div>

            {!isLocked ? (
              <button 
                onClick={() => handleAction(PlanillaStatus.IN_REVIEW)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group disabled:opacity-50"
              >
                {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                <span>Validar SIEE</span>
              </button>
            ) : planillaStatus === PlanillaStatus.IN_REVIEW ? (
              <div className="flex gap-2">
                <button onClick={() => handleAction(PlanillaStatus.APPROVED)} className="px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Aprobar
                </button>
                <button onClick={() => handleAction(PlanillaStatus.REJECTED)} className="px-6 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 flex items-center gap-2">
                  <XCircle size={18} /> Rechazar
                </button>
              </div>
            ) : (
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-black rounded-2xl opacity-50 cursor-not-allowed">
                <Lock size={18} /> Planilla Cerrada
              </button>
            )}
          </div>
        )}
      </div>

      {/* Configuration Panel */}
      {selectedGrade && showConfig && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <Settings className="text-indigo-600" /> Configuración de Ponderaciones
            </h3>
            <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-red-500 transition-colors">
              <XCircle size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((act, i) => (
              <div key={act.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Actividad {i+1}</label>
                <input 
                  type="text" 
                  value={act.name} 
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl font-bold text-slate-700 mb-3" 
                  readOnly={isLocked}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Peso:</span>
                  <input 
                    type="number" 
                    value={act.weight * 100} 
                    className="w-16 bg-white border border-slate-200 p-2 rounded-xl font-black text-center text-indigo-600" 
                    readOnly={isLocked}
                  />
                  <span className="text-xs font-black text-slate-400">%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-amber-600 font-bold bg-amber-50 px-4 py-2 rounded-xl inline-block">
            * El total debe sumar 100%. Las notas parciales se calcularán automáticamente.
          </p>
        </div>
      )}

      {/* Main View Area */}
      {!selectedGrade ? (
        /* FOLDER GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-6 duration-500">
          {filteredGrades.map((grade) => {
            const count = students.filter(s => s.grade === grade).length;
            return (
              <button 
                key={grade}
                onClick={() => { setSelectedGrade(grade); setPlanillaStatus(PlanillaStatus.DRAFT); }}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FileSpreadsheet size={80} />
                </div>
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] inline-block mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{grade}</h3>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{count} Estudiantes</span>
                </div>
                <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                  Abrir Planilla <ChevronRight size={12} />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* SPREADSHEET TABLE VIEW */
        <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in-95 duration-500 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-50">
             <div className="flex items-center gap-3">
                <Users size={18} className="text-indigo-600" />
                <span className="text-sm font-black text-slate-800 uppercase tracking-widest">{getStudentsInGrade(selectedGrade).length} Estudiantes</span>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setShowConfig(!showConfig)} className="p-3 bg-white text-slate-500 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"><Settings size={18} /></button>
                <button className="p-3 bg-white text-slate-500 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"><History size={18} /></button>
                <div className="w-[1px] h-10 bg-slate-100 mx-2"></div>
                <button className="p-3 bg-white text-slate-500 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"><Download size={18} /></button>
                <button className="p-3 bg-white text-slate-500 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"><Printer size={18} /></button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="sticky left-0 bg-slate-50 px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[280px] z-20">Estudiante</th>
                  {SUBJECTS.map(sub => (
                    <th key={sub.id} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center border-l border-slate-100 min-w-[130px]">
                      <span className="block">{sub.id}</span>
                      <span className="text-[8px] opacity-60 font-medium">{sub.name.slice(0, 10)}...</span>
                    </th>
                  ))}
                  <th className="px-8 py-5 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] text-center border-l border-indigo-100 bg-indigo-50/30 sticky right-0 z-20">Definitiva P{activePeriod}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {getStudentsInGrade(selectedGrade).map((s, idx) => (
                  <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="sticky left-0 bg-white group-hover:bg-indigo-50/20 px-8 py-4 border-r border-slate-100 z-10">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-300 w-4">{idx + 1}</span>
                        <img src={s.avatar} className="w-10 h-10 rounded-xl shadow-sm" alt="" />
                        <div>
                           <p className="text-sm font-bold text-slate-800 leading-none mb-1">{s.name}</p>
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{s.documentType}: {s.documentNumber}</p>
                        </div>
                      </div>
                    </td>
                    {SUBJECTS.map(sub => {
                      const randomScore = parseFloat((Math.random() * 2 + 3).toFixed(1));
                      return (
                        <td key={sub.id} className="px-4 py-3 text-center border-l border-slate-50">
                          <div className="flex flex-col items-center gap-1.5">
                            <input 
                              type="number" step="0.1" min="1.0" max="5.0"
                              readOnly={isLocked}
                              className={`w-14 px-2 py-2 text-center border rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-black text-sm transition-all outline-none ${getPerformanceClass(randomScore)} ${isLocked ? 'cursor-not-allowed opacity-80' : ''}`}
                              defaultValue={randomScore}
                            />
                            {!isLocked && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-8 py-4 text-center border-l border-indigo-100 bg-indigo-50/10 sticky right-0 z-10 group-hover:bg-indigo-50">
                      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 shadow-sm text-xs font-black ${
                        isLocked ? 'border-indigo-400 text-indigo-800' : 'border-indigo-200 text-indigo-700'
                      }`}>
                        {s.averageGrade.toFixed(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-8 justify-center md:justify-start">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.6 - 5.0 Superior</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.0 - 4.5 Alto</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3.0 - 3.9 Básico</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1.0 - 2.9 Bajo</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeSheet;
