import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // 💡 Utiliza a instância centralizada do Prisma

/**
 * @param {Request} request
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const { 
      serie, 
      patrimonio, 
      equipamento, 
      cia, 
      status, 
      responsavel,
      impressoraMarca,
      impressoraModelo,
      impressoraPatrimonio,
      ultimaCalibracao,
      proximaCalibracao,
      observacoes 
    } = body;

    // Validação estrita de metadados obrigatórios do aparelho
    if (!serie || !patrimonio || !equipamento || !cia) {
      return NextResponse.json(
        { error: "Campos fundamentais do aparelho ausentes no servidor." },
        { status: 400 }
      );
    }

    // 💡 TRATAMENTO DE DATAS: Transforma strings "YYYY-MM-DD" em objetos Date válidos para o Prisma.
    // Concatenamos 'T00:00:00' para garantir que a data permaneça estável no fuso horário correto.
    const dataUltima = ultimaCalibracao ? new Date(`${ultimaCalibracao}T00:00:00`) : null;
    const dataProxima = proximaCalibracao ? new Date(`${proximaCalibracao}T00:00:00`) : null;

    // Persistência completa utilizando o seu db centralizado
    const novoEtilometro = await db.etilometro.create({
      data: {
        equipamento,             // String unificada "Marca Modelo"
        serie,                   // Unique
        patrimonio,              // Unique
        cia,
        status,
        responsavel,
        impressoraMarca,         // Opcional
        impressoraModelo,        // Opcional
        impressoraPatrimonio,    // Opcional
        ultimaCalibracao: dataUltima, // Objeto Date ou null
        proximaCalibracao: dataProxima, // Objeto Date ou null
        observacoes,
      },
    });

    return NextResponse.json(novoEtilometro, { status: 201 });
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Erro ao registrar carga completa no Prisma:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Erro de duplicidade: Já existe um equipamento/impressora registrado com este Número de Série ou Patrimônio." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Falha interna ao gravar os dados no Neon." },
      { status: 500 }
    );
  }
}

/**
 * 💡 ROTA GET: Recupera todo o inventário de etilômetros para exibição na tabela
 */
export async function GET() {
  try {
    // Consulta todos os registros substituindo createdAt por dataCriacao
    const todosEtilometros = await db.etilometro.findMany({
      orderBy: {
        dataCriacao: "desc", // Ordena usando o campo real mapeado no seu schema.prisma
      },
    });

    // Retorna a lista completa com status 200 (OK)
    return NextResponse.json(todosEtilometros, { status: 200 });
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Erro ao buscar lista de etilômetros no Prisma:", error);

    return NextResponse.json(
      { error: error.message || "Falha interna ao ler os dados do Neon Postgres." },
      { status: 500 }
    );
  }
}