# Gerenciador de Gastos

Sistema web simples para controle e análise de despesas pessoais. O backend grava os dados em um arquivo JSON no disco, permitindo rastreabilidade sem a necessidade de banco de dados relacional.

## Funcionalidades

- Cadastro, edição e remoção de gastos
- Listagem paginada/filtrada
- Dashboard com gráficos de gastos por categoria e por período
- Backup automático do arquivo de dados
- API RESTful completa (CRUD)

## Tecnologias Utilizadas

| Camada   | Tecnologia |
|----------|------------|
| Backend  | Node.js 18+, Express |
| Storage  | Arquivo JSON via módulo `fs` |
| Frontend | React + Vite |
| Gráficos | Chart.js (ou Recharts) |
| Testes   | Jest, Supertest, React Testing Library |

## Estrutura de Pastas (sugerida)

```text
gerenciador-de-gastos/
├─ backend/
│  ├─ data/
│  │  └─ gastos.json          # arquivo de persistência
│  ├─ backup/                 # cópias históricas
│  ├─ routes/
│  │  └─ gastos.js            # endpoints REST
│  ├─ services/
│  │  └─ fileService.js       # leitura/escrita do JSON
│  └─ server.js               # app Express
└─ frontend/
   ├─ src/
   │  ├─ components/
   │  ├─ pages/
   │  └─ services/api.js      # wrapper HTTP
   └─ vite.config.js
```

## Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

## Instalação

```bash
# clone o repositório
$ git clone <repo-url> gerenciador-de-gastos
$ cd gerenciador-de-gastos
```

### Backend

```bash
$ cd backend
$ npm install
# cria pasta de dados e arquivo inicial
$ mkdir -p data backup
$ echo "[]" > data/gastos.json
$ npm run dev    # inicia em modo desenvolvimento
```

### Frontend

```bash
$ cd frontend
$ npm install
$ npm run dev     # abre em http://localhost:5173
```

Por padrão, o frontend chama a API em `http://localhost:3000`. Ajuste `src/services/api.js` caso altere a porta.

## Scripts Úteis

| Comando                | Descrição                                    |
|------------------------|----------------------------------------------|
| `npm run dev` (backend)| inicia servidor Express com nodemon          |
| `npm test` (backend)   | executa testes Jest + Supertest              |
| `npm run build`        | compila frontend para produção (`dist/`)     |
| `npm run preview`      | serve build estático do React                |

## API Reference

### Estrutura do objeto Gasto

```json
{
  "id": "uuid",
  "data": "2023-08-21",
  "descricao": "Supermercado",
  "categoria": "Alimentação",
  "valor": 150.75
}
```

### Endpoints

| Método | Rota            | Descrição                  |
|--------|-----------------|----------------------------|
| GET    | `/gastos`       | Lista todos os gastos      |
| POST   | `/gastos`       | Cria novo gasto            |
| PUT    | `/gastos/:id`   | Atualiza gasto existente   |
| DELETE | `/gastos/:id`   | Remove gasto               |

#### Exemplo de requisição `POST /gastos`

```bash
curl -X POST http://localhost:3000/gastos \
  -H "Content-Type: application/json" \
  -d '{
        "data":"2023-08-21",
        "descricao":"Supermercado",
        "categoria":"Alimentação",
        "valor":150.75
      }'
```

## Persistência e Rastreamento

- Todos os registros são armazenados em `backend/data/gastos.json`.
- Antes de cada gravação, o arquivo atual pode ser copiado para `backend/backup/gastos_YYYYMMDD_HHmmss.json`, possibilitando auditoria.
- As operações de escrita são serializadas para evitar corrupção de dados.

## Testes

```bash
# backend
$ cd backend && npm test

# frontend (RTL + Vitest)
$ cd frontend && npm test
```

## Deploy

1. Gere o build do frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Sirva o conteúdo de `frontend/dist` como estático através do Express (ou nginx):
   ```js
   app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
   ```
3. Use um gerenciador de processos como `pm2` para manter o Node online.

## Roadmap / Próximos Passos

- Autenticação JWT para múltiplos usuários
- Filtragem avançada (por intervalo de datas, tags)
- Exportação de relatórios em PDF/CSV
- Migração opcional para SQLite ou Postgres
