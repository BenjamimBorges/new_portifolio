# Portfólio — Benjamim Borges

Versão estática do portfólio, reconstruída com **HTML, CSS e JavaScript puro**.

## Tecnologias

- HTML5 semântico
- CSS3 responsivo (sem framework)
- JavaScript moderno (ES6+, sem framework)
- Nenhuma dependência de npm, Node.js, React, TypeScript ou etapa de build

## Executar localmente no Pop!_OS / Linux

1. Extraia o ZIP.
2. Abra um terminal dentro da pasta `portfolio-javascript-puro`.
3. Execute:

```bash
python3 -m http.server 8000
```

4. Abra `http://localhost:8000` no navegador.
5. Para encerrar o servidor, pressione `Ctrl + C` no terminal.

> O servidor local é recomendado porque o JavaScript usa módulos/arquivos separados. Não é necessário instalar pacotes.

## Onde editar

| O que você quer alterar | Arquivo |
|---|---|
| Textos, títulos, seções e navegação | `index.html` |
| Cores, fontes, espaçamentos e responsividade | `css/style.css` |
| Projetos em destaque e filtros | `js/projects.js` |
| Menu, tema, busca, filtros e animações | `js/main.js` |
| Foto de perfil | `assets/profile.jpg` |
| Ícone da aba | `assets/favicon.svg` |

### Adicionar um projeto

Abra `js/projects.js` e acrescente um objeto dentro de `window.portfolioProjects`.

Campos usados: `title`, `category`, `categoryLabel`, `year`, `status`, `description`, `tags`, `visual`, `mark`, `link` e `linkLabel`.

Categorias disponíveis: `sistemas`, `dados`, `pesquisa` e `linux`. Se o projeto ainda não tiver um repositório público, deixe `link: ""` e use `linkLabel` para indicar o estado.

## Publicar

O site é estático e pode ser publicado diretamente em serviços como GitHub Pages ou Cloudflare Pages.

- **Diretório de publicação:** raiz do projeto (`/`)
- **Comando de build:** nenhum
- **Dependências:** nenhuma

## Sobre a migração

Esta versão substitui a estrutura anterior baseada em React, TypeScript, TanStack e Vite por arquivos que podem ser lidos e editados diretamente. Ela não precisa ser aberta no editor do Lovable para funcionar; o fluxo recomendado é editar os arquivos com VS Code e publicar como site estático.

## Observações

- Os links de GitHub foram mantidos somente nos projetos que já tinham repositórios indicados no portfólio anterior.
- Projetos em andamento aparecem sem link público.
- Não há formulário de contato falso: os botões levam aos perfis públicos de LinkedIn e GitHub.
- O tema claro/escuro fica salvo no navegador quando o armazenamento local está disponível.
