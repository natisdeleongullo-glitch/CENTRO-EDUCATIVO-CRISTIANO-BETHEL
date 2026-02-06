
import React, { useState } from 'react';
import { Teacher, UserRole } from '../types';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Trash2, 
  Edit2, 
  X, 
  Save, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  BadgeCheck,
  BookOpen,
  Calendar,
  Award,
  ArrowLeft
} from 'lucide-react';

interface TeachersProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

const Teachers: React.FC<TeachersProps> = ({ teachers, onAddTeacher, onUpdateTeacher, onDeleteTeacher }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    email: '',
    subject: '',
    phone: '',
    status: 'active',
    assignedGrades: [],
    documentId: '',
    specialization: ''
  });

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({ 
      name: '', 
      email: '', 
      subject: '', 
      phone: '', 
      status: 'active', 
      assignedGrades: [],
      documentId: '',
      specialization: ''
    });
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      const newTeacher: Teacher = {
        ...(formData as Teacher),
        id: `t-${Date.now()}`,
        role: UserRole.TEACHER,
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
      };
      onAddTeacher(newTeacher);
      setIsAdding(false);
    } else if (editingTeacher) {
      onUpdateTeacher({ ...editingTeacher, ...formData } as Teacher);
      setEditingTeacher(null);
      // Actualizar la vista de detalles si está abierta
      if (viewingTeacher?.id === editingTeacher.id) {
        setViewingTeacher({ ...editingTeacher, ...formData } as Teacher);
      }
    }
  };

  const handleEditFromView = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      {/* Vista de Detalle (Expediente) */}
      {viewingTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500 flex flex-col md:flex-row">
            {/* Sidebar del Detalle */}
            <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center text-center">
              <button 
                onClick={() => setViewingTeacher(null)}
                className="self-start p-3 text-slate-400 hover:text-blue-600 rounded-2xl hover:bg-white transition-all mb-6"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-6 opacity-10"></div>
                <img 
                  src={viewingTeacher.avatar} 
                  alt={viewingTeacher.name} 
                  className="w-40 h-40 rounded-[2.5rem] shadow-xl border-4 border-white object-cover relative z-10" 
                />
                <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg z-20 ${viewingTeacher.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">{viewingTeacher.name}</h2>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full mb-8">{viewingTeacher.subject}</p>
              
              <div className="w-full space-y-3 mt-auto">
                <button 
                  onClick={() => handleEditFromView(viewingTeacher)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                >
                  <Edit2 size={18} />
                  Editar Perfil
                </button>
                <button 
                  onClick={() => {
                    onDeleteTeacher(viewingTeacher.id);
                    setViewingTeacher(null);
                  }}
                  className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-3 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={18} />
                  Dar de Baja
                </button>
              </div>
            </div>

            {/* Contenido del Expediente */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Info Profesional */}
                <div className="space-y-8">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      <BadgeCheck size={16} className="text-blue-500" />
                      Perfil Profesional
                    </h4>
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium mb-1">Especialización</p>
                      <p className="text-base font-bold text-slate-800 mb-4">{viewingTeacher.specialization || 'No especificada'}</p>
                      <p className="text-sm text-slate-500 font-medium mb-1">Cédula de Ciudadanía</p>
                      <p className="text-base font-mono font-bold text-slate-700">{viewingTeacher.documentId || 'No registrada'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      <Mail size={16} className="text-blue-500" />
                      Contacto Institucional
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Correo</p>
                          <p className="text-sm font-bold text-slate-700">{viewingTeacher.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Teléfono</p>
                          <p className="text-sm font-bold text-slate-700">{viewingTeacher.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Académica */}
                <div className="space-y-8">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      <BookOpen size={16} className="text-blue-500" />
                      Carga de Cursos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingTeacher.assignedGrades.map((grade, idx) => (
                        <span key={idx} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-2xl shadow-sm">
                          {grade}
                        </span>
                      ))}
                      {viewingTeacher.assignedGrades.length === 0 && (
                        <div className="w-full p-6 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs font-medium italic">
                          Sin grupos asignados para el periodo actual
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      <Award size={16} className="text-blue-500" />
                      Rendimiento Docente
                    </h4>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Calificación SIEE</p>
                        <span className="text-2xl font-black">4.9</span>
                      </div>
                      <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-white w-[98%]"></div>
                      </div>
                      <p className="text-[10px] font-medium text-blue-50">Basado en la evaluación institucional 2024-1</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                 <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Observaciones Administrativas</h5>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                   Docente con excelente puntualidad y compromiso con el modelo pedagógico bilingüe. Participa activamente en los comités de convivencia y lidera el proyecto de semilleros de investigación.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Herramientas Superior */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-[450px] group">
          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-lg group-focus-within:bg-blue-500/10 transition-all"></div>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, materia o cargo..." 
            className="w-full relative pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm font-semibold text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 group"
        >
          <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Vincular Docente</span>
        </button>
      </div>

      {/* Rejilla de Tarjetas de Docentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTeachers.map((teacher) => (
          <div 
            key={teacher.id} 
            className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden"
          >
            {/* Fondo decorativo sutil */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150"></div>
            
            {/* Cabecera de la Tarjeta */}
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="relative group/avatar cursor-pointer" onClick={() => setViewingTeacher(teacher)}>
                <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-6 scale-105 opacity-0 group-hover/avatar:opacity-10 transition-opacity"></div>
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name} 
                  className="w-20 h-20 rounded-[2rem] shadow-lg border-4 border-white object-cover relative z-10" 
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-20 ${teacher.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingTeacher(teacher);
                    setFormData(teacher);
                    setIsAdding(false);
                  }}
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-blue-200"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => onDeleteTeacher(teacher.id)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Información Principal */}
            <div className="mb-8 relative z-10">
              <h3 
                className="text-xl font-black text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => setViewingTeacher(teacher)}
              >
                {teacher.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Briefcase size={12} />
                </div>
                <p className="text-xs text-blue-700 font-black uppercase tracking-[0.1em]">{teacher.subject}</p>
              </div>
            </div>

            {/* Detalles de Contacto */}
            <div className="space-y-4 mb-8 flex-1 relative z-10">
              <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-blue-100 transition-all group/info">
                <div className="p-2.5 bg-white text-blue-500 rounded-xl shadow-sm border border-slate-100 group-hover/info:bg-blue-600 group-hover/info:text-white transition-all">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-bold text-slate-600 truncate">{teacher.email}</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-blue-100 transition-all group/info">
                <div className="p-2.5 bg-white text-indigo-500 rounded-xl shadow-sm border border-slate-100 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-all">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-bold text-slate-600">{teacher.phone}</span>
              </div>
            </div>

            {/* Pie de la Tarjeta - Grados */}
            <div className="pt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carga Académica</span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{teacher.assignedGrades.length} Grupos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teacher.assignedGrades.slice(0, 3).map((grade, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl border border-transparent hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-default"
                  >
                    {grade}
                  </span>
                ))}
                {teacher.assignedGrades.length > 3 && (
                  <span className="px-3 py-1.5 text-[10px] font-black text-slate-400">+{teacher.assignedGrades.length - 3} más</span>
                )}
                {teacher.assignedGrades.length === 0 && (
                  <div className="flex items-center gap-2 text-slate-400 italic text-[11px] py-1">
                    <ShieldCheck size={14} />
                    Sin grupos asignados actualmente
                  </div>
                )}
              </div>
            </div>

            {/* Acción de navegación rápida */}
            <button 
              onClick={() => setViewingTeacher(teacher)}
              className="mt-6 w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-blue-600"
            >
              <ExternalLink size={14} />
              Ver Expediente Completo
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Creación/Edición Mejorado */}
      {(isAdding || editingTeacher) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isAdding ? 'Vincular Nuevo Talento' : 'Actualizar Perfil'}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {isAdding ? 'Completa los datos para crear el acceso institucional.' : 'Modifica la información profesional del docente.'}
                </p>
              </div>
              <button 
                onClick={() => { setIsAdding(false); setEditingTeacher(null); }}
                className="p-3 text-slate-400 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-all"
              >
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Información Personal</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Nombre Completo del Docente"
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:font-medium"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="email@bethel.edu"
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Teléfono Movil</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+57 300 000 0000"
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Cédula / ID</label>
                    <input 
                      type="text" 
                      value={formData.documentId}
                      onChange={e => setFormData({...formData, documentId: e.target.value})}
                      placeholder="No. Documento"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Especialidad</label>
                    <input 
                      type="text" 
                      value={formData.specialization}
                      onChange={e => setFormData({...formData, specialization: e.target.value})}
                      placeholder="Ej: Lic. Matemáticas"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Asignatura Principal</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      placeholder="Ej: Matemáticas Superiores"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Estado de la Cuenta</label>
                  <div className="flex gap-4">
                    {['active', 'inactive'].map((st) => (
                      <button 
                        key={st}
                        type="button"
                        onClick={() => setFormData({...formData, status: st as any})}
                        className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.15em] transition-all border-2 ${
                          formData.status === st 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                        }`}
                      >
                        {st === 'active' ? 'Perfil Activo' : 'Perfil Inactivo'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingTeacher(null); }}
                  className="flex-1 py-5 text-slate-500 font-bold hover:bg-slate-50 rounded-[1.5rem] transition-all order-2 md:order-1"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-blue-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 order-1 md:order-2 active:scale-95 group"
                >
                  <Save size={20} className="group-hover:scale-110 transition-transform" />
                  {isAdding ? 'Vincular Docente' : 'Actualizar Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
