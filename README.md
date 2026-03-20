# Mini Twitter — Frontend

Este projeto é uma aplicação de rede social inspirada no Twitter, desenvolvida para demonstrar práticas modernas de desenvolvimento web, incluindo estados globais, consumo de APIs REST, autenticação JWT e testes automatizados.

---

## Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **React 19** | Biblioteca base para construção da interface |
| **TypeScript** | Tipagem estática para maior segurança e manutenção |
| **Tailwind CSS (v4)** | Estilização por utilitários com suporte a dark/light mode |
| **React Textarea Autosize** | Melhora a experiência de escrita de posts com ajuste automático de altura |
| **React Intersection Observer** | Implementação de scroll infinito performático |
| **TanStack Query (v5)** | Gerenciamento de estado de servidor, cache e sincronização |
| **Axios** | Cliente HTTP para comunicação com a API |
| **React Hook Form + Zod** | Gerenciamento de formulários e validação de esquemas |
| **React Router Dom (v7)** | Sistema de roteamento dinâmico |
| **Zustand** | Gerenciamento de estado global leve |
| **Lucide React** | Biblioteca de ícones |
| **Framer Motion** | Animações e transições de interface |
| **Vitest + RTL** | Testes unitários e de componentes |
| **Cypress** | Testes de ponta a ponta (E2E) |

---

## Funcionalidades

### Autenticação
- Registro de novos usuários com validação de dados
- Login com armazenamento de token JWT no `localStorage`
- Persistência de sessão e proteção de rotas
- Logout com limpeza de estado e tokens

### Posts
- Timeline com scroll infinito
- Criação de posts com título, conteúdo e upload de imagem (limite de 5MB)
- Busca dinâmica por termo ou título
- Edição e exclusão permitidas apenas ao autor original
- Confirmação antes de excluir

### Interação Social
- Sistema de curtidas com UI otimista
- Rollback automático de estado em caso de falha na API

### Interface
- Tema dark/light com transição suave e persistência no `localStorage`
- Animações de entrada e saída entre rotas de autenticação

---

## Arquitetura de Pastas

```
src/
├── api/           # Configuração do Axios e interceptors
├── components/    # Componentes reutilizáveis (UI e negócio)
├── hooks/         # Hooks customizados
├── layouts/       # Wrappers de estrutura (Auth, Timeline)
├── pages/         # Componentes de rota
├── store/         # Estado global com Zustand
├── types/         # Interfaces TypeScript centralizadas
└── utils/         # Funções auxiliares e lógica de autenticação
```

---

## Configuração do Ambiente

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/mini-twitter-frontend.git

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com a URL da sua API:

```env
VITE_API_URL=http://localhost:3000
```

### Execução

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Visualização do build
```

---

## Testes

### Unitários e de Componentes — Vitest + React Testing Library

Testa componentes isolados e lógica de hooks, garantindo que renderização e comportamento funcionem conforme esperado.

```bash
npm run test          # Executa todos os testes
npm run test:watch    # Modo watch (re-executa ao salvar)
npm run test:coverage # Relatório de cobertura
```

### E2E — Cypress

Simula o fluxo completo do usuário no navegador: cadastro → login → criação de post → edição → exclusão.

```bash
npm run cy:open   # Interface interativa
npm run cy:run    # Modo headless (CI)
```
