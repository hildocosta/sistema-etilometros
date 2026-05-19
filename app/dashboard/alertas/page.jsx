"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar/page";
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

// DADOS FICTÍCIOS BASEADOS NA CARGA DO 17º BPM COM DATAS DE CALIBRAÇÃO (VENCIMENTOS BASEADOS EM 2026)
const dadosAlertasIniciais = [
  { id: "ET-002", serie: "124578-AH", equipamento: "Alcoohawk PT500", cia: "2ª Cia (Bairro)", dataVencimento: "2026-06-10", diasRestantes: 22, statusValidade: "Critico", numInmetro: "2024-44125" },
  { id: "ET-003", serie: "542188-DR", equipamento: "Dräger 7510", cia: "Trânsito / Pelotão", dataVencimento: "2026-05-02", diasRestantes: -17, statusValidade: "Vencido", numInmetro: "2024-11520" },
  { id: "ET-001", serie: "987451-DR", equipamento: "Dräger 6820", cia: "1ª Cia (Centro)", dataVencimento: "2026-11-15", diasRestantes: 180, statusValidade: "Regular", numInmetro: "2024-99812" },
  { id: "ET-004", serie: "334211-AH", equipamento: "Alcoohawk PT500", cia: "ROCAM", dataVencimento: "2026-12-01", diasRestantes: 196, statusValidade: "Regular", numInmetro: "2024-44129" },
  { id: "ET-005", serie: "776512-DR", equipamento: "Dräger 6820", cia: "3ª Cia (SJP)", dataVencimento: "2026-07-25", diasRestantes: 67, statusValidade: "Atencao", numInmetro: "2024-99815" },
];

export default function AlertasValidadePage() {
  const [alertas, setAlertas] = useState(dadosAlertasIniciais);
  const [busca, setBusca] = useState("");
  const [filtroGravidade, setFiltroGravidade] = useState("Todos");

  // Formatador de data simples para o padrão brasileiro
  const formatarDataBR = (dataString) => {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Retorna cores e textos dinâmicos para a gravidade do vencimento
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

  // Contadores analíticos
  const totalVencidos = alertas.filter(a => a.statusValidade === "Vencido").length;
  const totalCriticos = alertas.filter(a => a.statusValidade === "Critico").length;
  const totalRegulares = alertas.filter(a => a.statusValidade === "Regular" || a.statusValidade === "Atencao").length;

  // Filtragem combinada (Busca textual + Filtro por gravidade)
  const alertasFiltrados = alertas.filter(aparelho => {
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
            Controle de prazos e conformidade jurídica das aferições anuais obrigatórias.
          </p>
        </div>

        {/* CARDS ANALÍTICOS RÁPIDOS */}
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
            <div className="col-span-2 text-center">Última Portaria</div>
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
                        <Shield size={10} className="text-slate-500" />
                        {aparelho.cia}
                      </span>
                    </div>

                    {/* Portaria Inmetro */}
                    <div className="col-span-2 font-medium text-slate-400 font-mono text-center truncate">
                      {aparelho.numInmetro}
                    </div>

                    {/* Data Limite */}
                    <div className="col-span-2 text-center font-medium text-slate-300">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar size={12} className="text-slate-500" />
                        {formatarDataBR(aparelho.dataVencimento)}
                      </div>
                    </div>

                    {/* Badge de Validade Customizado */}
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap min-w-[150px] ${configGravidade.badge}`}>
                        {configGravidade.texto}
                      </span>
                    </div>

                    {/* Ação: Direcionar para a Ficha Técnica para atualizar a aferição */}
                    <div className="col-span-1 flex items-center justify-end pr-1">
                      <button 
                        onClick={() => window.location.href = `/dashboard/etilometros/${aparelho.id}`}
                        title="Ver Ficha Técnica" 
                        className="p-1.5 text-slate-500 hover:text-blue-400 rounded-md hover:bg-blue-500/10 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <ExternalLink size={14} />
                      </button>
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