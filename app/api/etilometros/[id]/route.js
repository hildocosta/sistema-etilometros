import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

/**
 * 🔍 GET [/api/etilometros/[id]]: Busca a ficha de um aparelho específico
 */
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id ? String(resolvedParams.id).trim() : null;

    if (!id) {
      return NextResponse.json({ error: "O ID é obrigatório." }, { status: 400 });
    }

    const etilometro = await db.etilometro.findUnique({ where: { id } });

    if (!etilometro) {
      return NextResponse.json({ error: "Equipamento não localizado." }, { status: 404 });
    }

    return NextResponse.json(etilometro, { status: 200 });
  } catch (err) {
    console.error("Erro no GET por ID:", err);
    return NextResponse.json({ error: "Falha interna no servidor." }, { status: 500 });
  }
}

/**
 * 🛠️ PUT [/api/etilometros/[id]]: Atualiza os dados do equipamento e trata DateTime
 */
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id ? String(resolvedParams.id).trim() : null;
    
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

    if (!id || !serie || !patrimonio || !equipamento || !cia) {
      return NextResponse.json(
        { error: "Identificador ou campos obrigatórios ausentes no servidor." },
        { status: 400 }
      );
    }

    // 🗓️ Tratamento robusto de datas para evitar duplicações e objetos Inválidos
    let dataUltima = null;
    if (ultimaCalibracao) {
      const stringFormatada = String(ultimaCalibracao).includes("T") 
        ? ultimaCalibracao 
        : `${ultimaCalibracao}T00:00:00`;
      
      const parsedDate = new Date(stringFormatada);
      dataUltima = isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    let dataProxima = null;
    if (proximaCalibracao) {
      const stringFormatada = String(proximaCalibracao).includes("T") 
        ? proximaCalibracao 
        : `${proximaCalibracao}T00:00:00`;

      const parsedDate = new Date(stringFormatada);
      dataProxima = isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    const etilometroAtualizado = await db.etilometro.update({
      where: { id },
      data: {
        equipamento,
        serie,
        patrimonio,
        cia,
        status,
        responsavel,
        impressoraMarca,
        impressoraModelo,
        impressoraPatrimonio,
        ultimaCalibracao: dataUltima,
        proximaCalibracao: dataProxima,
        observacoes,
      },
    });

    return NextResponse.json(etilometroAtualizado, { status: 200 });
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Erro ao atualizar o etilômetro no Prisma:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Erro de duplicidade: Este Número de Série ou Patrimônio já pertence a outro equipamento ativo." },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Equipamento não localizado na base de dados para atualização." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Falha interna ao atualizar os dados no Neon Postgres." },
      { status: 500 }
    );
  }
}

/**
 * ❌ DELETE [/api/etilometros/[id]]: Remove o equipamento em definitivo do Neon
 */
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id ? String(resolvedParams.id).trim() : null;

    if (!id) {
      return NextResponse.json(
        { error: "O ID do equipamento é obrigatório para exclusão." },
        { status: 400 }
      );
    }

    const deletado = await db.etilometro.delete({
      where: { id },
    });

    console.log(`❌ Equipamento Série [${deletado.serie}] foi removido por comando do usuário.`);

    return NextResponse.json(
      { message: `Equipamento de série ${deletado.serie} excluído com sucesso.` },
      { status: 200 }
    );
  } catch (err) {
    const error = /** @type {any} */ (err);
    console.error("Erro ao deletar registro no Prisma:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "O equipamento informado já não existe na base de dados." },
        { status: 444 } 
      );
    }

    return NextResponse.json(
      { error: "Falha interna no servidor ao tentar remover o registro do Neon." },
      { status: 500 }
    );
  }
}