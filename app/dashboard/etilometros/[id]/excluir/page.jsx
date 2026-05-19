"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/page";
import { 
  ArrowLeft, 
  Trash2, 
  Shield, 
  AlertTriangle,
  FileText
} from "lucide-react";
import React from "react";

const etilometrosIniciais = [
  { id: "ET-001", serie: "987451-DR", equipamento: "Dräger 6820", cia: "1ª Cia (Centro)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", numInmetro: "2024-99812", responsavel: "Sgt. Silva" },
  { id: "ET-002", serie: "124578-AH", equipamento: "Alcoohawk PT500", cia: "2ª Cia (Bairro)", status: "Aferição Vencendo", marca: "Alcoohawk", modelo: "PT500 Professional", numInmetro: "2024-44125", responsavel: "Cabo Oliveira" },
  { id: "ET-003", serie: "542188-DR", equipamento: "Dräger 7510", cia: "Trânsito / Pelotão", status: "Manutenção", marca: "Dräger", modelo: "Alcotest 7510 (Evidencial)", numInmetro: "2024-11520", responsavel: "Ten. Ribeiro" },
  { id: "ET-004", serie: "334211-AH", equipamento: "Alcoohawk PT500", cia: "ROCAM", status: "Operacional", marca: "Alcoohawk", modelo: "PT500 Professional", numInmetro: "2024-44129", responsavel: "Sgt. Marcos" },
  { id: "ET-005", serie: "776512-DR", equipamento: "Dräger 6820", cia: "3ª Cia (SJP)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", numInmetro: "2024-99815", responsavel: "Cabo Souza" },
];

export default function ExcluirEtilometroPage() {
  const params = useParams();
  const router = useRouter();

  const [aparelho] = useState(() => {
    return etilometrosIniciais.find(e => e.id === params.id) || null;
  });

  const [motivo, setMotivo] = useState("");
  const [documento, setDocumento] = useState("");

  const handleConfirmarBaixa = (e) => {
    e.preventDefault();
    if (!motivo) {
      alert("Por favor, selecione ou descreva o motivo da baixa.");
      return;
    }

    const confirmacaoFinal = confirm(
      `ATENÇÃO: Tem certeza que deseja dar baixa definitiva no aparelho Série ${aparelho?.serie}? Esta ação não poderá ser desfeita.`
    );

    if (confirmacaoFinal) {
      // Aqui entraria a lógica de integração com o backend (DELETE ou atualização de status para "Inativo")
      alert(`Equipamento ${aparelho?.serie} foi baixado do sistema com sucesso.`);
      router.push("/dashboard/etilometros");
    }
  };

  if (!aparelho) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 items-center justify-center text-slate-400 text-xs">
        Equipamento não localizado ou carregando...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-y-auto build-scrollbar">
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/etilometros">
              <button type="button" className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Baixar Carga do Equipamento</h2>
              <p className="text-xs text-rose-400 mt-0.5 font-medium">
                Aviso: Processo de exclusão definitiva do ID: <span className="font-mono font-bold">{aparelho.id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
          
          {/* COLUNA ESQUERDA: RESUMO DO EQUIPAMENTO QUE SERÁ APAGADO */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-500" /> Resumo do Item
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Nº de Série</span>
                  <span className="font-mono font-bold text-white text-sm">{aparelho.serie}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Equipamento</span>
                  <span className="text-slate-200 font-medium">{aparelho.equipamento}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Subunidade Atual</span>
                  <span className="text-slate-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <Shield size={12} className="text-blue-500" /> {aparelho.cia}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Responsável atual</span>
                  <span className="text-slate-300">{aparelho.responsavel}</span>
                </div>
              </div>
            </div>

            {/* CARD DE ALERTA SEÇÃO MILITAR */}
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 flex gap-3 items-start">
              <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Aviso de Patrimônio</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A exclusão removerá este item dos relatórios de conferência de carga ativa do P4 da Unidade.
                </p>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: FORMULÁRIO DE JUSTIFICATIVA */}
          <div className="lg:col-span-2 bg-slate-950/20 rounded-xl border border-slate-800 p-5">
            <form onSubmit={handleConfirmarBaixa} className="space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <FileText size={14} className="text-blue-500" /> Formalização de Baixa
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Motivo Histórico da Exclusão
                </label>
                <select 
                  value={motivo} 
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                >
                  <option value="">-- Selecione o motivo oficial --</option>
                  <option value="Inservível / Danificado sem conserto">Inservível / Danificado sem conserto</option>
                  <option value="Extravio / Furto / Roubo">Extravio / Furto / Roubo</option>
                  <option value="Devolução ao Órgão Central (Detran/C股)">Devolução ao Órgão Central (Detran/OAB)</option>
                  <option value="Transferência de Unidade / Batalhão">Transferência de Unidade / Batalhão</option>
                  <option value="Erro de cadastro inicial">Erro de cadastro inicial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Documento de Autorização (Opcional)
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Ofício nº 412/2026-P4, BO, Portaria..."
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-rose-500 placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div className="border-t border-slate-800/60 pt-4 mt-6 flex justify-end gap-3">
                <Link href="/dashboard/etilometros">
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </Link>
                
                <button 
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/10 transition-all cursor-pointer"
                >
                  <Trash2 size={14} /> Confirmar Exclusão e Baixa
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}