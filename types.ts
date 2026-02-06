
export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINADOR',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export enum PlanillaStatus {
  DRAFT = 'BORRADOR',
  IN_REVIEW = 'EN REVISIÓN',
  APPROVED = 'APROBADO',
  REJECTED = 'RECHAZADO'
}

export interface Permission {
  id: string;
  code: string; // e.g., 'planilla.update'
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // List of permission codes
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: string;
  expiresAt?: string; // For temporary delegations
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  entityType: string;
  entityId: string;
  action: string;
  changeSummary: string;
  beforeData?: any;
  afterData?: any;
  timestamp: string;
  ipAddress: string;
}

export interface GradeActivity {
  id: string;
  name: string;
  weight: number; // Percentage (e.g., 0.4 for 40%)
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  permissions?: string[]; // Derived from roles
  assignedGradeIds?: string[]; // IDs of grades assigned to this user (Teacher)
}

export interface Teacher extends User {
  subject: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedGrades: string[]; // Display names of grades e.g. "Sexto"
  documentId: string;
  specialization: string;
}

export interface InstitutionInfo {
  name: string;
  slogan: string;
  location: string;
  logoUrl: string;
  daneCode?: string;
  nit?: string;
  rectorName?: string;
}

export interface PeriodScore {
  period: number;
  score: number;
  absences: number;
  observation?: string;
}

export interface SubjectGrade {
  subjectName: string;
  teacherName: string;
  scores: PeriodScore[];
  finalScore: number;
}

export interface Student extends User {
  grade: string;
  attendance: number;
  averageGrade: number;
  financialStatus: 'paid' | 'pending' | 'overdue';
  documentType: 'TI' | 'RC' | 'CE' | 'PEP';
  documentNumber: string;
  address: string;
  parentName: string;
  parentPhone: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'O';
  academicHistory?: SubjectGrade[];
}

export interface GradeEntry {
  studentId: string;
  subject: string;
  period: number;
  score: number; // 1.0 - 5.0
  performance: 'Bajo' | 'Básico' | 'Alto' | 'Superior';
  feedback?: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  concept: string;
}

export interface Communication {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'message' | 'circular';
}
