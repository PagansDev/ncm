# Tabela Fiscal

Sistema de consulta para informações fiscais brasileiras, começando com a Nomenclatura Comum do Mercosul (NCM).

## Objetivo

Este projeto tem como objetivo facilitar a localização e consulta de informações fiscais brasileiras, oferecendo uma interface moderna e intuitiva para profissionais que trabalham com classificação fiscal, importação, exportação e compliance tributário.

## Acesso Online

🌐 **Aplicação em produção**: [https://tabela-fiscal.vercel.app/](https://tabela-fiscal.vercel.app/)

## Funcionalidades

### NCM (Nomenclatura Comum do Mercosul)

- **Busca avançada**: Pesquisa por código ou descrição com suporte a acentos e case-insensitive
- **Agrupamento inteligente**: Organização por códigos de 2 dígitos com grupos expansíveis
- **Formatação brasileira**: Datas no padrão DD/MM/YYYY
- **Renderização HTML**: Suporte completo a conteúdo HTML nas descrições
- **Cópia rápida**: Botão para copiar códigos NCM com feedback visual
- **Paginação eficiente**: Navegação otimizada para o grande volume de dados
- **Modo escuro**: Interface adaptável para diferentes preferências

## Tecnologias

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **UI**: Nuxt UI, Tailwind CSS, componentes customizados
- **Backend**: Supabase
- **Deploy**: Vercel

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm, pnpm, yarn ou bun

### Configuração

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd ncm
```

2. **Instale as dependências**

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```
- faça o download do json oficial do governo. Faça um script para subir no supabase (não esqueça de por no schema public)

4. **Execute o servidor de desenvolvimento**

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
app/
├── components/          # Componentes Vue reutilizáveis
│   ├── AppHeader.vue   # Cabeçalho com logo e navegação
│   ├── AppTable.vue    # Tabela customizada com agrupamento
│   ├── SearchBar.vue   # Barra de pesquisa
│   └── SimplePagination.vue # Paginação customizada
├── utils/              # Utilitários
│   └── format.ts       # Formatação de datas e HTML
└── app.vue            # Componente principal
```

## Como Usar

1. **Busca simples**: Digite o código NCM ou parte da descrição
2. **Navegação**: Use os grupos expansíveis para explorar categorias
3. **Cópia**: Clique no ícone ao lado do código para copiá-lo
4. **Paginação**: Navegue entre as páginas usando os controles inferiores

## Dados

O sistema utiliza dados oficiais da NCM(2025), garantindo precisão e confiabilidade para consultas fiscais.


## Contribuição

Este é um projeto em desenvolvimento ativo. Contribuições são bem-vindas para melhorar a funcionalidade e adicionar novas fontes de dados fiscais.

## Licença

Projeto desenvolvido para facilitar o acesso a informações fiscais brasileiras.
