"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  PlusCircle, 
  ArrowLeft, 
  Binary, 
  User, 
  Layers,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Printer,
  Calendar
} from "lucide-react";
import React from "react";

export default function NovoEtilometroPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serie, setSerie] = useState("");
  const [patrimonio, setPatrimonio] = useState(""); 
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

  const [cia, setCia] = useState("1ª Cia");
  const [status, setStatus] = useState("Operacional");

  const [impressoraMarca, setImpressoraMarca] = useState("");
  const [impressoraModelo, setImpressoraModelo] = useState("");
  const [impressoraPatrimonio, setImpressoraPatrimonio] = useState("");
  const [ultimaCalibracao, setUltimaCalibracao] = useState("");
  const [proximaCalibracao, setProximaCalibracao] = useState("");

  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const validarCamposStep1 = () => {
    return !!(serie.trim() && patrimonio.trim() && marca.trim() && modelo.trim());
  };

  const handleNextStep1 = (e) => {
    if (e) e.preventDefault();
    if (validarCamposStep1()) {
      setStep(2);
    } else {
      alert("Por favor, preencha todos os campos obrigatórios do aparelho (Série, Patrimônio, Marca e Modelo).");
    }
  };

  const handleNextStep2 = (e) => {
    if (e) e.preventDefault();
    if (cia && status) {
      setStep(3);
    } else {
      alert("Por favor, certifique-se de preencher a subunidade e o status operacional.");
    }
  };

  const handleNextStep3 = (e) => {
    if (e) e.preventDefault();
    setStep(4);
  };

  const handleSalvar = async (e) => {
    if (e) e.preventDefault();
    if (!responsavel.trim()) {
      alert("Por favor, informe a graduação e o nome do responsável técnico antes de salvar.");
      return;
    }

    setIsSubmitting(true);

    const dadosEquipamento = {
      serie: serie.trim(),
      patrimonio: patrimonio.trim(),
      equipamento: `${marca.trim()} ${modelo.trim()}`,
      cia,
      status,
      impressoraMarca: impressoraMarca.trim() || null,
      impressoraModelo: impressoraModelo.trim() || null,
      impressoraPatrimonio: impressoraPatrimonio.trim() || null,
      ultimaCalibracao: ultimaCalibracao || null,
      proximaCalibracao: proximaCalibracao || null,
      responsavel: responsavel.trim(),
      observacoes: observacoes.trim() || `Equipamento inserido sob responsabilidade de ${responsavel.trim()}.`
    };

    try {
      const response = await fetch("/api/etilometros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEquipamento),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.error || "Falha ao registrar equipamento.");
      }

      alert("Equipamento e periféricos salvos com sucesso no banco de dados do 17º BPM!");
      router.push("/dashboard/etilometros");
      router.refresh(); 
    } catch (error) {
      alert(`Erro: ${error.message || "Ocorreu um erro desconhecido ao salvar."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="text-blue-500" size={22} />
              Incluir Novo Etilômetro Completo
            </h2>
            <p className="text-xs text-slate-400 mt-1">Gerenciamento de carga patrimonial, periféricos e ciclos Inmetro.</p>
          </div>

          <Link href="/dashboard/etilometros">
            <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
              <ArrowLeft size={14} />
              Voltar ao Inventário
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6 max-w-4xl mx-auto w-full">
          <div onClick={() => !isSubmitting && setStep(1)} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${step === 1 ? "bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold" : "bg-slate-950/40 border-slate-800/80 text-slate-400 cursor-pointer hover:border-slate-700"}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${step === 1 ? "bg-blue-500 text-white" : "bg-emerald-500/20 text-emerald-400"}`}>
              {step > 1 ? <CheckCircle2 size={12} /> : "1"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider leading-none text-slate-500">Etapa 1</span>
              <span className="text-xs mt-0.5 text-slate-200 truncate">Aparelho</span>
            </div>
          </div>

          <div onClick={() => validarCamposStep1() && !isSubmitting && setStep(2)} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${step === 2 ? "bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold" : validarCamposStep1() ? "bg-slate-950/40 border-slate-800/80 text-slate-400 cursor-pointer hover:border-slate-700" : "bg-slate-950/20 border-slate-900/50 text-slate-600 select-none"}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${step === 2 ? "bg-blue-500 text-white" : step > 2 ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
              {step > 2 ? <CheckCircle2 size={12} /> : "2"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider leading-none text-slate-500">Etapa 2</span>
              <span className="text-xs mt-0.5 text-slate-200 truncate">Destinação</span>
            </div>
          </div>

          <div onClick={() => validarCamposStep1() && !isSubmitting && setStep(3)} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${step === 3 ? "bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold" : validarCamposStep1() ? "bg-slate-950/40 border-slate-800/80 text-slate-400 cursor-pointer hover:border-slate-700" : "bg-slate-950/20 border-slate-900/50 text-slate-600 select-none"}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${step === 3 ? "bg-blue-500 text-white" : step > 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
              {step > 3 ? <CheckCircle2 size={12} /> : "3"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider leading-none text-slate-500">Etapa 3</span>
              <span className="text-xs mt-0.5 text-slate-200 truncate">Periféricos</span>
            </div>
          </div>

          <div onClick={() => validarCamposStep1() && !isSubmitting && setStep(4)} className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${step === 4 ? "bg-blue-600/10 border-blue-500/40 text-blue-400 font-semibold" : validarCamposStep1() ? "bg-slate-950/40 border-slate-800/80 text-slate-400 cursor-pointer hover:border-slate-700" : "bg-slate-950/20 border-slate-900/50 text-slate-600 select-none"}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${step === 4 ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"}`}>4</div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider leading-none text-slate-500">Etapa 4</span>
              <span className="text-xs mt-0.5 text-slate-300 truncate">Custódia</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
          
          {step === 1 && (
            <div className="max-w-3xl mx-auto w-full space-y-5 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                <Binary size={13} className="text-blue-500" /> Identificação Primária do Equipamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Número de Série *</label>
                  <input type="text" placeholder="Ex: 987451-DR" value={serie} onChange={(e) => setSerie(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nº de Patrimônio *</label>
                  <input type="text" placeholder="Ex: PR-179450" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Marca *</label>
                  <input type="text" placeholder="Ex: Dräger" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Modelo *</label>
                  <input type="text" placeholder="Ex: Alcotest 6820" value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto w-full space-y-5 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-500" /> Carga e Destinação Inicial do Equipamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subunidade Detentora *</label>
                  <select value={cia} onChange={(e) => setCia(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="Almoxarifado">Almoxarifado</option>
                    <option value="1ª Cia">1ª Cia</option>
                    <option value="1ª Cia (Cartório)">1ª Cia (Cartório)</option>
                    <option value="1ª Cia (Tijucas do Sul)">1ª Cia (Tijucas do Sul)</option>
                    <option value="2ª Cia">2ª Cia</option>
                    <option value="3ª Cia">3ª Cia</option>
                    <option value="3ª Cia (Ferraria)">3ª Cia (Ferraria)</option>
                    <option value="3ª Cia (Balsa Nova)">3ª Cia (Balsa Nova)</option>
                    <option value="4ª Cia">4ª Cia</option>
                    <option value="4ª Cia (Agudos do Sul)">4ª Cia (Agudos do Sul)</option>
                    <option value="4ª Cia (Mandirituba)">4ª Cia (Mandirituba)</option>
                    <option value="CIAOP / PPTRAN">CIAOP / PPTRAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Status Inicial *</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="Operacional">Operacional</option>
                    <option value="Aferição Vencendo">Aferição Vencendo</option>
                    <option value="Aferição Vencida">Aferição Vencida</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Enviado para Calibração">Enviado para Calibração</option>
                    <option value="Inativo / Danificado">Inativo / Danificado</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                  <Printer size={13} className="text-blue-500" /> Impressora Térmica Auxiliar (Opcional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Marca da Impressora</label>
                    <input type="text" placeholder="Ex: Dräger" value={impressoraMarca} onChange={(e) => setImpressoraMarca(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Modelo da Impressora</label>
                    <input type="text" placeholder="Ex: Mobile Printer" value={impressoraModelo} onChange={(e) => setImpressoraModelo(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Patrimônio Impressora</label>
                    <input type="text" placeholder="Ex: IMP-17482" value={impressoraPatrimonio} onChange={(e) => setImpressoraPatrimonio(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-500" /> Ciclo de Calibração / Certificação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Data da Última Calibração</label>
                    <input type="date" value={ultimaCalibracao} onChange={(e) => setUltimaCalibracao(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 color-scheme-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Data da Próxima Calibração</label>
                    <input type="date" value={proximaCalibracao} onChange={(e) => setProximaCalibracao(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 color-scheme-dark" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-3xl mx-auto w-full space-y-5 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                <User size={13} className="text-blue-500" /> Responsável Direto / Detalhes de Cautela
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Graduação / Nome do Responsável *</label>
                  <input type="text" placeholder="Ex: Sgt. Silva ou Cb. Oliveira" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Observações ou Histórico Adicional</label>
                  <textarea placeholder="Observações sobre o estado físico ou kits inclusos na maleta de transporte..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-800 rounded-lg bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 h-24 resize-none" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-8 w-full max-w-3xl mx-auto shrink-0">
            {step === 1 ? (
              <Link href="/dashboard/etilometros">
                <button type="button" className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">Cancelar</button>
              </Link>
            ) : (
              <button type="button" disabled={isSubmitting} onClick={() => setStep((prev) => prev - 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50">Voltar Passo</button>
            )}

            {step === 1 && (
              <button type="button" onClick={handleNextStep1} className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer">Avançar Destinação <ArrowRight size={14} /></button>
            )}

            {step === 2 && (
              <button type="button" onClick={handleNextStep2} className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer">Avançar Periféricos <ArrowRight size={14} /></button>
            )}

            {step === 3 && (
              <button type="button" onClick={handleNextStep3} className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer">Avançar Custódia <ArrowRight size={14} /></button>
            )}

            {step === 4 && (
              <button type="button" disabled={isSubmitting} onClick={handleSalvar} className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Salvando no Banco...</>
                ) : (
                  <><Layers size={14} /> Finalizar Cadastro</>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}