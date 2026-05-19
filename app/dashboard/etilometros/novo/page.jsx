"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  PlusCircle, 
  ArrowLeft, 
  Shield, 
  FileText, 
  Binary, 
  User, 
  Layers
} from "lucide-react";
import React from "react";

export default function NovoEtilometroPage() {
  const router = useRouter();
  
  // Estados para capturar os dados do novo equipamento
  const [serie, setSerie] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cia, setCia] = useState("1ª Cia (Centro)");
  const [numInmetro, setNumInmetro] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState("Operacional");

  const handleSalvar = (e) => {
    e.preventDefault();

    // Objeto pronto para ser enviado para a futura API/Banco de Dados
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
    
    // Simulação de sucesso
    alert("Equipamento incluído com sucesso na carga da unidade!");
    
    // Redireciona de volta para a listagem principal (Inventário)
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
        
        {/* CABEÇALHO COM BOTÃO VOLTAR */}
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

        {/* FORMULÁRIO */}
        <div className="flex-1 bg-slate-950/20 rounded-xl border border-slate-800 p-6 overflow-y-auto">
          <form onSubmit={handleSalvar} className="max-w-3xl mx-auto space-y-6">
            
            {/* SESSÃO 1: IDENTIFICAÇÃO DO APARELHO */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
                <Binary size={13} className="text-blue-500" />
                Identificação e Fabricação
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

            {/* SESSÃO 2: DESTINAÇÃO E STATUS */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
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

            {/* SESSÃO 3: RESPONSABILIDADE */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
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

            {/* BOTÕES DE AÇÃO */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60">
              <Link href="/dashboard/etilometros">
                <button type="button" className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
                  Cancelar
                </button>
              </Link>

              <button 
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10 transition-all cursor-pointer flex items-center gap-2"
              >
                <Layers size={14} />
                Salvar Equipamento
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}