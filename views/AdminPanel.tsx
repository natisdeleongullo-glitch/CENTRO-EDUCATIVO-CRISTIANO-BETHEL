
import React, { useState } from 'react';
import { User, UserRole, Role, Permission, AuditLog, UserRoleAssignment } from '../types';
import { MOCK_TEACHERS } from '../constants'; // Import Teachers
import { 
  Shield, 
  Fingerprint, 
  History, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight, 
  UserPlus, 
  Calendar,
  Eye,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Database,
  Key,
  Copy
} from 'lucide-react';

interface AdminPanelProps {
  view: 'roles' | 'audit';
}

const MOCK_PERMISSIONS: Permission[] = [
  { id: 'p1', code: 'users.read', resource: 'Usuarios', action: 'Lectura', description: 'Ver lista de usuarios y perfiles.' },
  { id: 'p2', code: 'users.create', resource: 'Usuarios', action: 'Creación', description: 'Vincular nuevos usuarios.' },
  { id: 'p3', code: 'planillas.update', resource: 'Planillas', action: 'Edición', description: 'Modificar celdas de calificaciones.' },
  { id: 'p4', code: 'planillas.validate', resource: 'Planillas', action: 'Validación', description: 'Aprobar o rechazar planillas SIEE.' },
  { id: 'p5', code: 'boletines.generate', resource: 'Boletines', action: 'Generación', description: 'Generar PDFs institucionales.' },
  { id: 'p6', code: 'audit.read', resource: 'Auditoría', action: 'Lectura', description: 'Ver logs de trazabilidad.' },
];

const MOCK_ROLES: Role[] = [
  { id: 'r1', name: 'Administrador Senior', description: 'Acceso total a todos los módulos y seguridad.', permissions: MOCK_PERMISSIONS.map(p => p.code) },
  { id: 'r2', name: 'Coordinador Académico', description: 'Gestión de planillas, boletines y validaciones.', permissions: ['users.read', 'planillas.update', 'planillas.validate', 'boletines.generate'] },
  { id: 'r3', name: 'Docente Titular', description: 'Ingreso de notas y gestión de sus grupos.', permissions: ['users.read', 'planillas.update'] },
];

const MOCK_AUDIT: AuditLog[] = [
  { id: 'a1', userId: 'admin-1', userName: 'Breiner Barraza', entityType: 'Planilla', entityId: '8vo-MAT-P2', action: 'Validación', changeSummary: 'Aprobó planilla de Matemáticas 8º.', beforeData: { status: 'EN REVISIÓN' }, afterData: { status: 'APROBADO' }, timestamp: '2024-05-20T10:30:00Z', ipAddress: '192.168.1.45' },
  { id: 'a2', userId: 't-1', userName: 'Carlos Méndez', entityType: 'Planilla', entityId: '8vo-MAT-P2', action: 'Actualización', changeSummary: 'Modificó 15 celdas de calificaciones.', timestamp: '2024-05-20T09:15:00Z', ipAddress: '192.168.1.12' },
  { id: 'a3', userId: 'admin-1', userName: 'Breiner Barraza', entityType: 'Rol', entityId: 'r2', action: 'Actualización', changeSummary: 'Modificó permisos del rol Coordinador.', timestamp: '2024-05-19T16:45:00Z', ipAddress: '192.168.1.45' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ view }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [auditFilter, setAuditFilter] = useState({ entity: '', action: '' });

  const renderRolesView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" placeholder="Buscar roles..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm font-medium"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setSelectedRole(null); setShowRoleEditor(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /><span>Crear Nuevo Rol</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ROLES.map(role => (
          <div key={role.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Shield size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setSelectedRole(role); setShowRoleEditor(true); }} className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50"><Edit2 size={16} /></button>
                <button className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">{role.name}</h3>
            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{role.description}</p>
            
            <div className="pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Privilegios Activos</span>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{role.permissions.length} Permisos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.slice(0, 3).map(p => (
                  <span key={p} className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black rounded-lg border border-slate-100">{p}</span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="text-[9px] text-slate-400 font-bold">+{role.permissions.length - 3} más</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREDENTIALS SECTION */}
      <div className="mt-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-indigo-50/30">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-white border border-indigo-100 rounded-xl text-indigo-600 shadow-sm"><Key size={24} /></div>
             <div>
                <h3 className="text-xl font-black text-slate-800">Credenciales de Acceso (Modo Demo)</h3>
                <p className="text-sm text-slate-500 font-medium">Lista de usuarios docentes y sus credenciales para pruebas.</p>
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grados Asignados</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Docente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario (Email)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TEACHERS.map(teacher => (
                <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.assignedGrades.map((g, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <img src={teacher.avatar} className="w-8 h-8 rounded-full" alt="" />
                        <span className="text-sm font-bold text-slate-800">{teacher.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { navigator.clipboard.writeText(teacher.email); alert('Email copiado'); }}>
                        <span className="text-sm font-mono text-slate-600">{teacher.email}</span>
                        <Copy size={12} className="text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-sm font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">12345</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-amber-50/30">
                  <td className="px-8 py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg">GLOBAL</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-slate-800">Administrador / Rector</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">rectoria@bethel.edu</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">12345</span></td>
              </tr>
              <tr className="bg-purple-50/30">
                  <td className="px-8 py-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-lg">GLOBAL</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-slate-800">Coordinadora / Secretaria</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-mono text-slate-600">coord@bethel.edu</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">12345</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Editor Modal */}
      {showRoleEditor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800">{selectedRole ? 'Editar Definición de Rol' : 'Configurar Nuevo Rol'}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Define el alcance y permisos granulares del perfil.</p>
              </div>
              <button onClick={() => setShowRoleEditor(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"><XCircle size={28} /></button>
            </div>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identificador del Rol</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" defaultValue={selectedRole?.name} placeholder="Ej: Coordinador de Convivencia" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Descripción de Responsabilidades</label>
                  <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm h-24" defaultValue={selectedRole?.description} placeholder="Describe qué acciones realiza este usuario..." />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 border-b border-indigo-100 pb-2">Asignación Granular de Permisos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_PERMISSIONS.map(p => (
                    <label key={p.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                      <div className="mt-1">
                        <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" defaultChecked={selectedRole?.permissions.includes(p.code)} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{p.resource}: {p.action}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{p.description}</p>
                        <code className="text-[8px] bg-white px-2 py-0.5 rounded border border-slate-100 mt-2 inline-block text-slate-500 font-mono">{p.code}</code>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button onClick={() => setShowRoleEditor(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
              <button onClick={() => { setShowRoleEditor(false); alert('Rol guardado exitosamente.'); }} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">Guardar Definición</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAuditView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Database size={100} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
             <History className="text-indigo-400" size={32} />
             <h2 className="text-2xl font-black">Libro Maestro de Auditoría</h2>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Registro inmutable de todas las acciones críticas realizadas en la plataforma. Este log cumple con los estándares SIEE para trazabilidad institucional y protección de datos (Habeas Data).
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
          <input type="text" placeholder="Filtrar por usuario o entidad..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium" />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-100">
            <option>Todas las Entidades</option>
            <option>Planilla</option>
            <option>Usuario</option>
            <option>Rol</option>
          </select>
          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha y Hora</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsable</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entidad</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumen de Cambio</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_AUDIT.map(log => (
                <tr key={log.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{new Date(log.timestamp).toLocaleDateString()}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">{log.userName[0]}</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{log.userName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{log.ipAddress}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      log.action === 'Validación' ? 'bg-emerald-50 text-emerald-600' : 
                      log.action === 'Actualización' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.entityType}</span>
                      <span className="text-xs font-bold text-slate-800">{log.entityId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{log.changeSummary}</td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-800 transition-colors flex items-center justify-center gap-2 mx-auto">
            Ver logs históricos completos (BigQuery Sync) <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {view === 'roles' ? renderRolesView() : renderAuditView()}
    </div>
  );
};

export default AdminPanel;
