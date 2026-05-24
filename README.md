# 🛡️ SisCarga - Sistema de Gestão de Etilômetros - 17º BPM

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=neon&logoColor=black" alt="Neon" />
  <img src="https://img.shields.io/badge/Lucide_Icons-FF69B4?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />
  <img src="https://img.shields.io/badge/Security-Level_4-green?style=for-the-badge&logo=dependabot&logoColor=white" alt="Security" />
</p>

<p align="center">
  <strong>Controle centralizado de carga, rastreabilidade de calibrações e conformidade jurídica dos etilômetros da Seção de Logística - P4 do 17º Batalhão de Polícia Militar.</strong>
</p>

---

## 📖 Sobre o Projeto: Da Planilha Volátil à Segurança Jurídica

O **SisCarga - Etilômetros** foi desenvolvido para solucionar um gargalo crítico na fiscalização de trânsito e na administração de patrimônio do **17º BPM**. A aferição anual de um etilômetro junto ao Inmetro possui impacto legal direto: qualquer autuação por embriaguez realizada com aparelho fora do prazo de calibração gera a nulidade imediata do ato administrativo, além de expor a instituição a passivos jurídicos.

### 📉 O Cenário Anterior

* **Vulnerabilidade de Prazos:** O monitoramento de vencimento das calibrações em planilhas locais ou cadernos físicos propiciava a perda de prazos de aferição.
* **Falta de Amparo na Baixa:** Equipamentos eram encaminhados para manutenção ou descarregados sem um registro digital indexado do documento regulamentador (Ofícios, Portarias, Boletins Internos).
* **Rastreabilidade Difusa:** Complexidade em identificar de forma imediata qual Subunidade (Companhia PM) detinha a guarda e responsabilidade de um número de série específico.

### 🚀 A Transformação Digital
O sistema centraliza o inventário completo do Batalhão. Com base na data da última aferição, ele calcula dinamicamente o status de prontidão legal do aparelho, disparando alertas visuais preventivos. Além disso, o sistema exige obrigatoriamente a inserção do motivo oficial e do documento de amparo para qualquer alteração física de carga ou baixa definitiva.

---

## 🏗️ Arquitetura e Design Sênior

O sistema foi reconstruído sob uma abordagem **Fullstack com Persistência Relacional**, abandonando arquivos locais de dados simulados (`data.js`) e implementando um fluxo de transações íntegro direto no banco de dados.

### 🧩 Destaques Técnicos e Regras de Negócio
* **Cálculo Dinâmico de Prontidão:** O motor do sistema confronta a data de calibração salva com o horário do servidor para categorizar o aparelho em: *Operacional*, *Aferição Vencendo* (alerta em amarelo com 30 dias de antecedência) ou *Aferição Vencida* (bloqueio administrativo em vermelho).
* **Fluxo de Carga Condicional (Modal Duplo):** Proteção estrutural contra erros operacionais na exclusão de equipamentos. Divide o encerramento do item em duas rotas lógicas:
  1. *Afastamento Temporário/Inativação:* Para envio ao Inmetro ou manutenção externa, preservando o histórico do item.
  2. *Exclusão Definitiva:* Para casos de extravio, furto ou erro material de digitação no cadastro.
* **Auditabilidade Mandatória:** Os campos de `documentoAmparo` e `motivoMovimentacao` são validados rigidamente e persistidos em banco, gerando um histórico rastreável para fiscalizações da P4.
* **Relação Dinâmica de Subunidades:** Vinculação inteligente entre o equipamento e as respectivas Companhias (Cias PM), permitindo filtros céleres e remanejamento rápido de carga.

---

## 📸 Demonstração da Transição Operacional

### 🚩 Processo Antigo (Baseado em Planilhas e Controles Manuais)
<p align="center">
  <img src="./screenshots/relatorio_ilustrativo.png" width="25%" style="border-radius: 8px; border: 1px solid #eaecef;" />
  <br>
  <em style="font-size: 11px; color: #586069;">Representação do controle descentralizado e vulnerável a lapsos temporais de calibração (imagem ilustrativa).</em>
</p>

### 🚀 Nova Interface Digital (SisCarga)

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/🔐-Login_P4-blue?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Autenticação restrita e segura para os gestores de logística do 17º BPM.</p>
        <img src="./screenshots/login.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📊-Inventário_Central-darkblue?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Painel de controle com filtros por Cia PM e badges automatizados de status legal.</p>
        <img src="./screenshots/dashboard-etilometros.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/🛠️-Modais_de_Movimentação-amber?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Interface para alteração, inativação temporária ou exclusão motivada sob amparo legal.</p>
        <img src="./screenshots/modal-gestao-carga.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/➕-Inclusão_de_Equipamento-green?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Cadastro unificado atrelando Marca, Modelo, Série e data Base de aferição.</p>
        <img src="./screenshots/novo-etilometro.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>
</table>

---

## 🗄️ Camada de Persistência e Sincronização Serverless

A substituição da camada local estática por um ambiente de produção moderno trouxe robustez contra concorrência de dados:

* **Prisma ORM & PostgreSQL:** Modelagem fortemente tipada que previne anomalias no banco de dados e assegura atomicidade em operações críticas de alteração de carga.
* **Pool de Conexões Otimizado:** Configuração de instância global do Prisma Client para o ambiente de desenvolvimento, neutralizando o esgotamento de conexões (*sockets*) decorrentes do *Hot Reload*.
* **Arquitetura Neon Cloud:** Banco de dados relacional que se comunica de forma assíncrona com as rotas de API internas do Next.js, entregando tempos de resposta em nível de sub-milissegundos.

---

## 🛡️ Arquitetura de Segurança (Blindagem de Processos Logísticos)

Considerando a criticidade administrativa do controle de ferramentas que subsidiam termos penais e de trânsito, o SisCarga adota 4 camadas severas de proteção:

### 🔐 Níveis de Segurança:
1. **Nível 1 - Middleware de Sessão:** Bloqueio robusto a nível de servidor. Endpoints de API (`/api/etilometros/*`) e telas de listagem são inacessíveis para agentes não autenticados.
2. **Nível 2 - Cookies HttpOnly:** Armazenamento criptografado de tokens de identificação, blindando a aplicação contra ataques de injeção e roubo de sessão via JavaScript (XSS).
3. **Nível 3 - Rate Limiting (Upstash Redis):** Camada de infraestrutura estratégica que inibe ataques de força bruta nas rotas de credenciais e requisições repetitivas maliciosas.
4. **Nível 4 - Validação com Zod:** Filtros sanitizadores aplicados nas requisições da API do Next.js, garantindo que caracteres nocivos sejam descartados antes de atingir as tabelas de dados.

---

## 🛠️ Stack Tecnológica

| Ferramenta | Aplicação |
| :--- | :--- |
| **Next.js 15** | Framework Fullstack Estrutural (App Router) |
| **React 19** | Biblioteca de Componentização de UI |
| **Prisma ORM** | Mapeamento e Abstração do Banco de Dados Relacional |
| **Neon Postgres** | Banco de Dados Cloud Serverless de Alta Disponibilidade |
| **Tailwind CSS** | Design System Moderno Otimizado para Ambientes Dark Mode |
| **Upstash Redis** | Barreira de Infraestrutura e Rate Limiting de Rotas |
| **Zod** | Validação Estrita de Schemas e Contratos de API |
| **Lucide React** | Kit de Iconografia Vetorial Dinâmica |

---

## 👤 Desenvolvedor

**Hildo Costa** - *Software Developer*

<p align="left">
  <a href="https://www.linkedin.com/in/hildo-costa-b83812231/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:hyldo.costa@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>
