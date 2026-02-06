
import React from 'react';
import { UserRole, Student, PaymentRecord, InstitutionInfo, Teacher, SubjectGrade } from './types';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Wallet, 
  MessageSquare, 
  ShieldAlert, 
  BarChart3, 
  Settings as SettingsIcon,
  BookOpen,
  ClipboardList,
  FileText,
  MailQuestion,
  Search,
  School,
  Briefcase,
  ShieldCheck,
  Fingerprint,
  History
} from 'lucide-react';

export const DEFAULT_INSTITUTION: InstitutionInfo = {
  name: 'Centro Educativo Cristiano Bethel',
  slogan: 'Dios, Disciplina y Excelencia',
  location: 'Albania, La Guajira',
  logoUrl: 'https://i.postimg.cc/85zPzW6b/logo-bethel.png',
  daneCode: '144035000123',
  nit: '800.123.456-7',
  rectorName: 'Breiner Barraza'
};

const MOCK_HISTORY: SubjectGrade[] = [
  {
    subjectName: 'Matemáticas',
    teacherName: 'Prof. Carlos Méndez',
    scores: [
      { period: 1, score: 4.8, absences: 0, observation: 'Excelente desempeño lógico.' },
      { period: 2, score: 4.5, absences: 1, observation: 'Mantiene buen ritmo.' }
    ],
    finalScore: 4.65
  },
  {
    subjectName: 'Lengua Castellana',
    teacherName: 'Dra. Elena Santos',
    scores: [
      { period: 1, score: 4.2, absences: 2, observation: 'Buena comprensión lectora.' },
      { period: 2, score: 4.4, absences: 0, observation: 'Mejoría notable en ortografía.' }
    ],
    finalScore: 4.3
  },
  {
    subjectName: 'Inglés',
    teacherName: 'Prof. Jairo Ortiz',
    scores: [
      { period: 1, score: 5.0, absences: 0, observation: 'Nivel bilingüe avanzado.' },
      { period: 2, score: 4.9, absences: 0, observation: 'Liderazgo en clase.' }
    ],
    finalScore: 4.95
  }
];

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  isSection?: boolean;
  children?: NavItem[];
}

const GRADE_ROLES = [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER];

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  
  {
    id: 'estudiantes_seccion',
    label: 'Estudiantes',
    icon: <Users size={20} />,
    isSection: true,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER],
    children: [
      { id: 'grade_prejardin', label: 'Pre-Jardín', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_jardin', label: 'Jardín', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_transicion', label: 'Transición', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_primero', label: 'Primero', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_segundo', label: 'Segundo', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_tercero', label: 'Tercero', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_cuarto', label: 'Cuarto', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_quinto', label: 'Quinto', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_sexto', label: 'Sexto', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_septimo', label: 'Séptimo', icon: <School size={16} />, roles: GRADE_ROLES },
      { id: 'grade_octavo', label: 'Octavo', icon: <School size={16} />, roles: GRADE_ROLES },
    ]
  },

  { id: 'teachers', label: 'Docentes', icon: <Briefcase size={20} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR] },
  { id: 'academic', label: 'Matrículas', icon: <GraduationCap size={20} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER] },
  
  { 
    id: 'seguimiento', 
    label: 'Seguimiento', 
    icon: <ClipboardList size={20} />, 
    isSection: true,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    children: [
      { 
        id: 'calificaciones', 
        label: 'Calificaciones', 
        icon: <BookOpen size={18} />, 
        roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
        children: [
          { id: 'calificaciones_consolidadas', label: 'Planilla Auxiliar', icon: <Search size={14} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER] },
          { id: 'calificaciones_individuales', label: 'Expedientes', icon: <Users size={14} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
        ]
      },
      { id: 'boletines', label: 'Boletines', icon: <FileText size={18} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
      { id: 'excusas', label: 'Excusas', icon: <MailQuestion size={18} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
    ]
  },

  { id: 'finance', label: 'Finanzas', icon: <Wallet size={20} />, roles: [UserRole.ADMIN, UserRole.PARENT] },
  { id: 'communication', label: 'Comunicación', icon: <MessageSquare size={20} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'wellbeing', label: 'Bienestar', icon: <ShieldAlert size={20} />, roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER, UserRole.PARENT] },
  { id: 'analytics', label: 'Analítica IA', icon: <BarChart3 size={20} />, roles: [UserRole.ADMIN] },
  
  {
    id: 'admin_panel_section',
    label: 'Administración',
    icon: <ShieldCheck size={20} />,
    isSection: true,
    roles: [UserRole.ADMIN],
    children: [
      { id: 'admin_roles', label: 'Roles y Permisos', icon: <Fingerprint size={16} />, roles: [UserRole.ADMIN] },
      { id: 'admin_audit', label: 'Registro de Auditoría', icon: <History size={16} />, roles: [UserRole.ADMIN] },
      { id: 'settings', label: 'Institución', icon: <SettingsIcon size={16} />, roles: [UserRole.ADMIN] },
    ]
  },
];

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Valentina Rodríguez', role: UserRole.STUDENT, email: 'v.rodriguez@bethel.edu', grade: 'Primero', attendance: 95, averageGrade: 4.8, financialStatus: 'paid', avatar: 'https://picsum.photos/seed/val/100/100', documentType: 'TI', documentNumber: '1082345678', address: 'Calle 5 # 12-34', parentName: 'María Rodríguez', parentPhone: '3001112233', academicHistory: MOCK_HISTORY },
  { id: '2', name: 'Mateo Gómez', role: UserRole.STUDENT, email: 'm.gomez@bethel.edu', grade: 'Primero', attendance: 82, averageGrade: 3.2, financialStatus: 'pending', avatar: 'https://picsum.photos/seed/mat/100/100', documentType: 'RC', documentNumber: '1122334455', address: 'Av. Principal # 3-21', parentName: 'Juan Gómez', parentPhone: '3112223344', academicHistory: MOCK_HISTORY.map(h => ({...h, finalScore: h.finalScore - 1})) },
  { id: '3', name: 'Sofía Martínez', role: UserRole.STUDENT, email: 's.martinez@bethel.edu', grade: 'Jardín', attendance: 98, averageGrade: 4.5, financialStatus: 'paid', avatar: 'https://picsum.photos/seed/sof/100/100', documentType: 'RC', documentNumber: '1099887766', address: 'Barrio El Centro', parentName: 'Lucía Martínez', parentPhone: '3123334455', academicHistory: MOCK_HISTORY },
  { id: '4', name: 'Lucas Herrera', role: UserRole.STUDENT, email: 'l.herrera@bethel.edu', grade: 'Octavo', attendance: 70, averageGrade: 2.9, financialStatus: 'overdue', avatar: 'https://picsum.photos/seed/luc/100/100', documentType: 'TI', documentNumber: '1044556677', address: 'Sector Albania Real', parentName: 'Pedro Herrera', parentPhone: '3134445566', academicHistory: MOCK_HISTORY.map(h => ({...h, finalScore: h.finalScore - 1.5})) },
];

export const MOCK_TEACHERS: Teacher[] = [
  { 
    id: 't1', 
    name: 'Prof. Carlos Méndez', 
    role: UserRole.TEACHER, 
    email: 'c.mendez@bethel.edu', 
    subject: 'Matemáticas', 
    phone: '3001234567', 
    status: 'active', 
    assignedGrades: ['Sexto', 'Séptimo', 'Octavo'], 
    assignedGradeIds: ['grade_sexto', 'grade_septimo', 'grade_octavo'], 
    avatar: 'https://picsum.photos/seed/t1/100/100', 
    documentId: '72123456', 
    specialization: 'Lic. en Matemáticas y Física' 
  },
  { 
    id: 't2', 
    name: 'Dra. Elena Santos', 
    role: UserRole.TEACHER, 
    email: 'e.santos@bethel.edu', 
    subject: 'Ciencias Naturales', 
    phone: '3119876543', 
    status: 'active', 
    assignedGrades: ['Primero'], 
    assignedGradeIds: ['grade_primero'], 
    avatar: 'https://picsum.photos/seed/t2/100/100', 
    documentId: '32987654', 
    specialization: 'Dra. en Biología Marina' 
  },
  { 
    id: 't3', 
    name: 'Lic. Ana Torres', 
    role: UserRole.TEACHER, 
    email: 'a.torres@bethel.edu', 
    subject: 'Dimensiones (Pre-escolar)', 
    phone: '3151112233', 
    status: 'active', 
    assignedGrades: ['Pre-Jardín', 'Jardín', 'Transición'], 
    assignedGradeIds: ['grade_prejardin', 'grade_jardin', 'grade_transicion'], 
    avatar: 'https://picsum.photos/seed/t3/100/100', 
    documentId: '1045678901', 
    specialization: 'Lic. en Pedagogía Infantil' 
  },
  { 
    id: 't4', 
    name: 'Prof. Pedro Infante', 
    role: UserRole.TEACHER, 
    email: 'p.infante@bethel.edu', 
    subject: 'Todas las Áreas', 
    phone: '3209998877', 
    status: 'active', 
    assignedGrades: ['Segundo', 'Tercero'], 
    assignedGradeIds: ['grade_segundo', 'grade_tercero'], 
    avatar: 'https://picsum.photos/seed/t4/100/100', 
    documentId: '98765432', 
    specialization: 'Normalista Superior' 
  },
  { 
    id: 't5', 
    name: 'Lic. Luisa Lane', 
    role: UserRole.TEACHER, 
    email: 'l.lane@bethel.edu', 
    subject: 'Humanidades', 
    phone: '3005556677', 
    status: 'active', 
    assignedGrades: ['Cuarto', 'Quinto'], 
    assignedGradeIds: ['grade_cuarto', 'grade_quinto'], 
    avatar: 'https://picsum.photos/seed/t5/100/100', 
    documentId: '52333444', 
    specialization: 'Lic. en Lenguas Modernas' 
  }
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'p1', studentId: '1', amount: 850000, date: '2024-05-01', status: 'completed', concept: 'Pensión Mayo' },
  { id: 'p2', studentId: '2', amount: 850000, date: '2024-05-05', status: 'pending', concept: 'Pensión Mayo' },
  { id: 'p3', studentId: '4', amount: 850000, date: '2024-04-01', status: 'failed', concept: 'Pensión Abril' },
];
