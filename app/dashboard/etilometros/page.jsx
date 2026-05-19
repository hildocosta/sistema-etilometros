"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/page";
import { 
  Search, 
  Eye,
  Shield,
  FileSpreadsheet,
  MoreVertical,
  Edit2,
  Trash2,
  X
} from "lucide-react";
import React from "react";

const etilometrosIniciais = [
  { id: "ET-001", serie: "987451-DR", equipamento: "Dräger 6820", cia: "1ª Cia (Centro)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", numInmetro: "2024-99812", responsavel: "Sgt. Silva" },
  { id: "ET-002", serie: "124578-AH", equipamento: "Alcoohawk PT500", cia: "2ª Cia (Bairro)", status: "Aferição Vencendo", marca: "Alcoohawk", modelo: "PT500 Professional", numInmetro: "2024-44125", responsavel: "Cabo Oliveira" },
  { id: "ET-003", serie: "542188-DR", equipamento: "Dräger 7510", cia: "Trânsito / Pelotão", status: "Manutenção", marca: "Dräger", modelo: "Alcotest 7510 (Evidencial)", numInmetro: "2024-11520", responsavel: "Ten. Ribeiro" },
  { id: "ET-004", serie: "334211-AH", equipamento: "Alcoohawk PT500", cia: "ROCAM", status: "Operacional", marca: "Alcoohawk", modelo: "PT500 Professional", numInmetro: "2024-44129", responsavel: "Sgt. Marcos" },
  { id: "ET-005", serie: "776512-DR", equipamento: "Dräger 6820", cia: "3ª Cia (SJP)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", numInmetro: "2024-99815", responsavel: "Cabo Souza" },
];

export default function InventarioPage() {
  const [etilometros, setEtilometros] = useState(etilometrosIniciais);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  
  // Controle do menu flutuante por ID do item
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Operacional": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Aferição Vencendo": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Manutenção": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const etilometrosFiltrados = etilometros.filter(aparelho => {
    const matchesBusca = aparelho.serie.toLowerCase().includes(busca.toLowerCase()) || 
                         aparelho.equipamento.toLowerCase().includes(busca.toLowerCase()) ||
                         aparelho.cia.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === "Todos" || aparelho.status === filtroStatus;
    return matchesBusca && matchesStatus;
  });

  const handleMudarParaManutencao = (id) => {
    if (confirm(`Deseja alterar o status do item ${id} para Manutenção?`)) {
      setEtilometros(prev => prev.map(item => item.id === id ? { ...item, status: "Manutenção" } : item));
      setActiveDropdownId(null);
    }
  };

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
            <FileSpreadsheet className="text-blue-500" size={22} />
            Inventário de Etilômetros
          </h2>
          <p className="text-xs text-slate-400 mt-1">Lista simplificada de carga e status atual do P4 da unidade.</p>
        </div>

        {/* FILTROS */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar etilômetro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-800 rounded-lg text-sm bg-slate-900 focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {["Todos", "Operacional", "Aferição Vencendo", "Manutenção"].map((status) => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  filtroStatus === status
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* TABELA BASEADA EM GRID COMPLETO PARA PERFEITO ALINHAMENTO */}
        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 overflow-y-auto flex flex-col">
          
          {/* HEADER DA GRID */}
          <div className="grid grid-cols-12 bg-slate-900/50 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-5 sticky top-0 backdrop-blur-md z-10 items-center">
            <div className="col-span-2">Nº de Série</div>
            <div className="col-span-3">Equipamento</div>
            <div className="col-span-4">Carga / Localização</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right pr-2">Ações</div>
          </div>

          {/* CORPO DA GRID */}
          <div className="divide-y divide-slate-800/40 text-slate-300 text-xs flex-1">
            {etilometrosFiltrados.length > 0 ? (
              etilometrosFiltrados.map((aparelho) => (
                <div key={aparelho.id} className="grid grid-cols-12 py-3.5 px-5 hover:bg-slate-800/20 transition-colors items-center relative">
                  
                  {/* Número de Série */}
                  <div className="col-span-2 font-mono font-bold text-white truncate pr-2">
                    {aparelho.serie}
                  </div>

                  {/* Equipamento */}
                  <div className="col-span-3 font-medium text-slate-200 truncate pr-2">
                    {aparelho.equipamento}
                  </div>

                  {/* Carga / Localização */}
                  <div className="col-span-4 flex items-center gap-2 truncate pr-2">
                    <Shield size={13} className="text-blue-500 shrink-0" />
                    <span className="truncate text-slate-300 font-medium">{aparelho.cia}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2 flex justify-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap min-w-[140px] ${getStatusStyle(aparelho.status)}`}>
                      {aparelho.status}
                    </span>
                  </div>

                  {/* Coluna de Ação Enxuta */}
                  <div className="col-span-1 flex items-center justify-end gap-1 relative">
                    
                    <Link href={`/dashboard/etilometros/${aparelho.id}`}>
                      <button title="Visualizar Detalhes" className="p-1.5 text-slate-400 hover:text-blue-400 rounded-md hover:bg-blue-500/10 transition-all cursor-pointer">
                        <Eye size={16} />
                      </button>
                    </Link>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === aparelho.id ? null : aparelho.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <MoreVertical size={16} />
                    </button>

 {/* DROPDOWN FLUTUANTE PREMIUM COM INFORMAÇÕES CENTRALIZADAS (TAMANHO REDUZIDO) */}
{activeDropdownId === aparelho.id && (
  <div 
    ref={dropdownRef}
    className="absolute right-0 top-full mt-1 w-31 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-100 flex flex-col text-center"
  >
    {/* CABEÇALHO DO DROPDOWN APENAS COM O BOTÃO DE FECHAR (X) ALINHADO À DIREITA */}
    <div className="flex justify-end px-2.5 py-1 border-b border-slate-800/40 mb-0.5">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation(); 
          setActiveDropdownId(null);
        }}
        className="p-1 text-slate-500 hover:text-slate-300 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
        title="Fechar Menu"
      >
        <X size={13} />
      </button>
    </div>

    {/* Opção 1: Editar */}
    <Link href={`/dashboard/etilometros/${aparelho.id}/editar`} className="w-full">
      <button 
        onClick={() => setActiveDropdownId(null)}
        className="w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-center gap-2 font-medium text-xs cursor-pointer"
      >
        <Edit2 size={13} className="text-amber-500" />
        <span>Editar</span>
      </button>
    </Link>

    {/* Opção 2: Excluir (Redirecionando para a rota de exclusão dedicada) */}
    <Link href={`/dashboard/etilometros/${aparelho.id}/excluir`} className="w-full">
      <button 
        onClick={() => setActiveDropdownId(null)}
        className="w-full px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2 font-bold text-xs border-t border-slate-800/40 cursor-pointer"
      >
        <Trash2 size={13} />
        <span>Excluir</span>
      </button>
    </Link>

  </div>
)}

                  </div>

                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium">
                Nênhum etilômetro localizado.
              </div>
            )}
          </div>
          
        </div>

      </main>
    </div>
  );
}