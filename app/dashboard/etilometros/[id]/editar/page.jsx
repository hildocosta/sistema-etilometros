"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/page";
import { 
  ArrowLeft, 
  ArrowRight,
  Save, 
  Cpu, 
  User,
  Loader2,
  AlertTriangle,
  Calendar,
  Printer,
  FileText,
  CheckCircle2
} from "lucide-react";

export default function EditarEtilometroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [aparelho, setAparelho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState(null);
  const [passoAtual, setPassoAtual] = useState(1);

  useEffect(() => {
    if (!id) return;

    async function buscarEquipamento() {
      try {
        setLoading(true);
        setError(null);
        
        const origin = window.location.origin;
        const response = await fetch(`${origin}/api/etilometros/${id}`);
        
        if (!response.ok) {
          throw new Error("Não foi possível localizar este etilômetro no banco de dados.");
        }
        
        const dadosReais = await response.json();
        
        if (dadosReais.ultimaCalibracao) {
          dadosReais.ultimaCalibracao = dadosReais.ultimaCalibracao.split("T")[0];
        }
        if (dadosReais.proximaCalibracao) {
          dadosReais.proximaCalibracao = dadosReais.proximaCalibracao.split("T")[0];
        }
        
        setAparelho(dadosReais);
      } catch (err) {
        console.error("Erro ao carregar etilômetro:", err);
        setError(err.message || "Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }

    buscarEquipamento();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAparelho(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSalvar = async (e) => {
    if (e) e.preventDefault();
    if (!aparelho || !id) return;

    try {
      setSalvando(true);
      setError(null);
      const origin = window.location.origin;

      const dadosParaSalvar = {
        ...aparelho,
        ultimaCalibracao: aparelho.ultimaCalibracao 
          ? new Date(`${aparelho.ultimaCalibracao}T00:00:00.000Z`).toISOString() 
          : null,
        proximaCalibracao: aparelho.proximaCalibracao 
          ? new Date(`${aparelho.proximaCalibracao}T00:00:00.000Z`).toISOString() 
          : null
      };

      const response = await fetch(`${origin}/api/etilometros/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (!response.ok) {
        const respostaErro = await response.json();
        throw new Error(respostaErro.error || "Falha ao atualizar dados no Neon.");
      }

      router.push("/dashboard/etilometros");
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      setError(err.message || "Não foi possível salvar as modificações.");
    } finally {
      setSalvando(false);
    }
  };

  const proximoPasso = () => setPassoAtual((prev) => Math.min(prev + 1, 4));
  const passoAnterior = () => setPassoAtual((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 items-center justify-center text-slate-400 text-xs gap-3">
        <Loader2 className="text-blue-500 animate-spin" size={20} />
        Sincronizando ficha com o Neon Postgres...
      </div>
    );
  }

  if (error || !aparelho) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 items-center justify-center text-slate-400 text-xs flex-col gap-2">
        <AlertTriangle className="text-rose-500" size={24} />
        <p className="font-semibold text-slate-300">Equipamento não localizado</p>
        <p className="text-[11px] text-slate-500 max-w-xs text-center mb-4">{error || "O ID informado não corresponde a nenhum registro ativo."}</p>
        <Link href="/dashboard/etilometros">
          <button className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:text-white transition-colors cursor-pointer">
            Voltar ao Inventário
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden">
        
        <div>
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
                  ID do Registro: <span className="font-mono text-blue-400 font-bold">{aparelho.id}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { step: 1, label: "Aparelho", icon: Cpu },
              { step: 2, label: "Impressora", icon: Printer },
              { step: 3, label: "Calibração", icon: Calendar },
              { step: 4, label: "Alocação / Notas", icon: User },
            ].map((item) => {
              const Icone = item.icon;
              const ativo = passoAtual === item.step;
              const concluido = passoAtual > item.step;

              return (
                <div 
                  key={item.step} 
                  onClick={() => setPassoAtual(item.step)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    ativo 
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-md shadow-blue-500/5" 
                      : concluido 
                        ? "bg-slate-950/40 border-emerald-500/40 text-emerald-400" 
                        : "bg-slate-950/20 border-slate-800/60 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${ativo ? "bg-blue-500 text-slate-950" : concluido ? "bg-emerald-500 text-slate-950" : "bg-slate-900"}`}>
                    {concluido ? <CheckCircle2 size={13} /> : <Icone size={13} />}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">Passo 0{item.step}</p>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/30 border border-slate-800/60 rounded-xl p-6 min-h-[260px]">
            
            {passoAtual === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Cpu size={14} className="text-blue-500" /> Passo 1: Especificações do Aparelho
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Descrição do Equipamento</label>
                    <input 
                      type="text" 
                      name="equipamento"
                      value={aparelho.equipamento || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nº de Série</label>
                    <input 
                      type="text" 
                      name="serie"
                      value={aparelho.serie || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 font-mono text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Patrimônio do Aparelho</label>
                    <input 
                      type="text" 
                      name="patrimonio"
                      value={aparelho.patrimonio || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 font-mono text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {passoAtual === 2 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Printer size={14} className="text-blue-500" /> Passo 2: Kit Impressora Térmica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Marca da Impressora</label>
                    <input 
                      type="text" 
                      name="impressoraMarca"
                      placeholder="Ex: Dräger / Datecs"
                      value={aparelho.impressoraMarca || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Modelo da Impressora</label>
                    <input 
                      type="text" 
                      name="impressoraModelo"
                      placeholder="Ex: Mobile Printer"
                      value={aparelho.impressoraModelo || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Patrimônio da Impressora</label>
                    <input 
                      type="text" 
                      name="impressoraPatrimonio"
                      value={aparelho.impressoraPatrimonio || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 font-mono text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {passoAtual === 3 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-blue-500" /> Passo 3: Prazos e Calibrações (Inmetro)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Última Calibração Realizada</label>
                    <input 
                      type="date" 
                      name="ultimaCalibracao"
                      value={aparelho.ultimaCalibracao || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono cursor-pointer scheme-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Próxima Calibração (Vencimento)</label>
                    <input 
                      type="date" 
                      name="proximaCalibracao"
                      value={aparelho.proximaCalibracao || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono cursor-pointer scheme-dark"
                    />
                  </div>
                </div>
              </div>
            )}

            {passoAtual === 4 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-blue-500" /> Passo 4: Destinação e Observações do Ativo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Carga (Subunidade/Cia)</label>
                    <select 
                      name="cia"
                      value={aparelho.cia || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      required
                    >
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
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Administrativo</label>
                    <select 
                      name="status"
                      value={aparelho.status || "Operacional"} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Operacional">Operacional</option>
                      <option value="Aferição Vencendo">Aferição Vencendo</option>
                      <option value="Manutenção">Manutenção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Policial Responsável</label>
                    <input 
                      type="text" 
                      name="responsavel"
                      placeholder="Ex: Sgt Nome"
                      value={aparelho.responsavel || ""} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Observações / Histórico de Manutenções</label>
                  <textarea 
                    name="observacoes"
                    rows={3}
                    placeholder="Notas internas..."
                    value={aparelho.observacoes || ""} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6">
          <button
            type="button"
            onClick={passoAnterior}
            disabled={passoAtual === 1}
            className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft size={14} /> Voltar Passo
          </button>

          {passoAtual < 4 ? (
            <button
              type="button"
              onClick={proximoPasso}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              Avançar <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSalvar}
              disabled={salvando}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {salvando ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Atualizando Neon...
                </                >
              ) : (
                <>
                  <Save size={14} /> Finalizar e Salvar
                </>
              )}
            </button>
          )}
        </div>

      </main>
    </div>
  );
}