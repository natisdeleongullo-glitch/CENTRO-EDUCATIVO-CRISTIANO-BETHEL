
import React, { useState } from 'react';
import { User, UserRole, InstitutionInfo, Student, Teacher } from './types';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard'; // Default/Generic Dashboard
import Academic from './views/Academic';
import AnalyticsIA from './views/AnalyticsIA';
import Settings from './views/Settings';
import Teachers from './views/Teachers';
import Reports from './views/Reports';
import GradeSheet from './views/GradeSheet';
import AdminPanel from './views/AdminPanel';
import Login from './views/Login'; 
import { AdminDashboard, SecretaryDashboard, GradeSelector } from './views/RoleDashboards'; // Imported new views
import { DEFAULT_INSTITUTION, MOCK_STUDENTS, NAVIGATION_ITEMS, MOCK_TEACHERS } from './constants';
import { 
  UserCheck, 
  Mailbox, 
  ChevronRight, 
  Construction, 
  AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [institution, setInstitution] = useState<InstitutionInfo>(DEFAULT_INSTITUTION);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  
  // Authentication State - Defaulting to ADMIN user to bypass Login
  const [user, setUser] = useState<User | null>({
    id: 'admin-1',
    name: 'Breiner Barraza',
    role: UserRole.ADMIN,
    email: 'rectoria@bethel.edu',
    avatar: 'https://picsum.photos/seed/rector/100/100'
  });
  
  // Routing State - Defaulting to Admin Dashboard
  const [activeTab, setActiveTab] = useState('dashboard_admin');
  const [activePeriod, setActivePeriod] = useState(2);
  const [currentGradeContext, setCurrentGradeContext] = useState<string | null>(null); // For teachers
  
  // Mock Login Handler with Redirect Middleware Logic
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    
    const mockUsers: User[] = [
      {
        id: 'admin-1',
        name: 'Breiner Barraza',
        role: UserRole.ADMIN,
        email: 'rectoria@bethel.edu',
        avatar: 'https://picsum.photos/seed/rector/100/100'
      },
      {
        id: 'coord-1',
        name: 'María González',
        role: UserRole.COORDINATOR,
        email: 'coord@bethel.edu',
        avatar: 'https://picsum.photos/seed/coord/100/100'
      },
      ...teachers, 
      ...students 
    ];

    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      setUser(foundUser);
      
      // --- REDIRECTION LOGIC BASED ON ROLE ---
      if (foundUser.role === UserRole.ADMIN) {
        setActiveTab('dashboard_admin');
      } else if (foundUser.role === UserRole.COORDINATOR) {
        setActiveTab('dashboard_secretary');
      } else if (foundUser.role === UserRole.TEACHER) {
        const teacher = foundUser as Teacher;
        // Check assigned grades
        if (teacher.assignedGradeIds && teacher.assignedGradeIds.length === 1) {
          // Single grade -> Direct redirect
          const gradeId = teacher.assignedGradeIds[0];
          setCurrentGradeContext(gradeId);
          setActiveTab(gradeId); // Go directly to that grade's view (using gradeId as tab ID)
        } else if (teacher.assignedGradeIds && teacher.assignedGradeIds.length > 1) {
          // Multiple grades -> Grade Selector
          setActiveTab('grade_selector');
        } else {
           // Fallback for no grades
           alert("No tiene grados asignados. Contacte al administrador.");
           setActiveTab('dashboard'); 
        }
      } else {
        // Students/Parents
        setActiveTab('dashboard');
      }

      return true;
    }
    
    // Fallback Admin Demo
    if (email.includes('admin')) {
       setUser({
         id: 'admin-temp',
         name: 'Administrador Demo',
         role: UserRole.ADMIN,
         email: email,
         avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
       });
       setActiveTab('dashboard_admin');
       return true;
    }

    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentGradeContext(null);
  };

  const handleGradeSelection = (gradeId: string) => {
    setCurrentGradeContext(gradeId);
    setActiveTab(gradeId);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };
  
  const addStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, { ...newStudent, id: Date.now().toString() }]);
  };

  const addTeacher = (newTeacher: Teacher) => setTeachers(prev => [...prev, newTeacher]);
  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
  };
  const deleteTeacher = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta cuenta de docente?')) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  // If user is not authenticated, render Login view
  if (!user) {
    return <Login institution={institution} onLogin={handleLogin} />;
  }

  // Helper to render content based on active tab
  const renderContent = () => {
    // Dynamic Grade Routing
    if (activeTab.startsWith('grade_')) {
      const findGradeLabel = (id: string) => {
        const section = NAVIGATION_ITEMS.find(n => n.id === 'estudiantes_seccion');
        const child = section?.children?.find(c => c.id === id);
        return child?.label || 'Grado';
      };
      const gradeLabel = findGradeLabel(activeTab);
      
      // TEACHER DASHBOARD VIEW (When inside a grade)
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
           {/* Context Header for Teachers */}
           {user.role === UserRole.TEACHER && (
             <div className="flex items-center justify-between bg-indigo-900 text-white p-6 rounded-[2rem] shadow-lg mb-6">
                <div>
                   <h2 className="text-2xl font-black">Aula Virtual: {gradeLabel}</h2>
                   <p className="text-indigo-200 text-sm font-medium">Gestionando {students.filter(s => s.grade === gradeLabel).length} estudiantes</p>
                </div>
                {(user as Teacher).assignedGradeIds && (user as Teacher).assignedGradeIds!.length > 1 && (
                  <button 
                    onClick={() => setActiveTab('grade_selector')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cambiar Grado
                  </button>
                )}
             </div>
           )}

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
               <UserCheck size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Listado: {gradeLabel}</h2>
              <p className="text-slate-500 font-medium">Control académico y expedientes del curso.</p>
            </div>
          </div>
          {/* Reuse Academic View for Grade Dashboard for now */}
          <Academic students={students.filter(s => s.grade === gradeLabel)} onUpdateStudent={updateStudent} onAddStudent={addStudent} />
        </div>
      );
    }

    switch (activeTab) {
      // Role Specific Dashboards
      case 'dashboard_admin': return <AdminDashboard />;
      case 'dashboard_secretary': return <SecretaryDashboard />;
      case 'grade_selector': 
        return (
           <GradeSelector 
             grades={(user as Teacher).assignedGrades} 
             gradeIds={(user as Teacher).assignedGradeIds || []} 
             onSelect={handleGradeSelection} 
             user={user}
           />
        );

      case 'dashboard': return <Dashboard />; // Generic/Student Dashboard
      case 'teachers': return <Teachers teachers={teachers} onAddTeacher={addTeacher} onUpdateTeacher={updateTeacher} onDeleteTeacher={deleteTeacher} />;
      case 'academic': return <Academic students={students} onUpdateStudent={updateStudent} onAddStudent={addStudent} />;
      case 'analytics': return <AnalyticsIA />;
      case 'settings': return <Settings institution={institution} onUpdate={setInstitution} />;
      case 'boletines': return <Reports students={students} institution={institution} activePeriod={activePeriod} />;
      case 'calificaciones_consolidadas': return <GradeSheet students={students} institution={institution} activePeriod={activePeriod} onPeriodChange={setActivePeriod} />;
      
      // Admin Panel Views
      case 'admin_roles': return <AdminPanel view="roles" />;
      case 'admin_audit': return <AdminPanel view="audit" />;

      case 'calificaciones_individuales':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><UserCheck size={32} /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Expedientes de Estudiantes</h3>
                <p className="text-slate-500">Acceso a carpetas académicas y observador del alumno.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {students.map(s => (
                 <button key={s.id} onClick={() => setActiveTab('academic')} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-400 hover:bg-white transition-all text-left group">
                    <div className="flex items-center gap-4">
                      <img src={s.avatar} className="w-12 h-12 rounded-2xl shadow-sm" alt="" />
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.documentType}: {s.documentNumber}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.grade}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Promedio: {s.averageGrade.toFixed(1)}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                 </button>
               ))}
            </div>
          </div>
        );
      case 'excusas':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Mailbox size={32} /></div>
                <div><h3 className="text-2xl font-black text-slate-800 tracking-tight">Gestión de Inasistencias</h3><p className="text-slate-500">Justificaciones y permisos especiales.</p></div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
               <AlertCircle size={48} className="mb-2 opacity-20" />
               <p className="font-bold">No hay excusas pendientes por revisar.</p>
            </div>
          </div>
        );
      default: return <div className="py-20 text-center"><Construction className="mx-auto mb-4 opacity-20" size={64} /><h3 className="text-xl font-bold">Módulo en Desarrollo</h3></div>;
    }
  };

  return <Layout user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} institution={institution}>{renderContent()}</Layout>;
};

export default App;
