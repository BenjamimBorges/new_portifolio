# O que mudou nesta versão

A versão anterior era uma aplicação construída com React, TypeScript, TanStack Start/Router, Vite e Tailwind CSS. Esta versão foi reconstruída para que a manutenção não dependa de React nem de TypeScript.

## Estrutura nova

```text
portfolio-javascript-puro/
├── index.html
├── README.md
├── MIGRACAO-REACT-PARA-VANILLA.md
├── assets/
│   ├── favicon.svg
│   ├── profile.jpg
│   └── imagens originais dos projetos
├── css/
│   └── style.css
└── js/
    ├── main.js
    └── projects.js
```

## O que foi preservado

- Foto de perfil enviada no projeto original.
- Identidade e conteúdo principal da apresentação.
- Links dos repositórios que já estavam definidos no projeto original.
- Seções de projetos, sobre, formação e contato.

## O que foi reorganizado

- Visual editorial com tipografia, espaçamento e paleta mais discretos.
- Layout responsivo para celular, tablet e desktop.
- Alternância entre tema claro e escuro.
- Filtros por categoria e busca de projetos.
- Projetos recentes de fiscal, NF-e, BI, ERP e Linux.
- Seção de laboratório para projetos menores.
- Conteúdo dos projetos separado do comportamento do site, facilitando edição.

## Limite importante

O Lovable gera e mantém aplicações com uma estrutura própria de desenvolvimento. Como a decisão foi usar JavaScript sem frameworks, esta versão deixa de depender do editor do Lovable. Ela pode ser mantida no VS Code e publicada em hospedagem estática.
