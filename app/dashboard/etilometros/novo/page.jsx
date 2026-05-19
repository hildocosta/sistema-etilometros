"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  PlusCircle, 
  ArrowLeft, 
  Shield, 
  Binary, 
  User, 
  Layers,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import React from "react";

export default function NovoEtilometroPage() {
  const router = useRouter();
  
  // Controle do Step Atual (1 ou 2)
  const [step, setStep] = useState(1);

  // Estados para capturar os dados do novo equipamento
  const [serie, setSerie] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cia, setCia] = useState("1ª Cia (Centro)");
  const [numInmetro, setNumInmetro] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState("Operacional");

  // Validação simples para avançar do Step 1 para o Step 2
  const handleNextStep = (e) => {
    e.preventDefault();
    if (serie && numInmetro && marca && modelo) {
      setStep(2);
    } else {
      alert("Por favor, preencha todos os campos obrigatórios da primeira etapa.");
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    const novoEtilometro = {
      serie,
      equipamento: `${marca} ${modelo}`,
      marca,
      modelo,
      cia,
      numInmetro,
      responsavel,
      status
    };

    console.log("Salvando novo etilômetro:", novoEtilometro);
    alert("Equipamento incluído com sucesso na carga da unidade!");
    router.push("/dashboard/etilometros");
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="text-blue-500" size={22} />
              Incluir Novo Etilômetro
            </h2>
            <p className="text-xs text-slate-400 mt-1">Cadastrar e incluir um novo equipamento na carga patrimonial.</p>
          </div>

          <Link href="/dashboard/etilometros">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
              <ArrowLeft size={14} />
              Voltar ao Inventário
            </button>
          </Link>
        </div>

        {/* INDICADOR DE ETAPAS (STEPS PROGRESS BAR) */}
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-xl mx-auto w-full">
          <div 
            onClick={() => step === 2 && setStep(1)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              step === 1 
                ? "bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold" 
                : "bg-slate-950/40 border-slate-800/80 text-slate-400 cursor-pointer hover:border-slate-700"
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-blue-500 text-white" : "bg-emerald-500/20 text-emerald-400"}`}>
              {step === 2 ? <CheckCircle2 size={14} /> : "1"}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider leading-none">Etapa 1</span>
              <span className="text-xs mt-0.5 text-slate-200">Identificação</span>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            step === 2 
              ? "bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold" 
              : "bg-slate-950/20 border-slate-900/50 text-slate-600 select-none"
          }`}>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"}`}>
              2
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider leading-none">Etapa 2</span>
              <span className="text-xs mt-0.5 text-slate-300">Alocação e Cautela</span>
            </div>
          </div>
        </div>

        {/* CONTAINER DO FORMULÁRIO (SEM ROLAGEM GERAL) */}
        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden">
          
          {/* STEP 1: IDENTIFICAÇÃO DO APARELHO */}
          {step === 1 && (
            <div className="max-w-3xl mx-auto w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                <Binary size={13} className="text-blue-500" />
                Identificação e Fabricação do Aparelho
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Número de Série <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: 987451-DR"
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Número do Inmetro / Portaria <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: 2024-99812"
                    value={numInmetro}
                    onChange={(e) => setNumInmetro(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Marca <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Dräger"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Modelo <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Alcotest 6820"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DESTINAÇÃO E RESPONSABILIDADE */}
          {step === 2 && (
            <div className="max-w-3xl mx-auto w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              {/* SUB-SESSÃO: CARGA */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                  <Shield size={13} className="text-blue-500" />
                  Carga e Destinação Inicial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subunidade Detentora (Carga) <span className="text-rose-500">*</span></label>
                    <select 
                      value={cia}
                      onChange={(e) => setCia(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="1ª Cia (Centro)">1ª Cia (Centro)</option>
                      <option value="2ª Cia (Bairro)">2ª Cia (Bairro)</option>
                      <option value="3ª Cia (SJP)">3ª Cia (SJP)</option>
                      <option value="Trânsito / Pelotão">Trânsito / Pelotão</option>
                      <option value="ROCAM">ROCAM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Status Inicial <span className="text-rose-500">*</span></label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Operacional">Operacional</option>
                      <option value="Aferição Vencendo">Aferição Vencendo</option>
                      <option value="Manutenção">Manutenção</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SUB-SESSÃO: RESPONSABILIDADE */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                  <User size={13} className="text-blue-500" />
                  Cautela / Responsável Técnico
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Graduação / Nome do Responsável <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Sgt. Silva ou Cb. Oliveira"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Policial militar responsável direto pela guarda ou fiscalização do aparelho na subunidade.</p>
                </div>
              </div>

            </div>
          )}

          {/* BARRA DE BOTÕES DE AÇÃO FIXA NO RODAPÉ DO FORMULÁRIO */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-auto w-full max-w-3xl mx-auto">
            {step === 1 ? (
              <>
                <Link href="/dashboard/etilometros">
                  <button type="button" className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
                    Cancelar
                  </button>
                </Link>
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  Avançar Carga
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Voltar
                </button>
                <button 
                  type="button"
                  onClick={handleSalvar}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Layers size={14} />
                  Salvar Equipamento
                </button>
              </>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}