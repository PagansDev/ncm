# Tabela Fiscal

Sistema de consulta para informações fiscais brasileiras, começando com a Nomenclatura Comum do Mercosul (NCM).

## Objetivo

Este projeto tem como objetivo facilitar a localização e consulta de informações fiscais brasileiras, oferecendo uma interface moderna e intuitiva para profissionais que trabalham com classificação fiscal, importação, exportação e compliance tributário.

## Acesso Online

🌐 **Aplicação em produção**: [https://tabela-fiscal.vercel.app/](https://tabela-fiscal.vercel.app/)

## Funcionalidades

### NCM (Nomenclatura Comum do Mercosul)

- **Busca avançada**: Pesquisa por código ou descrição com suporte a acentos e case-insensitive
- **Agrupamento hierárquico**: Organização por capítulos (2 dígitos) e posições (4 dígitos) conforme estrutura oficial NCM
- **Contexto preservado**: Sistema inteligente que mantém nomes de grupos mesmo em buscas filtradas
- **Cache otimizado**: Persistência do contexto no IndexedDB para carregamento instantâneo
- **Subgrupos contextuais**: Posições agrupadas dentro de capítulos com referência hierárquica
- **Formatação brasileira**: Datas no padrão DD/MM/YYYY
- **Renderização HTML**: Suporte completo a conteúdo HTML nas descrições
- **Cópia rápida**: Botão para copiar códigos NCM com feedback visual
- **Paginação eficiente**: Navegação otimizada para o grande volume de dados
- **Modo escuro**: Interface adaptável para diferentes preferências

## Tecnologias

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **UI**: Nuxt UI, Tailwind CSS, componentes customizados
- **Backend**: Supabase
- **Cache**: IndexedDB para persistência local
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
│   ├── AppTable.vue    # Tabela customizada com agrupamento hierárquico
│   ├── SearchBar.vue   # Barra de pesquisa
│   └── SimplePagination.vue # Paginação customizada
├── composables/        # Composables Vue para lógica reutilizável
│   ├── useNCMContext.ts    # Gerenciamento do contexto NCM
│   ├── useNCMData.ts       # Gerenciamento de dados NCM
│   └── useNCMStorage.ts    # Persistência com IndexedDB
├── utils/              # Utilitários
│   └── format.ts       # Formatação de datas e HTML
└── app.vue            # Componente principal
```

## Como Usar

1. **Busca simples**: Digite o código NCM ou parte da descrição
2. **Navegação hierárquica**:
   - Capítulos (2 dígitos): Grupos principais expansíveis
   - Posições (4 dígitos): Subgrupos dentro de cada capítulo
   - Itens (6/8 dígitos): Códigos específicos com descrições detalhadas
4. **Cópia**: Clique no ícone ao lado do código para copiá-lo
5. **Paginação**: Navegue entre as páginas usando os controles inferiores
6. **Cache automático**: O contexto é salvo localmente para carregamento instantâneo

## Dados

O sistema utiliza dados oficiais da NCM(2025), garantindo precisão e confiabilidade para consultas fiscais.

### Estrutura Hierárquica NCM

- **Capítulos (2 dígitos)**: Categorias principais (ex: 03 - Peixes e crustáceos)
- **Posições (4 dígitos)**: Subcategorias (ex: 03.03 - Peixes vivos)
- **Subposições (6 dígitos)**: Classificações específicas
- **Códigos NCM (8 dígitos)**: Classificação final para importação/exportação

### Performance

- **Cache inteligente**: Contexto salvo no IndexedDB para carregamento instantâneo
- **Atualização automática**: Contexto expira após 7 dias e é recarregado automaticamente
- **Otimização de busca**: Apenas dados necessários são carregados por página

## Contribuição

Este é um projeto em desenvolvimento ativo. Contribuições são bem-vindas para melhorar a funcionalidade e adicionar novas fontes de dados fiscais.

## Licença

Projeto desenvolvido para facilitar o acesso a informações fiscais brasileiras.
