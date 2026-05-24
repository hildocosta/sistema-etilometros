-- CreateTable
CREATE TABLE "Etilometro" (
    "id" TEXT NOT NULL,
    "equipamento" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "patrimonio" TEXT NOT NULL,
    "cia" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Operacional',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Etilometro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Etilometro_serie_key" ON "Etilometro"("serie");

-- CreateIndex
CREATE UNIQUE INDEX "Etilometro_patrimonio_key" ON "Etilometro"("patrimonio");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
