"use client";

import { useState } from "react";
import { 
  Trash2, 
  AlertTriangle, 
  FileText, 
  Shield, 
  X, 
  Loader2 
} from "lucide-react";
import React from "react";

export default function ModalExcluirEtilometro({ isOpen, onClose, aparelho, onExcluidoSucesso }) {
  const [motivo, setMotivo] = useState("");
  const [documento, setDocumento] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState(null);

  if (!isOpen || !aparelho) return null;

  const handleConfirmarBaixa = async (e) => {
    e.preventDefault();
    
    if (!motivo) {
      setErro("Por favor, selecione ou descreva o motivo oficial da baixa.");
      return;
    }

    try {
      setExcluindo(true);
      setErro(null);

      const origin = window.location.origin;
      
      const response = await fetch(`${origin}/api/etilometros/${aparelho.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motivo,
          documento: documento || "Não informado"
        })
      });

      if (!response.ok) {
        const dadosErro = await response.json();
        throw new Error(dadosErro.error || "Não foi possível excluir o registro no banco de dados.");
      }

      if (onExcluidoSucesso) {
        onExcluidoSucesso(aparelho.id);
      }
      
      setMotivo("");
      setDocumento("");
      onClose();

    } catch (err) {
      console.error("Erro ao excluir equipamento:", err);
      setErro(err.message || "Erro interno ao tentar processar a baixa.");
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 antialiased animate-fadeIn">
      
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
              <Trash2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Baixar Carga do Equipamento</h2>
              <p className="text-[11px] text-rose-400 font-medium mt-0.5">
                Processo de exclusão definitiva do ID: <span className="font-mono font-bold">{aparelho.id}</span>
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 scrollbar-none">
          
          {erro && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              {erro}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} className="text-rose-500" /> Resumo do Item
              </h3>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Nº de Série</span>
                <span className="font-mono font-bold text-white">{aparelho.serie}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Patrimônio</span>
                <span className="font-mono font-bold text-slate-300">{aparelho.patrimonio || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Equipamento</span>
                <span className="text-slate-200 font-medium">{aparelho.equipamento}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Alocação</span>
                <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                  <Shield size={10} className="text-blue-500" /> {aparelho.cia}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} className="text-blue-500" /> Formalização de Baixa
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Motivo Histórico da Exclusão
                </label>
                <select 
                  value={motivo} 
                  onChange={(e) => setMotivo(e.target.value)}
                  disabled={excluindo}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                  required
                >
                  <option value="">-- Selecione o motivo oficial --</option>
                  <option value="Inservível / Danificado sem conserto">Inservível / Danificado sem conserto</option>
                  <option value="Extravio / Furto / Roubo">Extravio / Furto / Roubo</option>
                  <option value="Devolução ao Órgão Central">Devolução ao Órgão Central</option>
                  <option value="Transferência de Unidade / Batalhão">Transferência de Unidade / Batalhão</option>
                  <option value="Erro de cadastro inicial">Erro de cadastro inicial</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Documento de Autorização (Opcional)
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Ofício nº 412/2026-P4, BO, Portaria..."
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  disabled={excluindo}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-rose-500 placeholder:text-slate-600 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3.5 flex gap-3 items-start">
            <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={15} />
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Aviso Crítico de Patrimônio</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                A confirmation removerá este ativo de forma permanente dos relatórios de conferência de carga ativa da subunidade do Batalhão. Certifique-se de arquivar a documentação de justificativa.
              </p>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            disabled={excluindo}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer disabled:opacity-40"
          >
            Cancelar
          </button>
          
          <button 
            type="button"
            onClick={handleConfirmarBaixa}
            disabled={excluindo}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {excluindo ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Atualizando Carga...
              </>
            ) : (
              <>
                <Trash2 size={13} /> Confirmar Exclusão e Baixa
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}