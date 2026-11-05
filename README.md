# Portfólio — Benjamim Borges

Portfólio estático, feito em **HTML, CSS e JavaScript puro**, com identidade editorial e componentes visuais adaptados de padrões do [21st.dev](https://21st.dev/). Não utiliza React, TypeScript, Tailwind, npm ou build.

## O que foi implementado

- Página inicial e identidade visual original preservadas, com refinamentos de botões e cards.
- Cards de projetos com destaque editorial/bento, filtros, pesquisa e hover.
- Modais acessíveis com `<dialog>` nativo: contexto, solução, decisões técnicas, tecnologias e links.
- URLs compartilháveis: `#projeto=balancete-fiscal` e `#demo=nfe-explorer`.
- Laboratório com cards e **três demonstrações executáveis no navegador**:
  - **NF-e Explorer:** lê XML local, mostra emitente, destinatário, produtos e total.
  - **Webhook Simulator:** recebe JSON e simula códigos HTTP e tentativas.
  - **DataCheck Playground:** lê CSV, conta linhas/colunas, lacunas e duplicatas.
- Cada demonstração pode ser aberta pelo Laboratório ou pelo modal de seu projeto correspondente.
- Links antigos para experimentos do GitHub preservados.
- Marquee horizontal que se move da esquerda para a direita ao passar o mouse ou focar.
- Tema claro/escuro, responsividade, navegação por teclado e respeito a `prefers-reduced-motion`.

**Importante:** as demonstrações são implementações **locais em JavaScript**. Elas **não executam** Rust ou Python, não fazem chamadas a serviços externos, não consultam a SEFAZ e não validam assinaturas de NF-e. São protótipos educativos, não serviços fiscais oficiais.

## Executar no Pop!_OS / Linux

1. Extraia o ZIP e abra um terminal dentro da pasta `new_portifolio`.
2. Execute:

```bash
python3 -m http.server 8000
```

3. Abra `http://localhost:8000`.
4. Encerre com `Ctrl + C`.

O site pode funcionar diretamente ao abrir `index.html`, mas usar um servidor local facilita testes e publicação.

## Estrutura

```text
new_portifolio/
├── index.html
├── css/
│   ├── style.css          # CSS original
│   └── components.css     # Novos componentes, responsividade e modais
├── js/
│   ├── projects.js        # Projetos, experimentos e catálogo de demos
│   ├── demos.js           # Implementações locais dos 3 playgrounds
│   └── main.js            # Renderização, filtros, modais, tema e navegação
└── assets/                # Imagens e favicon originais
```

## Personalizar

| Alteração | Arquivo |
|---|---|
| Textos e seções | `index.html` |
| Cores e CSS existente | `css/style.css` |
| Cards, modais, botões, Laboratório e marquee | `css/components.css` |
| Adicionar/editar projetos | `js/projects.js` (`window.portfolioProjects`) |
| Cadastrar demonstrações | `js/projects.js` (`window.portfolioDemos`) |
| Implementar lógica das demonstrações | `js/demos.js` |
| Filtros, tema, modais e navegação | `js/main.js` |

### Adicionar um projeto

Crie um objeto em `window.portfolioProjects` com os campos `id` (único), `title`, `category`, `categoryLabel`, `year`, `status`, `description`, `tags`, `visual`, `mark`, `problem`, `solution`, `challenge` e `link` (opcional). Para associar uma demonstração, use `demoId` com o mesmo `id` de `window.portfolioDemos`.

Categorias disponíveis: `sistemas`, `dados`, `pesquisa`, `linux`.

### Publicar

O projeto pode ser publicado no GitHub Pages ou em outro serviço de hospedagem estática. A pasta raiz contém o `index.html`. **Build: nenhum.** Não inclua chaves privadas, credenciais ou dados empresariais reais no repositório.

## Créditos de referência

- **Direção editorial:** [kenjilambert.com](https://kenjilambert.com/), referência visual.
- **Padrões de componentes:** [21st.dev](https://21st.dev/), referência para cards, bento, diálogos, tabs e marquee.

Os novos componentes foram **reescritos em CSS e JavaScript puro**, sem copiar os pacotes React/TypeScript/Tailwind do 21st.dev. Os arquivos de imagem e a identidade de base foram preservados do ZIP enviado pelo usuário.
