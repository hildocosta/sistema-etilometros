"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page"; 
// IMPORTAÇÃO DA SUA BASE DE DADOS REAL
import { etilometrosDados } from "./dashboard/etilometros/data"; 
import { 
  FileSpreadsheet, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
  // 1. Hook de montagem seguro para evitar Hydration Error do Recharts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Cálculos diretos na renderização
  const total = etilometrosDados.length;
  const operacionais = etilometrosDados.filter(a => a.status === "Operacional").length;
  const manutencao = etilometrosDados.filter(a => a.status === "Manutenção").length;
  const alertas = etilometrosDados.filter(a => a.status === "Aferição Vencendo").length;

  const graficoDados = [
    { name: "Prontos para Uso", valor: operacionais, fill: "#10b981" },
    { name: "Aferição Vencendo", valor: alertas, fill: "#f59e0b" },
    { name: "Retidos / Manutenção", valor: manutencao, fill: "#ef4444" }
  ];

  // Tela de carregamento idêntica até o cliente sincronizar
  if (!mounted) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-bold gap-3 animate-pulse">
        <Shield size={40} className="text-slate-700 animate-spin"/> 
        <p className="tracking-widest text-[10px] uppercase font-black text-slate-400">Carregando Painel Geral do 17º BPM...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      {/* 1. CONTAINER DA SIDEBAR (Esquerda) */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* 2. CONTAINER DO CONTEÚDO PRINCIPAL (Direita) */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        {/* Cabeçalho Interno */}
        <div className="mb-6 shrink-0">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={22} />
            Painel Geral de Controle
          </h1>
          <p className="text-xs text-slate-400 mt-1">Visão geral e auditoria da frota de etilômetros do 17º BPM.</p>
        </div>

        {/* Grid de Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 shrink-0">
          
          {/* Card 1: Total Geral */}
          <div className="p-5 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between transition-all hover:scale-[1.01]">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total de Aparelhos</p>
              <p className="text-3xl font-black text-white mt-1">{total}</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10">
              <FileSpreadsheet size={20} />
            </div>
          </div>

          {/* Card 2: Carga Operacional */}
          <div className="p-5 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between transition-all hover:scale-[1.01]">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prontos para Uso</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{operacionais}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 3: Alertas de Calibração */}
          <div className="p-5 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between transition-all hover:scale-[1.01]">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aferição Vencendo</p>
              <p className="text-3xl font-black text-amber-400 mt-1">{alertas}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/10">
              <AlertTriangle size={20} />
            </div>
          </div>

          {/* Card 4: Retidos/Manutenção */}
          <div className="p-5 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between transition-all hover:scale-[1.01]">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Retidos / Manutenção</p>
              <p className="text-3xl font-black text-rose-400 mt-1">{manutencao}</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/10">
              <Shield size={20} />
            </div>
          </div>

        </div>

        {/* Bloco Central com Gráfico de Distribuição Real */}
        <div className="flex-1 bg-slate-950/30 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
          <div className="border-b border-slate-800/80 pb-3 mb-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={14} className="text-blue-500" /> Status Analítico da Carga Efetiva
            </h2>
          </div>

          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={graficoDados} 
                  innerRadius="65%" 
                  outerRadius="85%" 
                  paddingAngle={8} 
                  dataKey="valor"
                  stroke="none"
                >
                  {graficoDados.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} className="outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '11px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider px-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Texto Interno do Gráfico */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+14px)] text-center pointer-events-none">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Patrimônios</p>
              <p className="text-4xl font-black text-white mt-1">{total}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}