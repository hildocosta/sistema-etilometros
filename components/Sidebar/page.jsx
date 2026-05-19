"use client";
import { useState } from "react"; 
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard,  
  Shield,           
  FileSpreadsheet,  
  AlertTriangle,    
  Wrench,           
  LogOut,
  Loader2,
  ChevronRight,
  FileText        
} from "lucide-react";

// MENU EXCLUSIVO PARA GESTORES (COMANDO DO BATALHÃO / P4)
const menuItems = [
  { name: "Painel Geral", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Inventário Geral", icon: FileSpreadsheet, path: "/dashboard/etilometros" }, 
  { name: "Alertas de Validade", icon: AlertTriangle, path: "/dashboard/alertas" },
  { name: "Distribuição (Cias)", icon: Shield, path: "/dashboard/companhias" },  
  { name: "Manutenções / INMETRO", icon: Wrench, path: "/dashboard/manutencao" },
  { name: "Relatórios de Uso", icon: FileText, path: "/dashboard/relatorios" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault(); 
    setIsLoggingOut(true); 
    
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <aside className="w-full h-full bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between overflow-hidden">
      
      {/* Topo do Menu: Identidade Visual do 17º BPM */}
      <div className="flex items-center justify-center px-4 py-6 border-b border-slate-800/50 shrink-0">
        <Image 
          src="/assets/image/bg-profile.png" 
          alt="Logo 17º BPM" 
          width={38} 
          height={38}
          className="brightness-125 select-none"
        />
        <div className="flex flex-col ml-3">
          <span className="text-white font-bold tracking-wider text-xs uppercase leading-none">
            17º BPM
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
            Etilômetros - Gestão P4
          </span>
        </div>
      </div>

      {/* Primeiro Separador */}
      <div className="px-6 shrink-0">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      {/* Centro do Menu: Navegação Baseada em Rotas */}
      <nav className="flex-1 flex flex-col justify-center space-y-1.5 py-6 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          // Tratamento correto do estado ativo das rotas
          const isActive = item.path === "/dashboard" 
            ? pathname === item.path 
            : pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link key={item.path} href={item.path} className="block px-4">
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10" 
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}>
                <div className="flex items-center gap-3">
                  <Icon 
                    size={18} 
                    className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} 
                  />
                  <span className="text-[13px] tracking-wide">{item.name}</span>
                </div>
                
                {isActive && (
                  <ChevronRight size={14} className="text-white/70 animate-in fade-in slide-in-from-left-1" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Segundo Separador */}
      <div className="px-6 shrink-0">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
      
      {/* Botão de Logout */}
      <div className="w-full px-4 pt-6 mb-8 shrink-0">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 m-0
            ${isLoggingOut ? "opacity-70 bg-slate-600 cursor-not-allowed" : "hover:scale-[1.02] bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/30"}`}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Saindo...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span className="font-bold uppercase text-xs tracking-widest">Sair</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}