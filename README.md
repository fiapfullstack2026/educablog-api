# EducaBlog

API para blogging dinâmico entre professores e alunos.

O projeto foi desenvolvido como parte do segundo Tech Challenge FIAP e oferece um backend em TypeScript com Express e MongoDB para criar e atualizar publicações.

---

## Stack

| Camada      | Tecnologia                       |
| ----------- | -------------------------------- |
| Backend     | Node.js · TypeScript · Express 5 |
| Banco       | MongoDB · Mongoose 9             |
| Validação   | Zod 4                            |
| Auth        | JWT · bcryptjs                   |
| Docs        | swagger-ui-express               |
| Build / Dev | tsx · tsup                       |
| Testes      | Vitest 4                         |
| Lint        | ESLint · Prettier                |

---

## Início rápido

```bash
# 1. Entrar no diretório do projeto
cd educablog

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run start:dev

# Alternativa: build + execução
npm run build
npm start
```

O servidor inicia por padrão em `http://localhost:3000`.

---

## Docker

O projeto inclui `Dockerfile` (build multi-stage) e `docker-compose.yml` com a API e um serviço MongoDB.

```bash
# Subir API + MongoDB
docker compose up --build

# Definir chave JWT (opcional; padrão: dev-secret)
JWT_SECRET=minha-chave docker compose up --build
```

O `docker-compose.yml` aguarda o MongoDB ficar saudável antes de iniciar a API (`healthcheck` com `mongosh`).

---

## Configuração

A aplicação usa as seguintes variáveis de ambiente:

| Variável      | Descrição                  | Valor padrão                          |
| ------------- | -------------------------- | ------------------------------------- |
| `PORT`        | Porta do servidor          | `3000`                                |
| `MONGODB_URI` | URI de conexão com MongoDB | `mongodb://127.0.0.1:27017/educablog` |
| `JWT_SECRET`  | Chave secreta do JWT       | `dev-secret`                          |

---

## Testes

```bash
# Modo interativo (UI do Vitest)
npm test

# Com relatório de cobertura (UI)
npm run test:coverage

# Headless (para CI)
npm run test:ci

# Headless com cobertura (para CI)
npm run test:coverage:ci
```

Os testes ficam em `test/` e o relatório de cobertura é gerado em `test/report/`.

---

## CI/CD

| Pipeline | Arquivo                        | Gatilho                        |
| -------- | ------------------------------ | ------------------------------ |
| CI       | `.github/workflows/ci.yml`     | push/PR para `main` e `develop` |
| CD       | `.github/workflows/cd.yml`     | push para `main`               |

- **CI**: executa lint (`npm run lint`) e testes com cobertura (`npm run test:coverage:ci`). O relatório de cobertura é publicado como artefato por 7 dias.
- **CD**: aciona o deploy hook do Render via `curl` (segredo `RENDER_DEPLOY_HOOK_URL`).

---

## Endpoints principais

### Usuários (públicos)

- `POST /user/register` — cadastra um novo usuário (`username`, `password`, `isTeacher?`). Retorna `201`.
- `POST /user/signin` — autentica e retorna um token JWT. Retorna `200`.

### Usuários (autenticados)

Professores (`isTeacher = true`) acessam qualquer usuário; alunos acessam apenas o próprio cadastro.

- `GET /user?isTeacher=true|false` — professor: lista usuários (filtro opcional por perfil). Aluno: retorna somente ele mesmo.
- `GET /user/:id` — retorna um usuário pelo id. Aluno só no próprio id, senão `403`.
- `PUT /user/:id` — atualiza `username`, `password` e/ou `isTeacher`. Retorna `204`. Aluno só no próprio id e não pode alterar `isTeacher` (`403`).
- `DELETE /user/:id` — remove um usuário. Somente professores; alunos recebem `403`. Retorna `204`.

### Posts

- `GET /post/` — lista todos os posts.
- `GET /post/search?q=termo` — busca posts por palavra-chave.
- `GET /post/:id` — retorna um post pelo id.
- `POST /post/` — cria um post _(somente professores)_. Retorna `201`.
- `PUT /post/:id` — atualiza um post existente _(somente professores)_. Retorna `200`. 
- `DELETE /post/:id` — remove um post _(somente professores)_. Retorna `200`.

### Documentação

- `GET /docs` — Swagger UI com a especificação completa da API.

Todos os payloads são validados com Zod.

---

## Estrutura do projeto

```
educablog/                      # Raiz do repositório
├── README.md
├── .github/
│   └── workflows/
│       ├── ci.yml             # Lint e testes
│       └── cd.yml             # Deploy para Render
└── educablog/                 # Aplicação (API)
    ├── package.json           # Dependências e scripts
    ├── tsconfig.json          # Configuração TypeScript
    ├── Dockerfile              # Build multi-stage (builder)
    ├── docker-compose.yml      # API + MongoDB
    ├── test/                   # Suite de testes (Vitest)
    │   ├── vitest.config.ts
    │   ├── controllers/post/
    │   ├── repositories/
    │   └── use-cases/
    └── src/
        ├── app.ts                # Instância do Express e middlewares globais
        ├── server.ts             # Entrada do servidor e conexão com MongoDB
        ├── docs/
        │   └── swagger.ts        # Especificação OpenAPI
        ├── entities/             # Schemas e modelos de domínio
        │   ├── post.schema.ts
        │   ├── user.schema.ts
        │   └── models/
        │       ├── post.interface.ts
        │       └── user.interface.ts
        ├── http/
        │   ├── middleware/
        │   │   └── jwt-validate.ts   # authenticate + authorize (professores)
        │   └── controllers/
        │       ├── post/
        │       │   ├── routes.ts
        │       │   ├── create.ts
        │       │   ├── update.ts
        │       │   ├── remove.ts
        │       │   ├── get.ts
        │       │   ├── list.ts
        │       │   └── search.ts
        │       └── user/
        │           ├── routes.ts
        │           ├── register.ts
        │           └── sign-in.ts
        ├── lib/
        │   └── mongoose.ts       # Conexão com MongoDB
        ├── utils/
        │   └── global-error.ts   # Handler de erros global
        ├── repositories/         # Interfaces e implementações de repositório
        │   ├── post.repository.interface.ts
        │   ├── user.repository.interface.ts
        │   └── mongoose/
        │       ├── post.repository.ts
        │       └── user.repository.ts
        └── use-cases/            # Regras de negócio
            ├── create-post.ts
            ├── update-post.ts
            ├── delete-post.ts
            ├── get-post.ts
            ├── list-posts.ts
            ├── search-posts.ts
            ├── register.ts
            ├── sign-in.ts
            ├── errors/
            │   ├── resource-not-found-error.ts
            │   └── user-already-exists-error.ts
            └── factory/
                ├── make-create-post-use-case.ts
                ├── make-update-post-use-case.ts
                ├── make-delete-post-use-case.ts
                ├── make-get-post-use-case.ts
                ├── make-list-posts-use-case.ts
                ├── make-search-posts-use-case.ts
                ├── make-register-use-case.ts
                └── make-sign-in-use-case.ts
```

---

## Arquitetura

A aplicação segue uma arquitetura de camadas:

- **Controllers**: recebem requisições HTTP e validam payloads com Zod.
- **Use cases**: encapsulam as regras de negócio (CRUD de posts, registro e autenticação de usuários).
- **Repositórios**: abstraem a persistência com MongoDB via Mongoose.
- **Entities/Schemas**: definem os modelos `Post` e `User`.
- **Middleware JWT**: `authenticate` valida o token em todos os endpoints, exceto os ligados ao `User`; `authorize` restringe criação, edição e remoção de posts (e a exclusão de usuários) a professores; `authorizeSelfOrTeacher` permite que alunos consultem e editem apenas o próprio usuário.
- **Handler global** (`src/utils/global-error.ts`): trata `ZodError`, erros do Mongoose (`CastError`, `ValidationError`), `ResourceNotFoundError`, `UserAlreadyExistsError` e erros HTTP do Express 5.


