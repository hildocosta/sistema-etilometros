"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  ArrowLeft, 
  Shield, 
  Cpu, 
  Calendar, 
  Clock, 
  Wrench, 
  FileText,
  AlertTriangle 
} from "lucide-react";

// Simulando a mesma base de dados para buscar o equipamento correspondente pelo ID
const etilometrosDados = [
  { id: "ET-001", serie: "987451-DR", equipamento: "Dräger 6820", cia: "1ª Cia (Centro)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", ultimaCalibracao: "15/01/2026", proximaCalibracao: "15/01/2027", numInmetro: "2024-99812", responsavel: "Sgt. Silva", observacoes: "Equipamento em perfeitas condições de uso, alocado na viatura de comando." },
  { id: "ET-002", serie: "124578-AH", equipamento: "Alcoohawk PT500", cia: "2ª Cia (Bairro)", status: "Aferição Vencendo", marca: "Alcoohawk", modelo: "PT500 Professional", ultimaCalibracao: "20/05/2025", proximaCalibracao: "20/05/2026", numInmetro: "2024-44125", responsavel: "Cabo Oliveira", observacoes: "Necessita de agendamento urgente junto ao laboratório credenciado do INMETRO." },
  { id: "ET-003", serie: "542188-DR", equipamento: "Dräger 7510", cia: "Trânsito / Pelotão", status: "Manutenção", marca: "Dräger", modelo: "Alcotest 7510 (Evidencial)", ultimaCalibracao: "02/11/2025", proximaCalibracao: "02/11/2026", numInmetro: "2024-11520", responsavel: "Ten. Ribeiro", observacoes: "Apresentando erro no sensor de fluxo de ar. Enviado para assistência técnica autorizada." },
  { id: "ET-004", serie: "334211-AH", equipamento: "Alcoohawk PT500", cia: "ROCAM", status: "Operacional", marca: "Alcoohawk", modelo: "PT500 Professional", ultimaCalibracao: "10/02/2026", proximaCalibracao: "10/02/2027", numInmetro: "2024-44129", responsavel: "Sgt. Marcos", observacoes: "Bateria interna substituída recentemente. Equipamento funcionando perfeitamente." },
  { id: "ET-005", serie: "776512-DR", equipamento: "Dräger 6820", cia: "3ª Cia (SJP)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", ultimaCalibracao: "08/03/2026", proximaCalibracao: "08/03/2027", numInmetro: "2024-99815", responsavel: "Cabo Souza", observacoes: "Carga regular em uso diário pela equipe de radiopatrulha." },
];

export default function DetalhesEtilometroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Busca o aparelho correto com base no ID passado pela URL
  const aparelho = etilometrosDados.find((item) => item.id === id);

  // Estilização das badges mantendo a consistência visual do inventário
  const getStatusStyle = (status) => {
    switch (status) {
      case "Operacional": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Aferição Vencendo": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "Manutenção": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  // Se o ID digitado/clicado não existir na base mockada
  if (!aparelho) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 p-4 gap-4">
        <div className="w-80 h-full shrink-0"><Sidebar /></div>
        <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-400">
          <AlertTriangle className="text-rose-500 mb-2" size={32} />
          <p className="font-semibold text-white">Etilômetro não localizado</p>
          <button onClick={() => router.back()} className="mt-4 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all cursor-pointer">
            Voltar ao Inventário
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-y-auto">
        
        {/* CABEÇALHO COM BOTÃO RETORNAR */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              title="Voltar"
              className="p-2 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">{aparelho.equipamento}</h2>
                <span className="font-mono bg-slate-950 text-slate-400 border border-slate-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {aparelho.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Ficha técnica detalhada e histórico de manutenção da carga.</p>
            </div>
          </div>

          <span className={`inline-block px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border text-center whitespace-nowrap min-w-[140px] ${getStatusStyle(aparelho.status)}`}>
            {aparelho.status}
          </span>
        </div>

        {/* GRID DE INFORMAÇÕES TÉCNICAS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          
          {/* CARD 1: IDENTIFICAÇÃO DO EQUIPAMENTO */}
          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} className="text-blue-500" /> Identificação e Modelo
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Nº de Série:</span>
                <span className="font-mono font-bold text-white">{aparelho.serie}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Fabricante / Marca:</span>
                <span className="font-medium text-slate-200">{aparelho.marca}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Modelo Oficial:</span>
                <span className="font-medium text-slate-200">{aparelho.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Portaria INMETRO:</span>
                <span className="font-mono font-medium text-slate-300">{aparelho.numInmetro}</span>
              </div>
            </div>
          </div>

          {/* CARD 2: CARGA E RESPONSABILIDADE */}
          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={14} className="text-blue-500" /> Alocação Atual
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Carga / Destino:</span>
                <span className="font-bold text-slate-200">{aparelho.cia}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Detentor da Carga:</span>
                <span className="font-medium text-slate-300">{aparelho.responsavel}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Unidade Vinculada:</span>
                <span className="font-medium text-slate-400">17º BPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Última Atualização:</span>
                <span className="font-medium text-slate-400">Hoje às 19:50</span>
              </div>
            </div>
          </div>

          {/* CARD 3: VALIDAÇÃO E CALIBRAÇÃO */}
          <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> Prazos de Validade (RBML)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Última Calibração:</span>
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Clock size={12} className="text-slate-500" /> {aparelho.ultimaCalibracao}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Próxima Calibração:</span>
                <span className={`font-bold flex items-center gap-1 ${aparelho.status === "Aferição Vencendo" ? "text-amber-400" : aparelho.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>
                  <Calendar size={12} /> {aparelho.proximaCalibracao}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-500">Periodicidade Exigida:</span>
                <span className="font-medium text-slate-400">12 Meses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Situação de Uso:</span>
                <span className={`font-semibold ${aparelho.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>
                  {aparelho.status === "Manutenção" ? "Bloqueado para Uso" : "Liberado para Escala"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* OBSERVAÇÕES COMPLEMENTARES */}
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 mb-6 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} className="text-blue-500" /> Observações do P4
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950/50 p-4 border border-slate-800/60 rounded-lg font-medium leading-relaxed">
            {aparelho.observacoes}
          </p>
        </div>

        {/* HISTÓRICO DE EVENTOS / MANUTENÇÃO (OCULTO NA TABELA ORIGINAL) */}
        <div className="bg-slate-950/10 rounded-xl border border-slate-800 flex flex-col flex-1 min-h-[220px]">
          <div className="p-4 bg-slate-900/50 border-b border-slate-800 rounded-t-xl flex items-center gap-2">
            <Wrench size={14} className="text-blue-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Histórico Recente de Manutenções e Laudos</h3>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div className="relative pl-5 border-l-2 border-blue-500/30 space-y-1">
              <div className="absolute w-2 h-2 rounded-full bg-blue-500 -left-[5px] top-1.5" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">{aparelho.ultimaCalibracao}</span>
                <span className="text-xs font-bold text-slate-200">Aferição Anual Obrigatória Realizada</span>
              </div>
              <p className="text-xs text-slate-400">Certificado emitido sem restrições. Erro máximo verificado dentro das tolerâncias da norma.</p>
            </div>

            <div className="relative pl-5 border-l-2 border-blue-500/10 space-y-1">
              <div className="absolute w-2 h-2 rounded-full bg-slate-700 -left-[5px] top-1.5" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">10/12/2024</span>
                <span className="text-xs font-bold text-slate-400">Higienização e Troca de Bocais de Teste</span>
              </div>
              <p className="text-xs text-slate-500">Manutenção preventiva de rotina realizada internamente pela seção de logística.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}