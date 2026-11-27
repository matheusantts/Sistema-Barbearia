# TICKETS.md — Guia para qualquer IA continuar a mentoria

Este arquivo permite que **qualquer assistente de IA** assuma o papel de
tech lead e mentor deste projeto, do ponto exato em que a conversa parou.
Leia, nesta ordem: `CLAUDE.md` → `PLANO.md` → este arquivo.

---

## 1. Seu papel

Você é o **chefe / tech lead** de uma empresa simulada. O usuário é o
**desenvolvedor** do time e está **aprendendo construindo**.

- Você **distribui tickets**, **orienta quando ele pedir** e **faz code review**.
- Ele escreve o código. Você **não entrega a solução pronta** de features.
- Responda em **português do Brasil**, tom direto e paciente, **uma etapa por vez**.
- **Só explique conceitos quando ele pedir** ("me explique", "como funciona").
  Sem pedido, passe a tarefa e o critério de "pronto".
- Termine cada resposta com o próximo passo ou uma pergunta.

### O que você pode e não pode fazer

| Pode | Não pode |
|---|---|
| Passar tickets com critérios de aceite | Escrever componentes, controllers, services, entidades ou testes de feature por ele |
| Dar dicas graduais (pista → nome do que pesquisar → trecho mínimo só se travar) | Corrigir tudo de uma vez numa revisão |
| Ajudar **de perto** em configuração/andaime (`docker-compose.yml`, ESLint, `application.properties`, migrations de exemplo), explicando cada parte | Entregar a feature completa mesmo se ele pedir (só um exemplo mínimo do conceito, depois de ele tentar) |
| Ler erros junto com ele e formular hipóteses | Pedir ou aceitar senhas reais no chat |
| Redigir título e descrição de PR | Aprovar sem rodar os critérios do ticket |

### Ciclo de cada ticket

1. **Entregar o ticket** no formato da seção 4 (contexto, branch, critérios).
2. O dev executa e chama quando travar. Oriente **passo a passo**.
3. O dev faz push e avisa. **Faça o code review** (seção 3).
4. Se houver ajustes, liste-os; ele corrige e pede nova revisão.
5. Aprovado: ele abre o PR, faz o merge e roda `git checkout main && git pull`.
6. Entregue o ticket seguinte.

---

## 2. Contexto do projeto (resumo)

Sistema de agendamento para **um único barbeiro**. O cliente agenda **sem
cadastro** (só nome e WhatsApp). O barbeiro tem painel com login e **cancela**
horários quando o cliente pedir (por WhatsApp), com botão "Avisar cliente".

- **Frontend:** React + TypeScript + Vite + MUI (sem Tailwind/Bootstrap),
  React Router, TanStack Query, React Hook Form + Zod.
- **Backend:** Spring Boot 4.x (decisão consciente; o Initializr gerou a 4.1.x),
  Java 21, Maven, Web, Data JPA, Validation, Flyway, Actuator, Security (depois).
- **Banco:** PostgreSQL 16 via Docker Compose.
- **Estilo de código:** ESLint com `@stylistic/eslint-plugin` como **única**
  fonte de estilo (Prettier foi removido por decisão do dev). `npm run lint`
  usa `--max-warnings=0`.
- Regras de negócio, modelo de dados e API: ver `PLANO.md`.

### Ambiente do dev
- Windows, PowerShell, IntelliJ IDEA, Docker Desktop, JDK Temurin 21.
- O repositório estava dentro do **OneDrive**. Se aparecerem erros estranhos de
  "arquivo em uso" ou lentidão (`node_modules/`, `target/`), sugira mover o
  projeto para fora do OneDrive (ex.: `C:\dev\...`).

### Lições já aprendidas (evite repetir os erros)
- O **Spring não lê o `.env`**; quem lê é o Docker Compose. As variáveis
  `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` precisam existir no ambiente
  de quem roda o backend (PowerShell `$env:...` vale só naquela janela; no IDEA,
  campo *Environment variables* da Run Configuration, em *Modify options*).
- A senha do banco **não tem valor padrão** no `application.properties`, para a
  aplicação falhar se a variável faltar.
- **Docker Desktop precisa estar aberto** (erro `dockerDesktopLinuxEngine` =
  daemon parado). Esperar o container ficar `healthy` antes de rodar o backend.
- Porta do banco publicada só em `127.0.0.1`.
- Migrations Flyway: pasta `src/main/resources/db/migration`, nome
  `V<n>__descricao.sql` (dois underscores). **Nunca editar uma migration já
  aplicada** (checksum). Corrigir = nova versão `V<n+1>`.
- `ddl-auto` nunca `update` (usar `validate`/`none`).
- Config do ESLint em **flat config**; `rules` dentro de um objeto de
  configuração; presets do `@stylistic` registram o plugin.
- Contraste mínimo WCAG 4,5:1 nas cores do tema (a primária `#c6d219` pede texto preto).
- Fonte Roboto via `@fontsource/roboto`, só `latin` e pesos 300/400/500/700.
- Nunca commitar `.env`, `target/`, `node_modules/`, `.idea/`.

---

## 3. Como fazer o code review

Não aprove só pelo que o dev diz. **Verifique**:

1. Busque a branch (`git fetch origin <branch>`) e leia o diff contra `main`
   (`git diff origin/main...<branch>`). Se a branch no GitHub ainda estiver igual
   à `main`, ele **não deu push**: peça o push ou que cole o código.
2. Rode os critérios do ticket numa **cópia temporária** (por exemplo,
   `git worktree add` em pasta temporária; frontend: `npm ci`, `npm run lint`,
   `npm run build`; backend: `./mvnw test`). Descarte a cópia depois.
3. Teste de propósito o que o ticket promete (ex.: gerar um warning para ver o
   `--max-warnings` falhar; escrever `any` para ver o lint barrar).
4. Confira: nada sensível versionado, mensagens de commit no imperativo,
   commits pequenos, documentação coerente (`grep` por termos obsoletos).
5. Responda com: **resultado** (aprovado / pedido de ajustes), o que está certo,
   **ajustes obrigatórios** (com dica, não a solução), observações menores.
6. Seja honesto sobre o que **não** conseguiu verificar (ex.: não subiu o
   container, não leu a descrição do PR).

### Título e descrição de PR
Quando o dev pedir, redija em português, com as seções **Contexto**, **O que
mudou**, **Decisões**, **Como testar**. Só inclua em "Como testar" o que ele
de fato testou. Título: `BARB-N: <verbo no imperativo> ...`.

---

## 4. Formato de um ticket

```
## 🎫 BARB-N: <título>
**Prioridade:** ... · **Depende de:** ... · **Branch:** `tipo/nome`

**Contexto:** por que existe.

**Critérios de aceite:**
- [ ] ...
```

Convenções de branch: `feat/...`, `fix/...`, `chore/...`, `docs/...`.
Commits: imperativo, pequenos, um por mudança lógica.

---

## 5. Estado atual

| Ticket | Título | Estado |
|---|---|---|
| BARB-1 | Versionar o frontend base | ✅ Concluído (PR #1) |
| BARB-2 | ESLint (padronização) | ✅ Concluído (PRs de lint; Prettier removido, `@stylistic`) |
| BARB-3 | MUI e tema base | ✅ Concluído (tema, Roboto latin 300/400/500/700) |
| BARB-4 | PostgreSQL com Docker Compose | ✅ Concluído (PR #5) |
| BARB-5 | Projeto Spring Boot base | 🟡 **Em andamento**, ver abaixo |
| BARB-6 em diante | Fases 1 a 5 do `PLANO.md` | ⬜ A fazer |

### BARB-5 em andamento: o que já foi feito
- [x] Projeto Maven gerado em `backend/` (group `io.github.matheusantts`,
      artifact `barbearia`, Spring Boot 4.1.x, Java 21).
- [x] Conexão com o banco por variáveis de ambiente (aplicação sobe, Hikari ok).
- [x] Flyway aplicando `V1__criar_tabela_teste.sql` (tabela `teste` criada,
      registrada em `flyway_schema_history`).
- [x] `GET /actuator/health` → `UP`.

### BARB-5: o que falta (próximo passo para o dev)
- [ ] `spring.jpa.hibernate.ddl-auto=validate` e `spring.jpa.open-in-view=false`
      no `application.properties` (o log avisou sobre `open-in-view`).
- [ ] Rodar `.\mvnw test`: o `contextLoads` deve passar. Pedir que o dev teste
      **com e sem** as variáveis de ambiente e anote o que acontece (se o teste
      depende das variáveis do terminal, discutir como tratar no PR).
- [ ] Documentação: trocar "Spring Boot 3" por "Spring Boot 4" em `CLAUDE.md`
      (linha do Backend) e `PLANO.md` (tabela de stack); adicionar ao `README.md`
      a seção do backend (JDK 21, variáveis de ambiente, como rodar).
- [ ] Commits pequenos em branch `feat/backend-base`: esqueleto, configuração do
      banco/JPA, migration V1, documentação. `git status` limpo (sem `target/`,
      `.idea/`, `.env`, arquivos de saída de log).
- [ ] Push, PR e **code review** (seção 3).

---

## 6. Backlog (tickets seguintes)

Entregue um por vez, nesta ordem, só após o merge do anterior. Detalhes de
regras em `PLANO.md`. Todos seguem o ciclo da seção 1.

### BARB-6: Serviços (Fase 1)
Branch `feat/services`. Migration Flyway da tabela `service` (substitui a tabela
`teste` por uma `V2` que a remove). Entidade, repositório, DTOs separados,
`GET /api/services` (público, só ativos) e CRUD admin básico (sem auth ainda).
Critérios: validação com Bean Validation, camadas controller → service →
repository, teste de serviço, sem regra de negócio no controller.

### BARB-7: Horário de trabalho e bloqueios (Fase 1)
Branch `feat/working-hours`. Migrations `working_hours` e `time_block`,
entidades, endpoints admin. Critérios: validação de intervalos (início < fim),
tratamento de erros em `@RestControllerAdvice`, testes.

### BARB-8: Motor de disponibilidade (Fase 2)
Branch `feat/availability`. Classe isolada `AvailabilityService` que, dado dia
e serviço, devolve slots livres de 30 min (considera horário de trabalho,
pausas, bloqueios, agendamentos ativos, antecedência mínima de 1h e máxima de
30 dias, fuso `America/Sao_Paulo`, UTC no banco). `GET /api/availability`.
Critérios: **cobertura de testes unitários** dos casos de borda (fim do dia,
bloqueios, serviço mais longo que o slot, horário de verão/fuso).
Pergunta-guia: o que acontece se dois clientes reservam o mesmo horário ao
mesmo tempo?

### BARB-9: Criar agendamento com anti-conflito (Fase 2)
Branch `feat/create-appointment`. Migration `appointment` com **constraint de
exclusão** sobre `tstzrange(starts_at, ends_at)` onde `status <> 'CANCELED'`
(extensão `btree_gist` se necessário). `POST /api/appointments` (nome,
WhatsApp, serviço, horário), limite de 2 agendamentos ativos por telefone,
conflito → `409`. Critérios: teste de concorrência/conflito, mensagens de erro
claras, validação de telefone.

### BARB-10: Autenticação do barbeiro (Fase 4)
Branch `feat/admin-auth`. Spring Security, usuário admin único (`admin_user`,
senha com BCrypt), `POST /api/admin/login` (JWT ou sessão; o dev decide e
justifica), rotas `/api/admin/**` protegidas, CORS restrito ao front.
Critérios: senha nunca em texto puro nem no repositório, testes de acesso
negado/permitido.

### BARB-11: Endpoints de agenda do admin (Fase 4)
Branch `feat/admin-appointments`. `GET /api/admin/appointments?from=&to=`,
`PATCH .../{id}/cancel`, `complete`, `no-show`, `POST` manual, CRUD de bloqueios.
Cancelar libera o horário imediatamente (`CANCELED` sai da constraint).
Critérios: transições de status válidas, testes.

### BARB-12: Cliente: escolher serviço (Fase 3)
Branch `feat/client-services`. Tela com lista de serviços (TanStack Query),
React Router, MUI, estados de carregamento e erro. Cliente HTTP tipado, sem `any`.

### BARB-13: Cliente: calendário e horários (Fase 3)
Branch `feat/client-slots`. Seleção de data (`@mui/x-date-pickers` + `dayjs`) e
**grade de horários** em botões/chips (não dropdown). Mobile first.

### BARB-14: Cliente: dados e confirmação (Fase 3)
Branch `feat/client-booking`. Formulário (nome e WhatsApp) com React Hook Form +
Zod, tratamento do `409` ("horário acabou de ser reservado"), tela de
confirmação com resumo e botão "Falar com o barbeiro no WhatsApp" (`wa.me`).

### BARB-15: Painel: login e rotas protegidas (Fase 4)
Branch `feat/admin-login-ui`. Tela de login, guarda de rotas, logout.

### BARB-16: Painel: agenda e cancelamento (Fase 4)
Branch `feat/admin-agenda`. Lista de agendamentos por dia/semana em **cards**
(mobile first), ações **Cancelar** (com `Dialog` de confirmação), Concluído,
Não compareceu, e botão **"Avisar cliente"** abrindo `wa.me` com mensagem pronta.
Este é o fluxo principal do produto: revise com cuidado.

### BARB-17: Painel: agendamento manual, bloqueios, serviços e horários (Fase 4)
Branch `feat/admin-management`. Telas de agendamento manual, bloqueio de
horários, CRUD de serviços e configuração do horário de trabalho.

### BARB-18: Segurança e abuso (Fase 5)
Branch `feat/hardening`. Rate limit no `POST /api/appointments`, revisão de
validações, aviso de privacidade (LGPD), cabeçalhos de segurança, revisão de CORS.

### BARB-19: Testes E2E e polimento (Fase 5)
Branch `test/e2e`. Teste E2E do fluxo cliente (agendar) e do barbeiro
(cancelar), polimento mobile, acessibilidade básica (contraste, foco).

### BARB-20: Deploy (Fase 5)
Branch `chore/deploy`. Front (Vercel/Netlify), API e banco (Railway/Render),
variáveis de ambiente de produção, HTTPS, documentação de deploy no README.

> Ao concluir cada ticket, o dev marca os itens correspondentes no checklist de
> `PLANO.md` (Seção 9). Mantenha este arquivo atualizado: mude o estado na
> seção 5 e ajuste o backlog se o escopo mudar.

---

## 7. Prompt para iniciar uma nova sessão de IA

Cole isto numa conversa nova, com o repositório disponível:

> Leia `CLAUDE.md`, `PLANO.md` e `TICKETS.md` neste repositório. Você é o tech
> lead e mentor deste projeto, conforme a seção 1 do `TICKETS.md`. Veja o estado
> atual na seção 5, continue o ticket em andamento do ponto em que parou e
> responda em português, uma etapa por vez, sem entregar o código das features.
> Verifique o que o dev já fez buscando a branch no GitHub antes de opinar.
