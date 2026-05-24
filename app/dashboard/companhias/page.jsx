"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page";
import { 
  Shield, 
  Cpu, 
  MapPin, 
  AlertTriangle, 
  ChevronRight,
  ExternalLink,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function DistribuicaoCiasPage() {
  const companhiasProvedoras = [
    { id: "almox", nome: "Almoxarifado", buscaTermo: "Almoxarifado", icone: Shield, cor: "from-slate-600 to-slate-800" },
    { id: "ciaop_pptran", nome: "CIAOP / PPTRAN", buscaTermo: "CIAOP / PPTRAN", icone: Shield, cor: "from-amber-600 to-orange-600" },
    { id: "1cia", nome: "1ª Cia (Sede)", buscaTermo: "1ª Cia", excluirTermos: ["Cartório", "Tijucas"], icone: MapPin, cor: "from-blue-600 to-cyan-600" },
    { id: "1cia_cartorio", nome: "1ª Cia (Cartório)", buscaTermo: "1ª Cia (Cartório)", icone: MapPin, cor: "from-blue-500 to-sky-500" },
    { id: "1cia_tijucas", nome: "1ª Cia (Tijucas)", buscaTermo: "1ª Cia (Tijucas do Sul)", icone: MapPin, cor: "from-cyan-600 to-blue-700" },
    { id: "2cia", nome: "2ª Cia (Araucária)", buscaTermo: "2ª Cia", icone: MapPin, cor: "from-purple-600 to-indigo-600" },
    { id: "3cia", nome: "3ª Cia (Sede)", buscaTermo: "3ª Cia", excluirTermos: ["Ferraria", "Balsa Nova"], icone: MapPin, cor: "from-teal-600 to-emerald-600" },
    { id: "3cia_ferraria", nome: "3ª Cia (Ferraria)", buscaTermo: "3ª Cia (Ferraria)", icone: MapPin, cor: "from-emerald-500 to-teal-500" },
    { id: "3cia_balsanova", nome: "3ª Cia (Balsa Nova)", buscaTermo: "3ª Cia (Balsa Nova)", icone: MapPin, cor: "from-teal-600 to-teal-800" },
    { id: "4cia", nome: "4ª Cia (Sede)", buscaTermo: "4ª Cia", excluirTermos: ["Agudos", "Mandirituba"], icone: MapPin, cor: "from-rose-600 to-red-600" },
    { id: "4cia_agudos", nome: "4ª Cia (Agudos Sul)", buscaTermo: "4ª Cia (Agudos do Sul)", icone: MapPin, cor: "from-red-500 to-orange-500" },
    { id: "4cia_mandirituba", nome: "4ª Cia (Mandirituba)", buscaTermo: "4ª Cia (Mandirituba)", icone: MapPin, cor: "from-rose-500 to-pink-600" }
  ];

  const [ciaAberta, setCiaAberta] = useState("almox");
  const [etilometros, setEtilometros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function carregarDadosDoBanco() {
      try {
        setLoading(true);
        setError(false);
        const origin = window.location.origin;
        const response = await fetch(`${origin}/api/etilometros`);
        
        if (!response.ok) {
          throw new Error("Erro ao obter dados do banco Neon Postgres.");
        }

        const dados = await response.json();
        setEtilometros(dados);
      } catch (err) {
        console.error("Erro na requisição da distribuição por Cias:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDoBanco();
  }, []);

  const obterDadosCia = (configCia) => {
    if (!configCia) return { aparelhos: [], total: 0 };

    const aparelhosDaCia = etilometros.filter(item => {
      if (!item.cia) return false;
      const nomeBanco = item.cia.toLowerCase();
      const termoBusca = configCia.buscaTermo.toLowerCase();

      const contemTermo = nomeBanco.includes(termoBusca);

      if (contemTermo && configCia.excluirTermos) {
        const deveExcluir = configCia.excluirTermos.some(termo => 
          nomeBanco.includes(termo.toLowerCase())
        );
        return !deveExcluir;
      }

      return contemTermo;
    });

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

  const ciaAtivaObjeto = companhiasProvedoras.find(c => c.id === ciaAberta);
  const dadosDaCiaAtiva = obterDadosCia(ciaAtivaObjeto);

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      <style dangerouslySetInnerHTML={{__html: `
        .container-sombrio::-webkit-scrollbar {
          width: 6px !important;
          height: 6px !important;
        }
        .container-sombrio::-webkit-scrollbar-track {
          background: #0f172a !important;
        }
        .container-sombrio::-webkit-scrollbar-thumb {
          background: #334155 !important;
          border-radius: 20px !important;
        }
        .container-sombrio::-webkit-scrollbar-thumb:hover {
          background: #2563eb !important;
        }
      `}} />

      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        <div className="mb-5 shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="text-blue-500" size={22} />
            Distribuição de Cargas por Subunidade (Cias)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualização descentralizada conectada em tempo real ao banco de dados do 17º BPM.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="text-blue-500 animate-spin mb-3" size={32} />
            <p className="text-xs">Sincronizando subunidades com o banco de dados...</p>
          </div>
        ) : error ? (
          <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <AlertTriangle className="text-rose-500 mb-3" size={36} />
            <h4 className="font-semibold text-white text-sm">Falha na comunicação com o servidor</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Não foi possível mapear as cargas operacionais das companhias neste momento. Verifique sua conexão.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            
            <div className="grid grid-cols-4 gap-2 shrink-0 bg-slate-950/30 p-3 rounded-xl border border-slate-800/60 max-h-[190px] overflow-y-auto container-sombrio">
              {companhiasProvedoras.map((cia) => {
                const dados = obterDadosCia(cia);
                const IconeCia = cia.icone;
                const isSelected = ciaAberta === cia.id;

                return (
                  <div
                    key={cia.id}
                    onClick={() => setCiaAberta(cia.id)}
                    className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between group relative overflow-hidden h-[46px] ${
                      isSelected 
                        ? "bg-slate-950 border-blue-500/50 shadow-md shadow-blue-500/5" 
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-950/50 hover:border-slate-700"
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cia.cor} ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />

                    <div className="flex items-center gap-2.5 pl-1 min-w-0 w-full">
                      <div className={`p-1.5 rounded bg-gradient-to-tr ${cia.cor} text-white shadow-sm shrink-0`}>
                        <IconeCia size={12} />
                      </div>
                      <div className="min-w-0 flex-1 leading-tight">
                        <h4 className="text-[11px] font-bold text-white tracking-wide truncate">{cia.nome}</h4>
                        <p className="text-[9px] text-slate-500 font-medium truncate">{dados.total} Equip.</p>
                      </div>
                      <ChevronRight size={12} className={`text-slate-700 transition-transform shrink-0 ml-auto ${isSelected ? "text-blue-500 translate-x-0.5" : "group-hover:text-slate-400"}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex-1 flex flex-col bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden">
              
              <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between backdrop-blur-md shrink-0">
                <div>
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Carga Efetiva local: {ciaAtivaObjeto?.nome}
                  </h3>
                  <p className="text-[10px] text-slate-400">Auditoria patrimonial de subunidade vinculada ao 17º BPM.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 container-sombrio">
                {dadosDaCiaAtiva.aparelhos.length > 0 ? (
                  dadosDaCiaAtiva.aparelhos.map((aparelho) => (
                    <div 
                      key={aparelho.id}
                      className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl hover:border-slate-700/80 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-blue-500 shrink-0">
                          <Cpu size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs truncate">{aparelho.equipamento}</span>
                            <span className="font-mono text-[9px] bg-slate-950 text-slate-400 border border-slate-800/80 px-1.5 py-0.5 rounded font-bold shrink-0">
                              Nº {aparelho.serie}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="truncate">Patrimônio: <strong className="font-mono text-slate-200">{aparelho.patrimonio}</strong></span>
                            <span className="truncate text-[9px] text-slate-500">Local de Registro: {aparelho.cia}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border text-center whitespace-nowrap min-w-[110px] ${getBadgeStatus(aparelho.status)}`}>
                          {aparelho.status}
                        </span>

                        <Link href={`/dashboard/etilometros/${aparelho.id}`}>
                          <button 
                            title="Ficha Técnica"
                            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center"
                          >
                            <ExternalLink size={12} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                    <AlertTriangle size={20} className="text-slate-600 mb-1.5" />
                    Nenhum equipamento localizado sob esta carga no banco de dados.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}