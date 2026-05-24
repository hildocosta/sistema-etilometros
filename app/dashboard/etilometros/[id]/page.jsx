"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  ArrowLeft, 
  Shield, 
  Cpu, 
  Calendar, 
  Wrench, 
  FileText,
  AlertTriangle,
  Printer,
  Loader2 
} from "lucide-react";

export default function DetalhesEtilometroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [aparelho, setAparelho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function buscarDetalhes() {
      try {
        setLoading(true);
        setError(false);
        
        const origin = window.location.origin;
        const response = await fetch(`${origin}/api/etilometros/${id}`);
        
        if (!response.ok) {
          throw new Error("Equipamento não localizado no servidor.");
        }

        const dadosReais = await response.json();
        setAparelho(dadosReais);
      } catch (err) {
        console.error("Erro ao buscar detalhes no Neon Postgres:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      buscarDetalhes();
    }
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Operacional": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Aferição Vencendo": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "Manutenção": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Não informada";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch {
      return dataString;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 p-4 gap-4">
        <div className="w-80 h-full shrink-0"><Sidebar /></div>
        <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="text-blue-500 animate-spin mb-3" size={32} />
          <p className="text-xs">Buscando ficha técnica no Neon Postgres...</p>
        </main>
      </div>
    );
  }

  if (error || !aparelho) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 p-4 gap-4">
        <div className="w-80 h-full shrink-0"><Sidebar /></div>
        <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-400">
          <AlertTriangle className="text-rose-500 mb-2" size={32} />
          <p className="font-semibold text-white">Etilômetro não localizado</p>
          <p className="text-xs text-slate-500 mt-1">O ID do equipamento não coincide com a base do 17º BPM.</p>
          <button onClick={() => router.push("/dashboard/etilometros")} className="mt-4 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all cursor-pointer">
            Voltar ao Inventário
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4">
      
      <style dangerouslySetInnerHTML={{__html: `
        .container-sombrio::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }
        .container-sombrio::-webkit-scrollbar-track {
          background: #0f172a !important;
          border-radius: 0 16px 16px 0 !important;
        }
        .container-sombrio::-webkit-scrollbar-thumb {
          background: #334155 !important;
          border-radius: 20px !important;
          border: 2px solid #0f172a !important;
        }
        .container-sombrio::-webkit-scrollbar-thumb:hover {
          background: #2563eb !important;
        }
      `}} />

      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-y-auto container-sombrio">
        
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard/etilometros")} 
              title="Voltar"
              className="p-2 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">{aparelho.equipamento}</h2>
                <span className="font-mono bg-slate-950 text-slate-400 border border-slate-800 text-[10px] px-2 py-0.5 rounded-md font-bold max-w-[160px] truncate" title={aparelho.id}>
                  ID: {aparelho.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Ficha técnica detalhada e histórico de manutenção da carga.</p>
            </div>
          </div>

          <span className={`inline-block px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border text-center whitespace-nowrap min-w-[140px] ${getStatusStyle(aparelho.status)}`}>
            {aparelho.status}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-6">
          
          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} className="text-blue-500" /> Identificação
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Nº de Série:</span>
                <span className="font-mono font-bold text-white text-right pr-2">{aparelho.serie}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Nº de Patrimônio:</span>
                <span className="font-mono font-bold text-blue-400 text-right pr-2">{aparelho.patrimonio}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Modelo Oficial:</span>
                <span className="font-medium text-slate-200 text-right truncate max-w-[140px] pr-2" title={aparelho.equipamento}>
                  {aparelho.equipamento}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={14} className="text-blue-500" /> Alocação Atual
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Carga / Destino:</span>
                <span className="font-bold text-slate-200 text-right pr-2">{aparelho.cia}</span>
              </div>
              
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2 items-start">
                <span className="text-slate-500">Detentor da Carga:</span>
                <span className="font-bold text-slate-300 text-right break-words max-w-[130px] pr-2">
                  {aparelho.responsavel || "Seção de Logística"}
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Unidade Vinculada:</span>
                <span className="font-medium text-slate-400 text-right pr-2">17º BPM</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Printer size={14} className="text-blue-500" /> Impressora
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Marca:</span>
                <span className="font-medium text-slate-200 text-right pr-2">{aparelho.impressoraMarca || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Modelo:</span>
                <span className="font-medium text-slate-200 text-right pr-2">{aparelho.impressoraModelo || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Nº Patrimônio:</span>
                <span className={`font-mono font-bold text-right pr-2 ${aparelho.impressoraPatrimonio ? "text-amber-500" : "text-slate-500"}`}>
                  {aparelho.impressoraPatrimonio || "Não Vinculada"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> Prazos de Validade
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Última Calibração:</span>
                <span className="font-semibold text-slate-300 text-right pr-2 tabular-nums">
                  {formatarData(aparelho.ultimaCalibracao)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Próxima Calibração:</span>
                <span className={`font-bold text-right pr-2 tabular-nums ${aparelho.status === "Aferição Vencendo" ? "text-amber-400" : aparelho.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>
                  {formatarData(aparelho.proximaCalibracao)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Situação de Uso:</span>
                <span className={`font-bold text-right pr-2 ${aparelho.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>
                  {aparelho.status === "Manutenção" ? "Bloqueado para Uso" : "Liberado para Escala"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 mb-6 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} className="text-blue-500" /> Observações do P4
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950/50 p-4 border border-slate-800/60 rounded-lg font-medium leading-relaxed">
            {aparelho.observacoes || "Equipamento patrimoniado pertencente à carga oficial do 17º BPM, disponível para fiscalização de trânsito."}
          </p>
        </div>

        <div className="bg-slate-950/10 rounded-xl border border-slate-800 flex flex-col flex-1 min-h-[220px]">
          <div className="p-4 bg-slate-900/50 border-b border-slate-800 rounded-t-xl flex items-center gap-2">
            <Wrench size={14} className="text-blue-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Histórico Recente de Manutenções e Laudos</h3>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div className="relative pl-5 border-l-2 border-blue-500/30 space-y-1">
              <div className="absolute w-2 h-2 rounded-full bg-blue-500 -left-[5px] top-1.5" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 tabular-nums">
                  {formatarData(aparelho.ultimaCalibracao)}
                </span>
                <span className="text-xs font-bold text-slate-200">Aferição Anual Obrigatória Realizada</span>
              </div>
              <p className="text-xs text-slate-400">Certificado sincronizado via sistema interno. Equipamento calibrado e lacrado.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}