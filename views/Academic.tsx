
import React, { useState } from 'react';
import { Student } from '../types';
// Fixed: Added missing 'Plus' icon to the imports
import { Search, UserPlus, Filter, Download, MoreHorizontal, Edit2, X, Save, FileText, MapPin, Phone, User as UserIcon, Plus } from 'lucide-react';

interface AcademicProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onAddStudent: (student: Student) => void;
}

const Academic: React.FC<AcademicProps> = ({ students, onUpdateStudent, onAddStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.documentNumber.includes(searchTerm)
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent(editingStudent);
      setEditingStudent(null);
      setIsAdding(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent({
      id: '', name: '', email: '', role: 2 as any, grade: 'Primero', attendance: 100, averageGrade: 0,
      financialStatus: 'paid', documentType: 'TI', documentNumber: '', address: '', parentName: '', parentPhone: '',
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" placeholder="Buscar por nombre, documento o grado..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm font-medium"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Using the newly imported Plus icon */}
          <button onClick={handleOpenAdd} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"><Plus size={18} /><span>Nueva Matrícula</span></button>
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"><Download size={18} /></button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grado</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Desempeño</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Finanzas</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white" />
                      <div><p className="text-sm font-black text-slate-800">{student.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{student.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-slate-600">{student.documentType} {student.documentNumber}</td>
                  <td className="px-6 py-5"><span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase">{student.grade}</span></td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${student.averageGrade >= 4.0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{student.averageGrade.toFixed(1)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest ${student.financialStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {student.financialStatus === 'paid' ? 'Al día' : 'En Mora'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right"><button onClick={() => setEditingStudent(student)} className="p-2.5 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Matrícula/Edición Completa */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div><h3 className="text-xl font-black text-slate-800">{isAdding ? 'Nueva Matrícula SIEE' : 'Editar Expediente Escolar'}</h3><p className="text-xs text-slate-500 font-medium">Información oficial requerida por la Secretaría de Educación.</p></div>
              <button onClick={() => setEditingStudent(null)} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><UserIcon size={12}/> Nombre Completo del Estudiante</label>
                    <input type="text" required value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-800" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><FileText size={12}/> Tipo y No. de Documento</label>
                    <div className="flex gap-2">
                      <select value={editingStudent.documentType} onChange={e => setEditingStudent({...editingStudent, documentType: e.target.value as any})} className="w-24 px-2 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
                        <option value="TI">TI</option><option value="RC">RC</option><option value="CE">CE</option><option value="PEP">PEP</option>
                      </select>
                      <input type="text" value={editingStudent.documentNumber} onChange={e => setEditingStudent({...editingStudent, documentNumber: e.target.value})} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><MapPin size={12}/> Dirección de Residencia</label>
                    <input type="text" value={editingStudent.address} onChange={e => setEditingStudent({...editingStudent, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="md:col-span-2"><h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Información del Acudiente</h4></div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nombre del Padre/Madre</label>
                    <input type="text" value={editingStudent.parentName} onChange={e => setEditingStudent({...editingStudent, parentName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2"><Phone size={12}/> Teléfono de Contacto</label>
                    <input type="tel" value={editingStudent.parentPhone} onChange={e => setEditingStudent({...editingStudent, parentPhone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"><Save size={20} />{isAdding ? 'Legalizar Matrícula' : 'Actualizar Expediente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academic;
