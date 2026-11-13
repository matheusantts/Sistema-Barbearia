# Plano — Sistema de Agendamento para Barbeiro

## 1. Visão geral

Sistema simples para **um único barbeiro**. O cliente agenda **sem cadastro**
(apenas nome e WhatsApp). O barbeiro usa um painel com login para ver a agenda
e **cancelar** horários quando o cliente pedir.

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite + MUI, React Router, TanStack Query, React Hook Form + Zod |
| Qualidade (front) | ESLint, TypeScript `strict` |
| Backend | Spring Boot 3, Java 21, Web, Data JPA, Validation, Security |
| Banco | PostgreSQL + Flyway |
| Infra local | Docker Compose |
| Deploy | Front: Vercel/Netlify. API + banco: Railway/Render |

## 3. Escopo do MVP

**Cliente (público, sem login)**
1. Escolhe o serviço (corte, barba, combo).
2. Escolhe dia e horário livre.
3. Informa nome e WhatsApp e confirma.
4. Vê o resumo e um botão "Falar com o barbeiro no WhatsApp".

**Barbeiro (painel, com login)**
- Agenda do dia/semana em lista (mobile first).
- Ações por agendamento: **Cancelar**, Concluído, Não compareceu, Avisar via WhatsApp.
- Agendamento manual (cliente que chamou direto).
- Bloqueio de horários (almoço, folga, dia inteiro).
- Configuração de horário de trabalho e de serviços.

**Fora do MVP:** pagamento online, lembretes automáticos, link de cancelamento
para o cliente, múltiplos profissionais, relatórios.

## 4. Fluxo de cancelamento

1. Cliente pede o cancelamento pelo WhatsApp.
2. Barbeiro abre o painel, localiza o agendamento e toca em **Cancelar**
   (com diálogo de confirmação).
3. O status vira `CANCELED` e o horário volta a ficar livre imediatamente.
4. O painel oferece **"Avisar cliente"**, que abre `wa.me/<telefone>?text=...`
   com a mensagem pronta.

## 5. Modelo de dados

```
service        (id, name, duration_min, price, active)
working_hours  (weekday, start_time, end_time, break_start, break_end)
time_block     (id, starts_at, ends_at, reason)
appointment    (id, service_id, customer_name, customer_phone,
                starts_at, ends_at, status, created_at)
admin_user     (id, email, password_hash)
```

`appointment.status`: `CONFIRMED | CANCELED | DONE | NO_SHOW`.

**Anti-conflito:** constraint de exclusão no Postgres sobre
`tstzrange(starts_at, ends_at)` onde `status <> 'CANCELED'`. Conflito vira
`409 Conflict` na API.

## 6. API

**Pública**
- `GET /api/services`
- `GET /api/availability?date=YYYY-MM-DD&serviceId=`
- `POST /api/appointments`

**Admin (autenticada)**
- `POST /api/admin/login`
- `GET /api/admin/appointments?from=&to=`
- `PATCH /api/admin/appointments/{id}/cancel` (e `complete`, `no-show`)
- `POST /api/admin/appointments`
- CRUD `/api/admin/blocks`, `/api/admin/services`, `/api/admin/working-hours`

## 7. Regras de negócio (padrão inicial)

- Slots de **30 minutos**.
- Agendamento com no mínimo **1h** de antecedência e no máximo **30 dias**.
- Máximo de **2 agendamentos ativos por telefone**.
- Fuso do negócio: `America/Sao_Paulo`; armazenamento em UTC.

## 8. Segurança

- Rate limit e validação (telefone, tamanho do nome) no `POST /appointments`.
- Senha com BCrypt, CORS restrito ao domínio do front, HTTPS.
- Aviso de privacidade (LGPD): telefone usado só para o agendamento.

## 9. Fases e checklist

### Fase 0 — Fundação (~2 dias)
- [ ] Criar `backend/` (Spring Initializr) e `frontend/` (Vite + React + TS)
- [ ] `docker-compose.yml` com PostgreSQL
- [ ] Configurar **ESLint + Prettier** no frontend (`npm run lint` limpo)
- [ ] Instalar MUI e criar o tema base
- [ ] Primeiro commit organizado

### Fase 1 — Cadastros (~3 dias)
- [ ] Migrations Flyway: `service`, `working_hours`, `time_block`
- [ ] Entidades, repositórios e endpoints de serviços
- [ ] Horário de trabalho e bloqueios

### Fase 2 — Motor de agenda (~4 dias)
- [ ] `AvailabilityService`: calcula slots livres
- [ ] Criação de agendamento com constraint anti-conflito
- [ ] Tratamento de `409` no `@RestControllerAdvice`
- [ ] Testes unitários do cálculo de disponibilidade

### Fase 3 — Telas do cliente (~4 dias)
- [ ] Escolha de serviço
- [ ] Calendário + grade de horários
- [ ] Formulário (nome e WhatsApp) com validação
- [ ] Tela de confirmação com botão de WhatsApp

### Fase 4 — Painel do barbeiro (~5 dias)
- [ ] Login (Spring Security) e rotas protegidas no front
- [ ] Lista da agenda (dia/semana)
- [ ] **Cancelar** com diálogo de confirmação
- [ ] Concluído / Não compareceu
- [ ] Agendamento manual e bloqueio de horários
- [ ] Botão "Avisar cliente" via WhatsApp

### Fase 5 — Acabamento e deploy (~3 dias)
- [ ] Polimento mobile
- [ ] Testes E2E do fluxo principal
- [ ] Deploy (front + API + banco)

## 10. Critérios de qualidade

- `npm run lint` e `npm run build` passam sem erros nem warnings.
- Sem `any` no TypeScript.
- Regra de negócio fora dos controllers; DTOs separados das entidades.
- Cálculo de disponibilidade coberto por testes.
- Commits pequenos, uma feature por branch.
