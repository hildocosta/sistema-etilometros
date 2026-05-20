"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import Link from "next/link";
// IMPORTAÇÃO DA BASE DE DADOS REAL CENTRALIZADA
import { etilometrosDados } from "../etilometros/data"; 
import { 
  AlertTriangle, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Search, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import React from "react";

export default function AlertasValidadePage() {
  const [busca, setBusca] = useState("");
  const [filtroGravidade, setFiltroGravidade] = useState("Todos");

  // Converte string "DD/MM/AAAA" em Objeto Date para cálculos precisos
  const parseDataBR = (dataString) => {
    if (!dataString) return new Date();
    const [dia, mes, ano] = dataString.split("/");
    return new Date(ano, mes - 1, dia);
  };

  // Processa a base de dados centralizada calculando prazos reais baseados no dia de hoje
  const alertasProcessados = etilometrosDados.map(aparelho => {
    const hoje = new Date();
    const dataLimite = parseDataBR(aparelho.proximaCalibracao);
    
    // Calcula a diferença em milissegundos e converte para dias inteiros
    const diferencaTempo = dataLimite.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    let statusValidade = "Regular";
    if (diasRestantes <= 0) {
      statusValidade = "Vencido";
    } else if (diasRestantes <= 30) {
      statusValidade = "Critico";
    } else if (diasRestantes <= 90) {
      statusValidade = "Atencao";
    }

    return {
      ...aparelho,
      diasRestantes,
      statusValidade,
      dataVencimentoFormatada: aparelho.proximaCalibracao || "01/01/2027"
    };
  });

  // Retorna estilos visuais e textos com base na severidade calculada
  const getGravidadeStyle = (statusValidade, dias) => {
    switch (statusValidade) {
      case "Vencido":
        return {
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          texto: `Vencido há ${Math.abs(dias)} dias`,
          rowBorder: "border-l-4 border-l-rose-500"
        };
      case "Critico":
        return {
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          texto: `Vence em ${dias} dias!`,
          rowBorder: "border-l-4 border-l-amber-500"
        };
      case "Atencao":
        return {
          badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          texto: `Aferição em ${dias} dias`,
          rowBorder: "border-l-4 border-l-yellow-500"
        };
      default:
        return {
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          texto: "Calibração Regular",
          rowBorder: "border-l-4 border-l-transparent"
        };
    }
  };

  // Contadores analíticos baseados nos dados reais da planilha do 17º BPM
  const totalVencidos = alertasProcessados.filter(a => a.statusValidade === "Vencido").length;
  const totalCriticos = alertasProcessados.filter(a => a.statusValidade === "Critico").length;
  const totalRegulares = alertasProcessados.filter(a => a.statusValidade === "Regular" || a.statusValidade === "Atencao").length;

  // Filtragem inteligente combinada
  const alertasFiltrados = alertasProcessados.filter(aparelho => {
    const matchesBusca = aparelho.serie.toLowerCase().includes(busca.toLowerCase()) || 
                         aparelho.equipamento.toLowerCase().includes(busca.toLowerCase()) ||
                         aparelho.cia.toLowerCase().includes(busca.toLowerCase());
    const matchesGravidade = filtroGravidade === "Todos" || aparelho.statusValidade === filtroGravidade;
    return matchesBusca && matchesGravidade;
  });

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden relative">
        
        {/* CABEÇALHO */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={22} />
            Alertas de Validade (INMETRO / RBML)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Controle analítico de prazos jurídicos e auditoria de aferições do 17º BPM.
          </p>
        </div>

        {/* CARDS ANALÍTICOS REALISTAS */}
        <div className="grid grid-cols-3 gap-4 mb-5 shrink-0">
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aferição Vencida</span>
              <h4 className="text-2xl font-black text-rose-500 mt-1">{totalVencidos}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Uso proibido na rua</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/10">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prazo Crítico (&lt; 30 dias)</span>
              <h4 className="text-2xl font-black text-amber-500 mt-1">{totalCriticos}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Agendar RBML urgente</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/10">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Regulares / Em atenção</span>
              <h4 className="text-2xl font-black text-emerald-500 mt-1">{totalRegulares}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Aptos para operação</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS E BUSCA */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between mb-4 shrink-0">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por série, subunidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-800 rounded-lg text-sm bg-slate-900 focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {[
              { id: "Todos", label: "Todos os prazos" },
              { id: "Vencido", label: "Vencidos" },
              { id: "Critico", label: "Críticos" },
              { id: "Regular", label: "Regulares" }
            ].map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFiltroGravidade(filtro.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  filtroGravidade === filtro.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>

        {/* TABELA DE ALERTAS GRID COMPLETO */}
        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 overflow-y-auto flex flex-col">
          
          {/* HEADER DA GRID */}
          <div className="grid grid-cols-12 bg-slate-900/50 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-5 sticky top-0 backdrop-blur-md z-10 items-center">
            <div className="col-span-2">Nº de Série</div>
            <div className="col-span-3">Equipamento / Carga</div>
            <div className="col-span-2 text-center">Portaria Inmetro</div>
            <div className="col-span-2 text-center">Data Limite</div>
            <div className="col-span-2 text-center">Status de Validade</div>
            <div className="col-span-1 text-right pr-2">Ação</div>
          </div>

          {/* CORPO DA GRID */}
          <div className="divide-y divide-slate-800/40 text-slate-300 text-xs flex-1">
            {alertasFiltrados.length > 0 ? (
              alertasFiltrados.map((aparelho) => {
                const configGravidade = getGravidadeStyle(aparelho.statusValidade, aparelho.diasRestantes);
                return (
                  <div 
                    key={aparelho.id} 
                    className={`grid grid-cols-12 py-3.5 px-5 hover:bg-slate-800/20 transition-colors items-center relative ${configGravidade.rowBorder}`}
                  >
                    
                    {/* Número de Série */}
                    <div className="col-span-2 font-mono font-bold text-white truncate pr-2">
                      {aparelho.serie}
                    </div>

                    {/* Equipamento / Carga */}
                    <div className="col-span-3 flex flex-col truncate pr-2">
                      <span className="font-medium text-slate-200 truncate">{aparelho.equipamento}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Shield size={10} className="text-blue-500" />
                        {aparelho.cia}
                      </span>
                    </div>

                    {/* Portaria Inmetro */}
                    <div className="col-span-2 font-medium text-slate-400 font-mono text-center truncate">
                      {aparelho.numInmetro || "Pendente"}
                    </div>

                    {/* Data Limite */}
                    <div className="col-span-2 text-center font-medium text-slate-300">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar size={12} className="text-slate-500" />
                        {aparelho.dataVencimentoFormatada}
                      </div>
                    </div>

                    {/* Badge de Validade Customizado */}
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap min-w-[150px] ${configGravidade.badge}`}>
                        {configGravidade.texto}
                      </span>
                    </div>

                    {/* Ação: Direcionar com Next Link para evitar recarregamento total */}
                    <div className="col-span-1 flex items-center justify-end pr-1">
                      <Link href={`/dashboard/etilometros/${aparelho.id}`}>
                        <button 
                          title="Ver Ficha Técnica" 
                          className="p-1.5 text-slate-500 hover:text-blue-400 rounded-md hover:bg-blue-500/10 transition-all cursor-pointer flex items-center justify-center"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </Link>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium">
                Nenhum alerta localizado com os filtros selecionados.
              </div>
            )}
          </div>
          
        </div>

      </main>
    </div>
  );
}