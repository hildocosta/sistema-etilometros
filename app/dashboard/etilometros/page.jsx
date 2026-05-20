"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/page";
// IMPORTAÇÃO DOS DADOS REAIS CENTRALIZADOS
import { etilometrosDados } from "./data";
import { 
  Search, 
  Eye,
  Shield,
  FileSpreadsheet,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  PlusCircle 
} from "lucide-react";
import React from "react";

export default function InventarioPage() {
  // Inicializa o estado usando a base vinda do arquivo de dados unificado
  const [etilometros, setEtilometros] = useState(etilometrosDados);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

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

  // Filtragem inteligente que pesquisa por Nº de Série, Equipamento ou localidade da Cia
  const etilometrosFiltrados = etilometros.filter(aparelho => {
    const matchesBusca = aparelho.serie.toLowerCase().includes(busca.toLowerCase()) || 
                         aparelho.equipamento.toLowerCase().includes(busca.toLowerCase()) ||
                         aparelho.cia.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === "Todos" || aparelho.status === filtroStatus;
    return matchesBusca && matchesStatus;
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="text-blue-500" size={22} />
              Inventário de Etilômetros
            </h2>
            <p className="text-xs text-slate-400 mt-1">Lista de carga e localização atual da Seção de Logística (P4).</p>
          </div>

          <Link href="/dashboard/etilometros/novo">
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10 transition-all cursor-pointer">
              <PlusCircle size={15} />
              Novo Equipamento
            </button>
          </Link>
        </div>

        {/* FILTROS */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
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
            {["Todos", "Operacional", "Manutenção"].map((status) => (
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

        {/* TABELA EM GRID */}
        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 overflow-y-auto flex flex-col">
          
          {/* HEADER */}
          <div className="grid grid-cols-12 bg-slate-900/50 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-5 sticky top-0 backdrop-blur-md z-10 items-center">
            <div className="col-span-2">Nº de Série</div>
            <div className="col-span-3">Equipamento</div>
            <div className="col-span-4">Carga / Localização (17º BPM)</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right pr-2">Ações</div>
          </div>

          {/* CORPO */}
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
                    <span className="truncate text-slate-300 font-medium" title={aparelho.cia}>
                      {aparelho.cia}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2 flex justify-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap min-w-[140px] ${getStatusStyle(aparelho.status)}`}>
                      {aparelho.status}
                    </span>
                  </div>

                  {/* Ações */}
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

                    {/* DROPDOWN FLUTUANTE */}
                    {activeDropdownId === aparelho.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-100 flex flex-col text-center"
                      >
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

                        {/* Editar */}
                        <Link href={`/dashboard/etilometros/${aparelho.id}/editar`} className="w-full">
                          <button 
                            onClick={() => setActiveDropdownId(null)}
                            className="w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-center gap-2 font-medium text-xs cursor-pointer"
                          >
                            <Edit2 size={13} className="text-amber-500" />
                            <span>Editar</span>
                          </button>
                        </Link>

                        {/* Excluir */}
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
                Nenhum etilômetro localizado.
              </div>
            )}
          </div>
          
        </div>

      </main>
    </div>
  );
}