"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/page";
import { 
  ArrowLeft, 
  Save, 
  Shield, 
  Cpu, 
  FileCheck, 
  User 
} from "lucide-react";
import React from "react";

const etilometrosIniciais = [
  { id: "ET-001", serie: "987451-DR", equipamento: "Dräger 6820", cia: "1ª Cia (Centro)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", numInmetro: "2024-99812", responsavel: "Sgt. Silva" },
  { id: "ET-002", serie: "124578-AH", equipamento: "Alcoohawk PT500", cia: "2ª Cia (Bairro)", status: "Aferição Vencendo", marca: "Alcoohawk", modelo: "PT500 Professional", numInmetro: "2024-44125", responsavel: "Cabo Oliveira" },
  { id: "ET-003", serie: "542188-DR", equipamento: "Dräger 7510", cia: "Trânsito / Pelotão", status: "Manutenção", marca: "Dräger", modelo: "Alcotest 7510 (Evidencial)", numInmetro: "2024-11520", responsavel: "Ten. Ribeiro" },
  { id: "ET-004", serie: "334211-AH", equipamento: "Alcoohawk PT500", cia: "ROCAM", status: "Operacional", marca: "Alcoohawk", modelo: "PT500 Professional", numInmetro: "2024-44129", responsavel: "Sgt. Marcos" },
  { id: "ET-005", serie: "776512-DR", equipamento: "Dräger 6820", cia: "3ª Cia (SJP)", status: "Operacional", marca: "Dräger", modelo: "Alcotest 6820", numInmetro: "2024-99815", responsavel: "Cabo Souza" },
];

export default function EditarEtilometroPage() {
  const params = useParams();
  const router = useRouter();

  // Inicializa o estado diretamente com o item correto, eliminando a necessidade do useEffect
  const [aparelho, setAparelho] = useState(() => {
    return etilometrosIniciais.find(e => e.id === params.id) || null;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAparelho(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    if (!aparelho) return;
    
    alert(`Alterações do aparelho ${aparelho.serie} salvas com sucesso!`);
    router.push("/dashboard/etilometros");
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

      {/* CONTEÚDO PRINCIPAL FORMULÁRIO */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-y-auto build-scrollbar">
        
        {/* CABEÇALHO DA TELA DE EDIÇÃO */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/etilometros">
              <button type="button" className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Editar Equipamento</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Alteração cadastral e de carga do ID: <span className="font-mono text-blue-400 font-bold">{aparelho.id}</span>
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleSalvar}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all cursor-pointer"
          >
            <Save size={14} /> Salvar Alterações
          </button>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <form onSubmit={handleSalvar} className="space-y-6 max-w-4xl">
          
          {/* SEÇÃO 1: INFORMAÇÕES DO FABRICANTE */}
          <div className="bg-slate-950/20 rounded-xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} className="text-blue-500" /> Especificações do Aparelho
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nº de Série</label>
                <input 
                  type="text" 
                  name="serie"
                  value={aparelho.serie} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 font-mono text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Marca</label>
                <input 
                  type="text" 
                  name="marca"
                  value={aparelho.marca} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Modelo</label>
                <input 
                  type="text" 
                  name="modelo"
                  value={aparelho.modelo} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: LOGÍSTICA E STATUS DE CARGA */}
          <div className="bg-slate-950/20 rounded-xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={14} className="text-blue-500" /> Distribuição e Carga (P4)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Carga / Destinação (Subunidade)</label>
                <select 
                  name="cia"
                  value={aparelho.cia} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="1ª Cia (Centro)">1ª Cia (Centro)</option>
                  <option value="2ª Cia (Bairro)">2ª Cia (Bairro)</option>
                  <option value="3ª Cia (SJP)">3ª Cia (SJP)</option>
                  <option value="Trânsito / Pelotão">Trânsito / Pelotão</option>
                  <option value="ROCAM">ROCAM</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Operacional</label>
                <select 
                  name="status"
                  value={aparelho.status} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="Operacional">Operacional</option>
                  <option value="Aferição Vencendo">Aferição Vencendo</option>
                  <option value="Manutenção">Manutenção</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: CONTROLE LEGAL E RESPONSABILIDADE */}
          <div className="bg-slate-950/20 rounded-xl border border-slate-800/80 p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Regulamentação Inmetro */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck size={14} className="text-blue-500" /> Portaria Inmetro
                </h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Número de Certificação</label>
                  <input 
                    type="text" 
                    name="numInmetro"
                    value={aparelho.numInmetro} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Detentor da Carga */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} className="text-blue-500" /> Detentor Físico / Responsável
                </h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Policial Responsável</label>
                  <input 
                    type="text" 
                    name="responsavel"
                    value={aparelho.responsavel} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

        </form>
      </main>
    </div>
  );
}