
import React, { useState } from 'react';
import { InstitutionInfo } from '../types';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

interface LoginProps {
  institution: InstitutionInfo;
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ institution, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      const success = await onLogin(email, password);
      if (!success) {
        setError('Credenciales incorrectas. Verifique su usuario y contraseña.');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Left Side - Image/Brand */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 p-12 opacity-20">
            <Sparkles size={120} />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/20">
               <img src={institution.logoUrl} alt="Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">EduNexus Pro</h1>
            <p className="text-blue-100 font-medium text-sm leading-relaxed max-w-xs">
              Plataforma de gestión académica integral para la excelencia educativa.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Institución</p>
                <h3 className="text-xl font-black leading-tight mb-1">{institution.name}</h3>
                <p className="text-xs italic text-blue-200">{institution.slogan}</p>
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Bienvenido de nuevo</h2>
            <p className="text-slate-500 text-sm mb-8">Ingrese sus credenciales para acceder al portal.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Correo Institucional</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@bethel.edu"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Recordarme</span>
                </label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-[10px] text-slate-400 font-medium">
                 ¿No tienes acceso? Contacta a <a href="#" className="text-blue-600 font-bold hover:underline">Soporte Técnico</a>
               </p>
               <p className="text-[10px] text-slate-300 mt-4 uppercase tracking-widest">
                 © 2024 EduNexus Pro v2.5
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
