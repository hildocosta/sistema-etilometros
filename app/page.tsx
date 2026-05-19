import Sidebar from "@/components/Sidebar/page";
import { FileSpreadsheet, 
         Shield, 
         AlertTriangle, 
         CheckCircle } from "lucide-react";
import React from "react";

export default function Home(): React.JSX.Element {
  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4">
      
      {/* 1. CONTAINER DA SIDEBAR (Esquerda) */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* 2. CONTAINER DO CONTEÚDO PRINCIPAL (Direita) */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-8 overflow-y-auto">
        
        {/* Cabeçalho Interno */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Painel Geral</h1>
          <p className="text-sm text-slate-400">Visão geral da frota de etilômetros do 17º BPM</p>
        </div>

        {/* Grid de Cards de Estatísticas com Tailwind */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total Geral */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Aparelhos</p>
              <p className="text-3xl font-bold text-white mt-1">24</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <FileSpreadsheet size={24} />
            </div>
          </div>

          {/* Card 2: Distribuídos */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Em Carga nas Cias</p>
              <p className="text-3xl font-bold text-white mt-1">18</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Shield size={24} />
            </div>
          </div>

          {/* Card 3: Alertas de Calibração */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aferição Vencendo</p>
              <p className="text-3xl font-bold text-amber-400 mt-1">3</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>

          {/* Card 4: Operacionais */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prontos para Uso</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">21</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle size={24} />
            </div>
          </div>

        </div>

        {/* Área de dados temporária */}
        <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-800 min-h-[300px] flex items-center justify-center text-slate-500 text-sm">
          Espaço reservado para a listagem rápida ou gráficos de distribuição por Companhia.
        </div>

      </main>
    </div>
  );
}