"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page"; 
import { 
  FileSpreadsheet, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  CalendarDays,
  Activity,
  UserCheck, 
  PackageCheck,
  RefreshCw
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function DashboardPage() {
  const [etilometros, setEtilometros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarDadosDaAPI = async () => {
      try {
        setLoading(true);
        const resposta = await fetch("/api/etilometros", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!resposta.ok) {
          throw new Error(`Erro do servidor: ${resposta.status}`);
        }

        const dadosJson = await resposta.json();
        setEtilometros(dadosJson);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados patrimoniais do P4:", err);
        setError(err?.message || "Erro desconhecido ao processar requisição");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDaAPI();
  }, []); // Removemos o setMounted daqui de dentro

  // Se ainda estiver carregando, mostra a tela de sincronização
  // Isso já resolve naturalmente o problema de hidratação do Next.js
  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-bold gap-3">
        <Shield size={40} className="text-blue-500 animate-spin"/> 
        <p className="tracking-widest text-[10px] uppercase font-black text-slate-400 animate-pulse">
          Sincronizando Banco de Dados em Tempo Real do 17º BPM...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-6">
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-md text-center flex flex-col items-center gap-4">
          <AlertTriangle size={44} className="text-rose-500 animate-bounce" />
          <h3 className="text-white font-bold text-base">Falha de Conexão com o Servidor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Não foi possível recuperar a folha de carga patrimonial ativa do banco de dados. Verifique a rede interna ou se a API de serviço está ativa.
          </p>
          <span className="text-[10px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded">
            Log: {error}
          </span>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <RefreshCw size={12} /> Tentar Reconectar
          </button>
        </div>
      </div>
    );
  }

  // Lógica de processamento mantida idêntica
  const processarDadosReais = () => {
    const hoje = new Date();
    const totalAparelhos = etilometros.length;
    let operacionaisReais = 0;
    let afericaoVencidaReais = 0;
    let emManutencaoReais = 0;
    let prontosDisponiveisAlmox = 0;
    let operacionaisCauteladosNaRua = 0;
    const subunidadesCriticas = [];

    etilometros.forEach((aparelho) => {
      if (aparelho.status === "Manutenção") {
        emManutencaoReais++;
      } else {
        if (aparelho.proximaCalibracao) {
          const dataCalibracao = aparelho.proximaCalibracao.includes("-")
            ? new Date(aparelho.proximaCalibracao)
            : (() => {
                const [dia, mes, ano] = aparelho.proximaCalibracao.split("/");
                return new Date(Number(ano), Number(mes) - 1, Number(dia));
              })();

          if (dataCalibracao < hoje) {
            afericaoVencidaReais++;
            subunidadesCriticas.push({
              serie: aparelho.serie,
              cia: aparelho.cia || "Não Informada",
              vencimento: aparelho.proximaCalibracao.includes("-") 
                ? aparelho.proximaCalibracao.split("T")[0] 
                : aparelho.proximaCalibracao
            });
          } else {
            operacionaisReais++;
            if (aparelho.cia && aparelho.cia.toLowerCase().includes("almoxarifado")) {
              prontosDisponiveisAlmox++;
            } else {
              operacionaisCauteladosNaRua++;
            }
          }
        }
      }
    });

    return {
      total: totalAparelhos,
      operacionais: operacionaisReais,
      disponiveisAlmox: prontosDisponiveisAlmox,
      cauteladosRua: operacionaisCauteladosNaRua,
      alertas: afericaoVencidaReais,
      manutencao: emManutencaoReais,
      criticos: subunidadesCriticas
    };
  };

  const dadosReais = processarDadosReais();

  const graficoDados = [
    { name: "Prontos no Almoxarifado", valor: dadosReais.disponiveisAlmox, fill: "#10b981" },
    { name: "Operacionais em Cautela", valor: dadosReais.cauteladosRua, fill: "#3b82f6" },
    { name: "Aferição Vencida", valor: dadosReais.alertas, fill: "#f59e0b" },
    { name: "Retidos / Manutenção", valor: dadosReais.manutencao, fill: "#ef4444" }
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px !important; height: 5px !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(2, 6, 23, 0.4) !important; border-radius: 8px !important; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155 !important; border-radius: 20px !important; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb !important; }
      `}} />

      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        <div className="mb-6 shrink-0 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={22} />
              Painel Geral de Controle Patrimonial
            </h1>
            <p className="text-xs text-slate-400 mt-1">Auditoria de frota, calibragem e monitoramento de cautelas em tempo real via API.</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Activity size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Dados em Production Ativos</span>
          </div>
        </div>

        {/* Linhas dos Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5 shrink-0">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Carga Total</p>
              <p className="text-2xl font-black text-white mt-0.5">{dadosReais.total}</p>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10">
              <FileSpreadsheet size={18} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Disponível</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{dadosReais.disponiveisAlmox}</p>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
              <PackageCheck size={18} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Cautelados</p>
              <p className="text-2xl font-black text-blue-400 mt-0.5">{dadosReais.cauteladosRua}</p>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10">
              <UserCheck size={18} />
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${dadosReais.alertas > 0 ? "bg-amber-950/20 border-amber-500/30" : "bg-slate-950/40 border-slate-800"}`}>
            <div>
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Aferição Vencida</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">{dadosReais.alertas}</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/10">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Em Manutenção</p>
              <p className="text-2xl font-black text-rose-400 mt-0.5">{dadosReais.manutencao}</p>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/10">
              <Shield size={18} />
            </div>
          </div>
        </div>

        {/* Gráfico e Alertas */}
        <div className="flex-1 flex gap-5 overflow-hidden">
          <div className="w-7/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-500" /> Status Analítico da Disponibilidade
              </h2>
            </div>

            <div className="flex-1 relative min-h-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={graficoDados} innerRadius="65%" outerRadius="85%" paddingAngle={6} dataKey="valor" stroke="none">
                    {graficoDados.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff", fontSize: "11px" }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={8} formatter={(value) => <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider px-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+14px)] text-center pointer-events-none">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Patrimônios</p>
                <p className="text-4xl font-black text-white mt-1">{dadosReais.total}</p>
              </div>
            </div>
          </div>

          <div className="w-5/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 flex justify-between items-center">
              <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} /> Alertas de Ação Imediata
              </h2>
              <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-black border border-rose-500/20">Aferição Pendente</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {dadosReais.criticos.length > 0 ? (
                dadosReais.criticos.map((critico, index) => (
                  <div key={index} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Nº Série: {critico.serie}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{critico.cia}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 font-mono text-[9px] font-bold pr-1.5">
                      <CalendarDays size={12} />
                      {critico.vencimento}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12 text-center">
                  <CheckCircle size={24} className="text-emerald-500 mb-1.5" />
                  Nenhum equipamento com calibração vencida detectado na frota!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}