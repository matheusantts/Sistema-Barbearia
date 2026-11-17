# Sistema-barbearia

Sistema de agendamento de horários para um barbeiro. O cliente agenda sem
cadastro; o barbeiro gerencia e cancela horários por um painel com login.

- Plano completo e checklist: [PLANO.md](./PLANO.md)
- Regras de trabalho do projeto (modo aula): [CLAUDE.md](./CLAUDE.md)

**Stack:** React + TypeScript + MUI · Spring Boot · PostgreSQL · ESLint

## Banco de dados (PostgreSQL)

O banco roda em um container Docker, descrito no `docker-compose.yml`.

### Pré-requisitos
- Docker e Docker Compose instalados

### Como subir

1. Crie o arquivo `.env` a partir do exemplo e ajuste os valores (principalmente a senha):

   ```bash
   cp .env.example .env
   ```

2. Suba o banco:

   ```bash
   docker compose up -d
   ```

3. Confira se está pronto (o status deve ser `healthy`):

   ```bash
   docker compose ps
   ```

### Como parar

```bash
docker compose down
```

Os dados ficam guardados em um volume e **não** são apagados. Para apagar também
os dados, use `docker compose down -v` (cuidado: isso remove o banco inteiro).