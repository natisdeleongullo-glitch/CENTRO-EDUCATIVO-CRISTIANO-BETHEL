
import React, { useState, useEffect } from 'react';
import { getAcademicInsights } from '../services/geminiService';
import { MOCK_STUDENTS } from '../constants';
import { BrainCircuit, AlertTriangle, Lightbulb, Sparkles, Loader2 } from 'lucide-react';

const AnalyticsIA: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getAcademicInsights(MOCK_STUDENTS);
    setInsights(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="text-blue-200" size={32} />
            <h2 className="text-2xl font-bold">EduNexus AI Insights</h2>
          </div>
          <p className="text-blue-100 max-w-2xl mb-6 text-lg">
            Nuestro motor de inteligencia artificial analiza patrones de rendimiento, asistencia y comportamiento para identificar proactivamente estudiantes en riesgo y sugerir planes de mejora personalizados.
          </p>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Analizando...' : 'Refrescar Análisis IA'}
          </button>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-medium animate-pulse text-lg">Procesando millones de puntos de datos académicos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((alert, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  alert.riesgo === 'Alto' ? 'bg-red-50 text-red-600' :
                  alert.riesgo === 'Medio' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  Riesgo {alert.riesgo}
                </span>
                <AlertTriangle size={20} className={alert.riesgo === 'Alto' ? 'text-red-500' : 'text-amber-500'} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{alert.estudiante}</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1 italic">"{alert.razon}"</p>
              
              <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl">
                  <Lightbulb className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-blue-800 mb-1">Recomendación IA:</p>
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">{alert.recomendacion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsIA;
