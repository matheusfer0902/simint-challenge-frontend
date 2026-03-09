# Poke Center

Sistema exclusivo para treinadores e pesquisadores. Cadastre-se, organize e acompanhe seus Pokémons com a eficiência de um Pokémon Center.

---

## Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar](#como-rodar)
- [Arquivos e variáveis necessárias](#arquivos-e-variáveis-necessárias)
- [Scripts disponíveis](#scripts-disponíveis)
- [Funcionalidades](#funcionalidades)
- [Permissões por perfil](#permissões-por-perfil)
- [Screenshots](#screenshots)

---

## Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** (componentes acessíveis)
- **React Hook Form + Zod** (formulários e validação)
- **Recharts** (gráficos)
- **Lucide React** (ícones)

---

## Pré-requisitos

- **Node.js** 20+
- **npm**, **yarn**, **pnpm** ou **bun**
- **Backend da API** rodando (por padrão em `http://localhost:3333`)

---

## Como rodar

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd simint-challenge-frontend
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (veja [Arquivos e variáveis necessárias](#arquivos-e-variáveis-necessárias)).

### 3. Subir o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A landing page é exibida em `/`; para área logada, faça login em `/auth/login` ou cadastro em `/auth/register`.

### 4. Build para produção

```bash
npm run build
npm start
```

---

## Arquivos e variáveis necessárias

### Arquivo `.env.local` (opcional)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL base da API usada no **browser** (fetch direto). Use quando o front e o backend estiverem no mesmo domínio ou CORS estiver ok. | `http://localhost:3333` |
| `BACKEND_URL` | URL do backend usada **apenas no servidor** (roteador de proxy em `/api/proxy/[...path]`). Útil em deploy (ex.: Vercel) para repassar cookies e evitar CORS. | `http://localhost:3333` |

**Exemplo `.env.local`:**

```env
# Desenvolvimento local (backend na mesma máquina)
NEXT_PUBLIC_API_URL=http://localhost:3333
BACKEND_URL=http://localhost:3333
```

Para produção com proxy (ex.: front na Vercel, API na Railway), costuma-se usar:

- `NEXT_PUBLIC_API_URL` apontando para o mesmo domínio do front (para ir para o proxy), ou
- Configurar o front para usar `/api/proxy` como base e definir `BACKEND_URL` com a URL real da API.

**Arquivo de exemplo:** há um `.env.example` na raiz; copie para `.env.local` e ajuste os valores.

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe o Next.js em modo desenvolvimento (`http://localhost:3000`). |
| `npm run build` | Gera o build de produção. |
| `npm start` | Sobe o servidor com o build já gerado (rode `npm run build` antes). |
| `npm run lint` | Executa o ESLint no projeto. |

---

## Funcionalidades

### Públicas

- **Landing** (`/`) – Hero, features, como funciona, Pokémons, estatísticas, depoimentos e CTA.
- **Login** (`/auth/login`) – Autenticação por e-mail e senha.
- **Registro** (`/auth/register`) – Cadastro de novo usuário (trainer ou researcher).
- **Time compartilhado** (`/teams/shared/[token]`) – Visualização somente leitura de um time via link compartilhado.

### Área autenticada (por perfil)

- **Dashboard** (`/dashboard`) – Arena: listagem de batalhas disponíveis e de usuários, com abas e busca.
- **Times** (`/teams`) – CRUD de times, listagem com busca/filtro/paginação, detalhe do time e compartilhamento.
- **Pokémon** (`/pokemon`) – Listagem dos Pokémons do usuário com abas e filtros.
- **Detalhe do Pokémon** (`/pokemon/[id]`) – Ver e editar um Pokémon (incluindo sprite/nickname).
- **Pokedex** (`/pokedex`) – Catálogo de Pokémons (acesso **researcher** e **admin**), com filtros e painel de detalhe.
- **Treino** (`/train`) – Treinar Pokémon do time para ganhar XP (acesso **trainer** e **admin**).
- **Cura** (`/healing`) – Máquina de cura para recuperar Pokémons (todos os perfis).
- **Usuários** (`/users`) – Listagem, criação, edição e exclusão de usuários (apenas **admin**), com busca, filtro por role e ordenação.
- **Perfil** (`/profile`) – Editar dados do usuário logado (username, email, senha e, se admin, role).

Layout da área logada: **sidebar** (navegação por permissão), **header** com busca (quando a página usa) e menu do usuário (avatar, “Editar meus dados”, logout).

---

## Permissões por perfil

| Rota | Admin | Trainer | Researcher |
|------|-------|---------|------------|
| Dashboard | ✅ | ✅ | ✅ |
| Times | ✅ | ✅ | ✅ |
| Pokémon | ✅ | ✅ | ✅ |
| Pokedex | ✅ | ❌ | ✅ |
| Treino | ✅ | ✅ | ❌ |
| Cura | ✅ | ✅ | ✅ |
| Usuários | ✅ | ❌ | ❌ |
| Perfil | ✅ | ✅ | ✅ |

Acesso é validado no layout protegido; rotas não permitidas redirecionam para o dashboard.

---

## Screenshots

Use as seções abaixo para colocar imagens do site. Recomendação: salvar screenshots em `docs/screenshots/` e referenciar com caminhos relativos, por exemplo `docs/screenshots/landing-hero.png`.

### Landing

| Seção | Descrição | Imagem |
|-------|-----------|--------|
| Hero | Primeira dobra da landing | *Adicione `docs/screenshots/landing-hero.png`* |
| Features | Bloco de funcionalidades | *Adicione `docs/screenshots/landing-features.png`* |
| Como funciona | Passo a passo | *Adicione `docs/screenshots/landing-how-it-works.png`* |
| Pokémons | Galeria/lista de Pokémons | *Adicione `docs/screenshots/landing-pokemons.png`* |
| CTA | Chamada para ação final | *Adicione `docs/screenshots/landing-cta.png`* |

Exemplo de uso no README (descomente e ajuste os caminhos quando tiver as imagens):

```markdown
#### Hero
![Landing Hero](docs/screenshots/landing-hero.png)
```

### Autenticação

| Tela | Descrição | Imagem |
|------|-----------|--------|
| Login | Página de login | *Adicione `docs/screenshots/auth-login.png`* |
| Registro | Página de cadastro | *Adicione `docs/screenshots/auth-register.png`* |

### Área logada

| Página | Descrição | Imagem |
|--------|-----------|--------|
| Dashboard | Arena (batalhas e usuários) | *Adicione `docs/screenshots/dashboard.png`* |
| Times | Lista de times | *Adicione `docs/screenshots/teams-list.png`* |
| Detalhe do time | Time com membros e ações | *Adicione `docs/screenshots/team-detail.png`* |
| Pokémon | Lista dos meus Pokémons | *Adicione `docs/screenshots/pokemon-list.png`* |
| Detalhe do Pokémon | Edição de Pokémon | *Adicione `docs/screenshots/pokemon-detail.png`* |
| Pokedex | Catálogo (researcher/admin) | *Adicione `docs/screenshots/pokedex.png`* |
| Treino | Tela de treino (trainer/admin) | *Adicione `docs/screenshots/train.png`* |
| Cura | Máquina de cura | *Adicione `docs/screenshots/healing.png`* |
| Usuários | Lista de usuários (admin) | *Adicione `docs/screenshots/users.png`* |
| Perfil | Edição do meu perfil | *Adicione `docs/screenshots/profile.png`* |
| Time compartilhado | Visualização por link | *Adicione `docs/screenshots/shared-team.png`* |

---

## Estrutura sugerida para as imagens

Crie a pasta e adicione os arquivos conforme for tirando os screenshots:

```
docs/
  screenshots/
    landing-hero.png
    landing-features.png
    landing-how-it-works.png
    landing-pokemons.png
    landing-cta.png
    auth-login.png
    auth-register.png
    dashboard.png
    teams-list.png
    team-detail.png
    pokemon-list.png
    pokemon-detail.png
    pokedex.png
    train.png
    healing.png
    users.png
    profile.png
    shared-team.png
```

Assim que uma imagem existir, substitua no README o texto *"Adicione ..."* pela marcação:

```markdown
![Descrição](docs/screenshots/nome-do-arquivo.png)
```

---

## Deploy

O projeto está preparado para deploy em plataformas como **Vercel**. Configure as variáveis de ambiente no painel e, se a API estiver em outro domínio, use o proxy (`BACKEND_URL`) para repassar requisições e cookies. Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
