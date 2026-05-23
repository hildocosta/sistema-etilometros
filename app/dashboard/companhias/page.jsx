"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import { etilometrosDados } from "../etilometros/data"; 
import { 
  Shield, 
  Cpu, 
  MapPin, 
  AlertTriangle, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function DistribuicaoCiasPage() {
  // Mapeamento inteligente associando os botões da tela aos termos reais digitados na planilha
  const companhiasProvedoras = [
    { id: "almox", nome: "Almoxarifado 17º BPM", buscaTermo: "Almoxarifado", icone: Shield, cor: "from-slate-600 to-slate-800" },
    { id: "1cia", nome: "1ª Cia (SJP / Tijucas)", buscaTermo: "1ª CIA", icone: MapPin, cor: "from-blue-600 to-cyan-600" },
    { id: "2cia", nome: "2ª Cia (Araucária)", buscaTermo: "2ª CIA", icone: MapPin, cor: "from-purple-600 to-indigo-600" },
    { id: "3cia", nome: "3ª Cia (Campo Largo)", buscaTermo: "3ª CIA", icone: MapPin, cor: "from-teal-600 to-emerald-600" },
    { id: "pptran", nome: "Trânsito (PPTRAN / Sede)", buscaTermo: "PPTRAN", icone: Shield, cor: "from-amber-600 to-orange-600" }
  ];

  // Iniciar a tela com o Almoxarifado aberto
  const [ciaAberta, setCiaAberta] = useState("almox");

  // Filtra de forma inteligente se o texto da planilha contém o termo chave da subunidade
  const obterDadosCia = (termoBusca) => {
    const aparelhosDaCia = etilometrosDados.filter(item => 
      item.cia.toLowerCase().includes(termoBusca.toLowerCase())
    );
    return {
      aparelhos: aparelhosDaCia,
      total: aparelhosDaCia.length
    };
  };

  const getBadgeStatus = (status) => {
    switch (status) {
      case "Operacional": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Aferição Vencendo": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "Manutenção": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  // Encontra a companhia que está ativa no momento do clique
  const ciaAtivaObjeto = companhiasProvedoras.find(c => c.id === ciaAberta);
  const dadosDaCiaAtiva = obterDadosCia(ciaAtivaObjeto?.buscaTermo || "");

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        {/* CABEÇALHO */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="text-blue-500" size={22} />
            Distribuição de Cargas por Subunidade (Cias)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualização descentralizada baseada nos dados reais de carga patrimonial do 17º BPM.
          </p>
        </div>

        {/* LISTA DE COMPANHIAS E DETALHES */}
        <div className="flex-1 flex gap-5 overflow-hidden">
          
          {/* PAINEL ESQUERDO: SELETOR DE CIAS */}
          <div className="w-96 flex flex-col gap-3 overflow-y-auto pr-1">
            {companhiasProvedoras.map((cia) => {
              const dados = obterDadosCia(cia.buscaTermo);
              const IconeCia = cia.icone;
              const isSelected = ciaAberta === cia.id;

              return (
                <div
                  key={cia.id}
                  onClick={() => setCiaAberta(cia.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-3 group relative overflow-hidden ${
                    isSelected 
                      ? "bg-slate-950 border-blue-500/50 shadow-lg shadow-blue-500/5" 
                      : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/80 hover:border-slate-700"
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cia.cor} ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />

                  <div className="flex items-center justify-between pl-1">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-tr ${cia.cor} text-white shadow-sm`}>
                        <IconeCia size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-wide">{cia.nome}</h4>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{dados.total} Equipamentos na planilha</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className={`text-slate-600 transition-transform ${isSelected ? "text-blue-500 translate-x-0.5" : "group-hover:text-slate-400"}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAINEL DIREITO: COMPONENTES DA SUBUNIDADE SELECIONADA */}
          <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Carga Efetiva local: {ciaAtivaObjeto?.nome}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Auditoria patrimonial de subunidade vinculada ao 6º CRPM.</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {dadosDaCiaAtiva.aparelhos.length > 0 ? (
                dadosDaCiaAtiva.aparelhos.map((aparelho) => (
                  <div 
                    key={aparelho.id}
                    className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-blue-500 shrink-0">
                        <Cpu size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs truncate">{aparelho.equipamento}</span>
                          <span className="font-mono text-[9px] bg-slate-900 text-slate-400 border border-slate-800/80 px-1.5 py-0.5 rounded font-bold shrink-0">
                            Nº {aparelho.serie}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 mt-1">
                          <span className="truncate">Patrimônio: <strong className="font-mono text-slate-200">{aparelho.patrimonio}</strong></span>
                          <span className="truncate text-[9px] text-slate-500">Local na Planilha: {aparelho.cia}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border text-center whitespace-nowrap min-w-[110px] ${getBadgeStatus(aparelho.status)}`}>
                        {aparelho.status}
                      </span>

                      <Link href={`/dashboard/etilometros/${aparelho.id}`}>
                        <button 
                          title="Ficha Técnica"
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center"
                        >
                          <ExternalLink size={12} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                  <AlertTriangle size={24} className="text-slate-600 mb-1.5" />
                  Nenhum equipamento localizado sob esta carga.
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}