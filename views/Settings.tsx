
import React, { useState, useRef } from 'react';
import { InstitutionInfo } from '../types';
import { Save, School, Globe, MapPin, Camera, Sparkles, RefreshCcw, Upload, X } from 'lucide-react';

interface SettingsProps {
  institution: InstitutionInfo;
  onUpdate: (info: InstitutionInfo) => void;
}

const Settings: React.FC<SettingsProps> = ({ institution, onUpdate }) => {
  const [formData, setFormData] = useState<InstitutionInfo>(institution);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido (PNG, JPG, GIF).');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Identidad Institucional</h2>
          <p className="text-slate-500 font-medium">Personaliza el escudo, lema y datos básicos del colegio.</p>
        </div>
        {saved && (
          <div className="bg-emerald-50 border border-emerald-100 px-6 py-2 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold animate-bounce shadow-sm">
            <div className="bg-emerald-500 p-1 rounded-full text-white">
              <Save size={14} />
            </div>
            Cambios aplicados correctamente
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel Izquierdo: Previsualización del Escudo */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            <h3 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-[0.2em]">Escudo Oficial</h3>
            
            <div className="relative mx-auto w-48 h-48 mb-6">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full scale-110 group-hover:scale-125 transition-transform duration-700"></div>
              <div className="w-full h-full bg-white rounded-full p-4 shadow-inner border border-slate-50 flex items-center justify-center overflow-hidden relative z-10">
                <img 
                  src={formData.logoUrl} 
                  className="w-full h-full object-contain transition-transform group-hover:scale-110" 
                  alt="Escudo Bethel Preview" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Bethel&background=1e3a8a&color=fff&size=200';
                  }}
                />
              </div>
              <button 
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-all hover:rotate-12 z-20 border-4 border-white active:scale-90"
                title="Cambiar Escudo"
              >
                <Camera size={20} />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
                className="hidden" 
              />
            </div>
            
            <div className="space-y-1 px-4">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{formData.name}</p>
              <p className="text-[10px] text-blue-600 font-bold italic uppercase">{formData.slogan}</p>
            </div>

            <div className="mt-8">
              <button 
                type="button"
                onClick={triggerFileInput}
                className="w-full py-3 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <Upload size={14} />
                Subir nuevo archivo
              </button>
            </div>

            <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-medium italic">
              Se recomienda usar una imagen en formato PNG con fondo transparente para un mejor acabado estético.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={60} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h4 className="font-bold text-sm tracking-tight uppercase">Licencia Institucional</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Tu plataforma está personalizada exclusivamente para el <strong>CEC Bethel</strong> bajo el plan Enterprise.</p>
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-blue-400 mb-1">
                <span>Almacenamiento Cloud</span>
                <span>92% Libre</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[8%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Formulario de Información */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
                  <School size={14} className="text-blue-600" />
                  Nombre Completo de la Institución
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Centro Educativo Cristiano Bethel"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
                  <Globe size={14} className="text-blue-600" />
                  Lema / Slogan Institucional
                </label>
                <input 
                  type="text"
                  value={formData.slogan}
                  onChange={e => setFormData({...formData, slogan: e.target.value})}
                  placeholder="Ej: Dios, Disciplina y Excelencia"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold italic text-blue-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
                    <MapPin size={14} className="text-blue-600" />
                    Ubicación (Sede)
                  </label>
                  <input 
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="Ej: Albania, La Guajira"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
                    <RefreshCcw size={14} className="text-blue-600" />
                    URL o Datos del Escudo
                  </label>
                  <div className="relative group">
                    <input 
                      type="text"
                      value={formData.logoUrl.startsWith('data:') ? 'Imagen cargada localmente' : formData.logoUrl}
                      readOnly={formData.logoUrl.startsWith('data:')}
                      onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                      placeholder="https://enlace-a-tu-escudo.png"
                      className={`w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-600 text-sm ${formData.logoUrl.startsWith('data:') ? 'italic bg-blue-50/30' : ''}`}
                    />
                    {formData.logoUrl.startsWith('data:') && (
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, logoUrl: institution.logoUrl})}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Restaurar original"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => setFormData(institution)}
                className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-3 active:scale-95"
              >
                <Save size={20} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
