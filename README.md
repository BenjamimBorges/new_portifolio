# Portfólio — Benjamim Borges

Portfólio estático, feito em **HTML, CSS e JavaScript **, com identidade editorial.

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

## Personalizar

| Alteração                                    | Arquivo                                       |
| -------------------------------------------- | --------------------------------------------- |
| Textos e seções                              | `index.html`                                  |
| Cores e CSS existente                        | `css/style.css`                               |
| Cards, modais, botões, Laboratório e marquee | `css/components.css`                          |
| Adicionar/editar projetos                    | `js/projects.js` (`window.portfolioProjects`) |
| Cadastrar demonstrações                      | `js/projects.js` (`window.portfolioDemos`)    |
| Implementar lógica das demonstrações         | `js/demos.js`                                 |
| Filtros, tema, modais e navegação            | `js/main.js`                                  |

### Adicionar um projeto

Crie um objeto em `window.portfolioProjects` com os campos `id` (único), `title`, `category`, `categoryLabel`, `year`, `status`, `description`, `tags`, `visual`, `mark`, `problem`, `solution`, `challenge` e `link` (opcional). Para associar uma demonstração, use `demoId` com o mesmo `id` de `window.portfolioDemos`.

Categorias disponíveis: `sistemas`, `dados`, `pesquisa`, `linux`.

### Publicar

O projeto pode ser publicado no GitHub Pages ou em outro serviço de hospedagem estática. A pasta raiz contém o `index.html`. **Build: nenhum.** Não inclua chaves privadas, credenciais ou dados empresariais reais no repositório.
