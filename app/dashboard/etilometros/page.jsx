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
  X,
  PlusCircle,
  Loader2,
  AlertTriangle,
  Calendar,
  FileText,
  AlertCircle
} from "lucide-react";
import React from "react";

export default function InventarioPage() {
  const [etilometros, setEtilometros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [aparelhoSelecionado, setAparelhoSelecionado] = useState(null);
  const [tipoOperacao, setTipoOperacao] = useState("inativar"); 
  const [motivoBaixa, setMotivoBaixa] = useState("");
  const [documentoBaixa, setDocumentoBaixa] = useState("");
  const [isProcessando, setIsProcessando] = useState(false);
  const [erroModal, setErroModal] = useState(null);

  useEffect(() => {
    async function buscarInventario() {
      try {
        setLoading(true);
        setError(false);
        const origin = window.location.origin;
        const response = await fetch(`${origin}/api/etilometros`);
        
        if (!response.ok) throw new Error("Erro ao obter dados do servidor.");
        
        const dadosReais = await response.json();
        setEtilometros(dadosReais);
      } catch (err) {
        console.error("Erro na carga do inventário (Neon):", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    buscarInventario();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcionarModal = (aparelho) => {
    setActiveDropdownId(null); 
    setAparelhoSelecionado(aparelho);
    setTipoOperacao("inativar"); 
    setMotivoBaixa("");
    setDocumentoBaixa("");
    setErroModal(null);
    setModalOpen(true);
  };

  const handleProcessarSubmissao = async (e) => {
    if (e) e.preventDefault();
    if (!aparelhoSelecionado) return;

    if (!motivoBaixa) {
      setErroModal("Por favor, selecione ou descreva o motivo oficial.");
      return;
    }

    try {
      setIsProcessando(true);
      setErroModal(null);
      const origin = window.location.origin;

      const metodo = tipoOperacao === "excluir" ? "DELETE" : "PUT";
      const url = `${origin}/api/etilometros/${aparelhoSelecionado.id}`;

      const payload = tipoOperacao === "excluir" 
        ? { 
            motivoMovimentacao: motivoBaixa, 
            documentoAmparo: documentoBaixa || "Não informado" 
          }
        : { 
            ...aparelhoSelecionado, 
            status: motivoBaixa, 
            motivoMovimentacao: motivoBaixa,
            documentoAmparo: documentoBaixa || "Não informado"
          };

      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const respostaErro = await response.json();
        throw new Error(respostaErro.error || "Falha ao processar operação no banco.");
      }
      
      if (tipoOperacao === "excluir") {
        setEtilometros((prev) => prev.filter((item) => item.id !== aparelhoSelecionado.id));
      } else {
        setEtilometros((prev) => prev.map((item) => item.id === aparelhoSelecionado.id ? { ...item, status: motivoBaixa } : item));
      }

      setModalOpen(false); 
      setAparelhoSelecionado(null);
    } catch (err) {
      console.error("Erro na operação:", err);
      setErroModal(err.message || "Não foi possível completar a ação.");
    } finally {
      setIsProcessando(false);
    }
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return "Não informada";
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const obterStatusReal = (aparelho) => {
    if (["Manutenção", "Enviado para Calibração", "Inativo / Danificado"].includes(aparelho.status)) {
      return aparelho.status;
    }
    
    if (aparelho.proximaCalibracao) {
      const hoje = new Date();
      const hojeUtc = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      const dataVencimento = new Date(aparelho.proximaCalibracao);
      const vencimentoUtc = Date.UTC(dataVencimento.getUTCFullYear(), dataVencimento.getUTCMonth(), dataVencimento.getUTCDate());

      if (hojeUtc > vencimentoUtc) return "Aferição Vencida";
      if (vencimentoUtc - hojeUtc <= 30 * 24 * 60 * 60 * 1000) return "Aferição Vencendo";
    }

    return aparelho.status || "Operacional";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Operacional": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Aferição Vencendo": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Aferição Vencida": case "Manutenção": case "Inativo / Danificado": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Enviado para Calibração": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };
  
  const etilometrosFiltrados = etilometros.filter(aparelho => {
    const statusReal = obterStatusReal(aparelho);
    const matchesBusca = (aparelho.serie?.toLowerCase().includes(busca.toLowerCase()) || false) || 
                         (aparelho.equipamento?.toLowerCase().includes(busca.toLowerCase()) || false) ||
                         (aparelho.cia?.toLowerCase().includes(busca.toLowerCase()) || false);
                         
    const matchesStatus = filtroStatus === "Todos" || statusReal === filtroStatus || (filtroStatus === "Inativos" && ["Inativo / Danificado", "Enviado para Calibração"].includes(statusReal));
    return matchesBusca && matchesStatus;
  });

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden relative">
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
            {["Todos", "Operacional", "Aferição Vencendo", "Manutenção", "Inativos"].map((status) => (
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

        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 overflow-y-auto scrollbar-sombrio flex flex-col">
          <div className="grid grid-cols-12 bg-slate-900/50 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-5 sticky top-0 backdrop-blur-md z-10 items-center">
            <div className="col-span-2">Nº de Série</div>
            <div className="col-span-2">Equipamento</div>
            <div className="col-span-3">Carga / Localização</div>
            <div className="col-span-2 text-center">Próxima Calibração</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right pr-2">Ações</div>
          </div>

          <div className="divide-y divide-slate-800/40 text-slate-300 text-xs flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                <Loader2 className="text-blue-500 animate-spin mb-3" size={28} />
                <p className="text-xs">Sincronizando inventário com o Neon Postgres...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                <AlertTriangle className="text-rose-500 mb-2" size={28} />
                <p className="font-semibold text-white">Falha ao ler inventário</p>
              </div>
            ) : etilometrosFiltrados.length > 0 ? (
              etilometrosFiltrados.map((aparelho) => {
                const statusCalculado = obterStatusReal(aparelho);
                return (
                  <div key={aparelho.id} className="grid grid-cols-12 py-3.5 px-5 hover:bg-slate-800/20 transition-colors items-center relative">
                    <div className="col-span-2 font-mono font-bold text-white truncate pr-2">{aparelho.serie}</div>
                    <div className="col-span-2 font-medium text-slate-200 truncate pr-2">{aparelho.equipamento}</div>
                    <div className="col-span-3 flex items-center gap-2 truncate pr-2">
                      <Shield size={13} className="text-blue-500 shrink-0" />
                      <span className="truncate text-slate-300 font-medium">{aparelho.cia}</span>
                    </div>
                    <div className="col-span-2 text-center text-slate-400 font-mono text-[11px] flex items-center justify-center gap-1.5">
                      <Calendar size={12} className="text-slate-500" />
                      {formatarData(aparelho.proximaCalibracao)}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap min-w-[140px] ${getStatusStyle(statusCalculado)}`}>
                        {statusCalculado}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-1 relative">
                      <Link href={`/dashboard/etilometros/${aparelho.id}`}>
                        <button className="p-1.5 text-slate-400 hover:text-blue-400 rounded-md hover:bg-blue-500/10 cursor-pointer"><Eye size={16} /></button>
                      </Link>

                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === aparelho.id ? null : aparelho.id); }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeDropdownId === aparelho.id && (
                        <div 
                          ref={dropdownRef} 
                          className="absolute right-0 top-full mt-1 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 p-1 flex flex-col"
                        >
                          <div className="flex justify-end pr-0.5 pt-0.5">
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setActiveDropdownId(null); }}
                              className="p-0.5 text-slate-500 hover:text-slate-300 rounded transition-colors cursor-pointer"
                              title="Fechar menu"
                            >
                              <X size={10} />
                            </button>
                          </div>

                          <Link href={`/dashboard/etilometros/${aparelho.id}/editar`} className="w-full">
                            <button className="w-full py-1 text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center justify-center gap-1.5 font-bold text-[11px] cursor-pointer rounded-md">
                              <Edit2 size={11} className="text-amber-500 shrink-0" /> 
                              <span>Editar</span>
                            </button>
                          </Link>

                          <div className="border-t border-slate-800/60 my-1 w-[85%] mx-auto" />

                          <button 
                            type="button"
                            onClick={() => handleAcionarModal(aparelho)}
                            className="w-full py-1 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1.5 font-bold text-[11px] cursor-pointer rounded-md mb-0.5"
                          >
                            <Trash2 size={11} className="shrink-0" /> 
                            <span>Excluir</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-500 font-medium">
                <FileSpreadsheet size={24} className="text-slate-700 mb-2" />
                <p>Nenhum etilômetro localizado.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {modalOpen && aparelhoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 antialiased">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/60 bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tipoOperacao === "excluir" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-400"}`}>
                  {tipoOperacao === "excluir" ? <Trash2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Alteração de Carga e Destinação</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Série: <span className="font-mono font-bold text-blue-400">{aparelhoSelecionado.serie}</span></p>
                </div>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"><X size={16} /></button>
            </div>

            <div className="p-5 bg-slate-950/40 border-b border-slate-800 grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => { setTipoOperacao("inativar"); setMotivoBaixa(""); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${tipoOperacao === "inativar" ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "bg-slate-900 border-slate-800 text-slate-400"}`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">1. Afastar / Inativar</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Manutenção, calibração órgão central ou vencido. Mantém histórico.</p>
              </button>
              <button 
                type="button"
                onClick={() => { setTipoOperacao("excluir"); setMotivoBaixa(""); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${tipoOperacao === "excluir" ? "bg-rose-500/10 border-rose-500/50 text-rose-400" : "bg-slate-900 border-slate-800 text-slate-400"}`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">2. Exclusão Definitiva</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Extravio, furto ou erro de cadastro. Apaga do banco.</p>
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto scrollbar-sombrio">
              {erroModal && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2"><AlertTriangle size={14} />{erroModal}</div>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Ficha Cadastral</span>
                  <p className="text-slate-300">Equip: <span className="text-white font-medium">{aparelhoSelecionado.equipamento}</span></p>
                  <p className="text-slate-300">Carga: <span className="text-white font-medium">{aparelhoSelecionado.cia}</span></p>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {tipoOperacao === "excluir" ? "Motivo Oficial da Exclusão" : "Destinação / Novo Status"}
                    </label>
                    <select 
                      value={motivoBaixa} 
                      onChange={(e) => setMotivoBaixa(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                      required
                    >
                      <option value="">-- Selecione o motivo / destino --</option>
                      {tipoOperacao === "inativar" ? (
                        <>
                          <option value="Manutenção">Manutenção Interna / Reparo</option>
                          <option value="Enviado para Calibração">Enviado para Calibração (Órgão Central/Inmetro)</option>
                          <option value="Inativo / Danificado">Inativo / Danificado (Aguardando Parecer)</option>
                        </>
                      ) : (
                        <>
                          <option value="Extravio / Furto / Roubo">Extravio / Furto / Roubo</option>
                          <option value="Erro de cadastro inicial">Erro de cadastro inicial</option>
                          <option value="Baixa por tempo de uso definitiva">Baixa por tempo de uso definitiva</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Documento / Ofício de Amparo</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Ofício 123/2026-P4, BO, Guia de Remessa..."
                      value={documentoBaixa}
                      onChange={(e) => setDocumentoBaixa(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">Cancelar</button>
              <button 
                type="button"
                onClick={handleProcessarSubmissao}
                disabled={isProcessando}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${tipoOperacao === "excluir" ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10" : "bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-600/10"}`}
              >
                {isProcessando ? <Loader2 size={13} className="animate-spin" /> : tipoOperacao === "excluir" ? <Trash2 size={13} /> : <FileText size={13} />}
                {tipoOperacao === "excluir" ? "Confirmar Remoção" : "Confirmar Inativação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}