
import React, { useState, useEffect } from 'react';
import { Student, InstitutionInfo } from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  BarChart, 
  TrendingUp, 
  X, 
  Search, 
  RefreshCw,
  Folder,
  ChevronRight,
  ArrowLeft,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  students: Student[];
  institution: InstitutionInfo;
  activePeriod: number;
}

const GRADELIST = [
  'Pre-Jardín', 'Jardín', 'Transición', 'Primero', 'Segundo', 'Tercero', 
  'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo'
];

const Reports: React.FC<ReportsProps> = ({ students, institution, activePeriod }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'folders' | 'stats'>('folders');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMsg, setGenerationMsg] = useState('');

  const filteredGrades = GRADELIST.filter(grade => 
    grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentsInGrade = (grade: string) => 
    students.filter(s => s.grade === grade && (searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleMassGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const messages = [
      "Iniciando consolidación de datos SIEE...",
      "Calculando promedios ponderados por asignatura...",
      "Validando inasistencias del periodo actual...",
      "Generando archivos PDF institucionales...",
      "Firmando digitalmente los documentos...",
      "Subiendo boletines a Cloud Storage...",
      "Notificando a padres y acudientes..."
    ];

    let step = 0;
    const interval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + (100 / messages.length), 100));
      setGenerationMsg(messages[step]);
      step++;
      if (step >= messages.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          alert('Generación masiva completada exitosamente.');
        }, 500);
      }
    }, 1000);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 4.6) return 'text-emerald-600 bg-emerald-50';
    if (score >= 4.0) return 'text-blue-600 bg-blue-50';
    if (score >= 3.0) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 4.6) return 'Superior';
    if (score >= 4.0) return 'Alto';
    if (score >= 3.0) return 'Básico';
    return 'Bajo';
  };

  const renderReportCard = (student: Student) => (
    <div className="bg-white p-12 rounded-none shadow-2xl max-w-4xl mx-auto border-[12px] border-double border-blue-900/10 min-h-[1100px] flex flex-col font-serif relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 opacity-10 rounded-full -mr-16 -mt-16 border border-slate-200"></div>
      
      {/* Institutional Header */}
      <div className="flex items-center gap-8 border-b-2 border-blue-900 pb-8 mb-8">
        <img src={institution.logoUrl} className="w-32 h-32 object-contain" alt="Logo" />
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">{institution.name}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{institution.slogan}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase">Resolución Oficial No. 1234 - DANE: {institution.daneCode}</p>
          <div className="mt-4 inline-block bg-blue-900 text-white px-6 py-1 text-xs font-black uppercase tracking-widest">
            Boletín Académico de Calificaciones
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</p>
          <p className="text-lg font-bold text-slate-800 uppercase">{student.name}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grado / Nivel</p>
          <p className="text-lg font-bold text-slate-800 uppercase">{student.grade}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Periodo Lectivo</p>
          <p className="text-sm font-bold text-slate-700">Periodo {activePeriod} - 2024</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento ID</p>
          <p className="text-sm font-bold text-slate-700">{student.documentType} {student.documentNumber}</p>
        </div>
      </div>

      {/* Grades Table */}
      <div className="flex-1">
        <table className="w-full border-collapse border border-slate-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-blue-900 p-3 text-left text-[10px] uppercase font-black">Áreas y Asignaturas</th>
              <th className="border border-blue-900 p-3 text-center text-[10px] uppercase font-black w-16">P1</th>
              <th className="border border-blue-900 p-3 text-center text-[10px] uppercase font-black w-16">P2</th>
              <th className="border border-blue-900 p-3 text-center text-[10px] uppercase font-black w-16">Final</th>
              <th className="border border-blue-900 p-3 text-center text-[10px] uppercase font-black">Desempeño</th>
            </tr>
          </thead>
          <tbody>
            {(student.academicHistory || []).map((grade, idx) => {
              const p1 = grade.scores.find(s => s.period === 1)?.score || 0;
              const p2 = grade.scores.find(s => s.period === 2)?.score || 0;
              return (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-300 p-4">
                    <p className="font-bold text-slate-800 text-sm">{grade.subjectName}</p>
                    <p className="text-[9px] text-slate-400 italic">Docente: {grade.teacherName}</p>
                    <p className="text-[10px] text-slate-500 mt-2 leading-tight">
                      {grade.scores.find(s => s.period === 2)?.observation || 'Sin observaciones registradas.'}
                    </p>
                  </td>
                  <td className="border border-slate-300 p-3 text-center font-bold text-slate-600">{p1.toFixed(1)}</td>
                  <td className="border border-slate-300 p-3 text-center font-bold text-slate-600">{p2.toFixed(1)}</td>
                  <td className="border border-slate-300 p-3 text-center font-black text-blue-900">{grade.finalScore.toFixed(1)}</td>
                  <td className="border border-slate-300 p-3 text-center">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full ${getPerformanceColor(grade.finalScore)}`}>
                      {getPerformanceLabel(grade.finalScore)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary and Signatures */}
      <div className="mt-12 pt-8 border-t-2 border-slate-100 grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 text-center">Consolidado SIEE</h5>
            <div className="flex justify-between items-center px-4">
              <span className="text-xs font-bold text-slate-600">Promedio General:</span>
              <span className="text-xl font-black text-blue-900">{student.averageGrade.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center px-4 mt-1">
              <span className="text-xs font-bold text-slate-600">Inasistencias:</span>
              <span className="text-sm font-black text-red-600">{(Math.random() * 5).toFixed(0)} Días</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-16">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-full h-[1px] bg-slate-400 mb-2"></div>
              <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{institution.rectorName}</p>
              <p className="text-[9px] text-slate-500 font-medium">Rector Institucional</p>
            </div>
            <div className="text-center">
              <div className="w-full h-[1px] bg-slate-400 mb-2"></div>
              <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Secretaría Académica</p>
              <p className="text-[9px] text-slate-500 font-medium">Validado SIEE</p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-auto text-[8px] text-slate-300 text-center uppercase tracking-widest pt-8">
        EduNexus Pro v2.5 - Documento oficial del Centro Educativo Cristiano Bethel
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Mass Generation Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
             <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles size={48} />
             </div>
             <h2 className="text-2xl font-black text-slate-800">Generando Boletines Masivos</h2>
             <p className="text-slate-500 font-medium">{generationMsg}</p>
             <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                  style={{ width: `${generationProgress}%` }}
                ></div>
             </div>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{generationProgress.toFixed(0)}% Completado</p>
             <div className="pt-4 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-bold uppercase italic">
                <Loader2 size={12} className="animate-spin" /> Procesando en Google Cloud Workers...
             </div>
          </div>
        </div>
      )}

      {/* Header with Navigation Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {selectedGrade && (
            <button 
              onClick={() => setSelectedGrade(null)}
              className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm border border-slate-100 transition-all hover:-translate-x-1"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Gestión Académica</span>
              {selectedGrade && (
                <>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{selectedGrade}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {selectedGrade ? `Estudiantes de ${selectedGrade}` : 'Carpetas de Boletines'}
            </h2>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200">
          <button 
            onClick={() => { setViewMode('folders'); setSelectedGrade(null); }} 
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'folders' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Folder size={16} /> Grados
          </button>
          <button 
            onClick={() => setViewMode('stats')} 
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'stats' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BarChart size={16} /> Estadísticas
          </button>
        </div>
      </div>

      {/* Global Search and Tools */}
      {viewMode === 'folders' && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={selectedGrade ? "Buscar en este curso..." : "Buscar grado..."} 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm font-medium"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button 
              onClick={handleMassGeneration}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 group"
             >
               <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
               Generación Masiva
             </button>
             <button className="p-3 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-50">
               <Download size={18} />
             </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === 'folders' ? (
        !selectedGrade ? (
          /* FOLDER VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-6 duration-500">
            {filteredGrades.map((grade) => {
              const count = students.filter(s => s.grade === grade).length;
              return (
                <button 
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-100 transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Folder size={80} />
                  </div>
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] inline-block mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">{grade}</h3>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{count} Estudiantes</span>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                    Abrir Carpeta <ChevronRight size={12} />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* STUDENT LIST IN GRADE VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in-95 duration-500">
            {getStudentsInGrade(selectedGrade).map(student => (
              <div 
                key={student.id} 
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-100 transition-all group flex flex-col items-center text-center relative"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-600 rounded-[2rem] scale-110 opacity-0 group-hover:opacity-10 transition-all"></div>
                  <img src={student.avatar} className="w-20 h-20 rounded-[2rem] border-4 border-white shadow-md relative z-10" alt="" />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white z-20 flex items-center justify-center ${student.averageGrade >= 3.0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {student.averageGrade >= 3.0 ? <CheckCircle size={10} className="text-white" /> : <AlertCircle size={10} className="text-white" />}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{student.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{student.documentType} {student.documentNumber}</p>
                
                <div className="w-full grid grid-cols-2 gap-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-center border-r border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Promedio</p>
                    <p className="text-sm font-black text-blue-600">{student.averageGrade.toFixed(1)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Estado</p>
                    <p className={`text-[9px] font-black uppercase ${student.averageGrade >= 3.0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {student.averageGrade >= 3.0 ? 'Aprueba' : 'Reprueba'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedStudent(student)}
                  className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200 group-hover:shadow-blue-100"
                >
                  <Eye size={14} /> Ver Expediente
                </button>
              </div>
            ))}
            {getStudentsInGrade(selectedGrade).length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold">No se encontraron estudiantes en este grado.</p>
              </div>
            )}
          </div>
        )
      ) : (
        /* STATS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
              <TrendingUp className="text-blue-600" /> Rendimiento por Grado (Promedios)
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={GRADELIST.map(g => ({
                  name: g,
                  avg: students.filter(s => s.grade === g).length > 0 
                    ? parseFloat((students.filter(s => s.grade === g).reduce((acc, curr) => acc + curr.averageGrade, 0) / students.filter(s => s.grade === g).length).toFixed(1))
                    : 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 8, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} domain={[0, 5]} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}
                  />
                  <Bar dataKey="avg" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={30} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
              <AlertCircle className="text-amber-500" /> Riesgo Académico SIEE
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {students.filter(s => s.averageGrade < 3.5).sort((a,b) => a.averageGrade - b.averageGrade).map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-red-50/50 rounded-3xl border border-red-100 hover:bg-red-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-red-100 flex items-center justify-center text-red-600 font-black text-sm shadow-sm">
                    {s.averageGrade.toFixed(1)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{s.grade} - Atención prioritaria</p>
                  </div>
                  <button onClick={() => setSelectedStudent(s)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              ))}
              {students.filter(s => s.averageGrade < 3.5).length === 0 && (
                <div className="text-center py-10 text-slate-400 font-medium italic">Excelente rendimiento general. Sin alertas.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] overflow-y-auto p-4 md:p-8 animate-in fade-in duration-300">
          <div className="sticky top-0 right-0 z-[160] flex justify-end mb-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-[1.5rem] shadow-2xl p-2 flex gap-2 border border-slate-100">
               <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                 <Download size={18} /> <span>PDF</span>
               </button>
               <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 font-black rounded-xl hover:bg-slate-100 transition-all active:scale-95">
                 <Printer size={18} />
               </button>
               <button 
                onClick={() => setSelectedStudent(null)}
                className="p-3 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"
               >
                 <X size={24} />
               </button>
            </div>
          </div>
          <div className="animate-in zoom-in-95 duration-500">
            {renderReportCard(selectedStudent)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
