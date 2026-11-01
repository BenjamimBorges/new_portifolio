/*
 * Conteúdo do portfólio.
 * Para adicionar um projeto, copie um objeto e edite os campos.
 * categories aceitas: sistemas, dados, pesquisa, linux.
 * Use link: "" quando o repositório ainda não for público.
 */

window.portfolioProjects = [
  {
    title: "Balancete Fiscal",
    category: "sistemas",
    categoryLabel: "Sistema fiscal",
    year: "2026",
    status: "Em desenvolvimento",
    description: "Aplicação para importar, organizar e conferir XML de NF-e de múltiplas empresas, preparando os dados para análise fiscal e relatórios. O foco é manter regras e resultados rastreáveis.",
    tags: ["Rust", "XML / NF-e", "Excel", "TOML"],
    visual: "fiscal",
    mark: "BF",
    link: "",
    linkLabel: "Projeto em desenvolvimento"
  },
  {
    title: "Detecção de anomalias em NF-e",
    category: "pesquisa",
    categoryLabel: "Pesquisa aplicada",
    year: "2026",
    status: "Pesquisa em andamento",
    description: "Pesquisa de uma abordagem híbrida que combina regras fiscais e aprendizagem de máquina para sinalizar notas fiscais atípicas. Anomalia é um alerta para análise, não uma prova de fraude.",
    tags: ["Python", "Scikit-learn", "XML / NF-e", "Machine Learning"],
    visual: "research",
    mark: "ML",
    link: "",
    linkLabel: "Pesquisa em andamento"
  },
  {
    title: "Sales Performance BI",
    category: "dados",
    categoryLabel: "Business Intelligence",
    year: "2026",
    status: "Em desenvolvimento",
    description: "Dashboard de acompanhamento de vendas, metas e rendimento diário por vendedor, com medidas DAX e modelagem de dados. Informações empresariais são mantidas privadas e devem ser anonimizadas em demonstrações.",
    tags: ["Power BI", "DAX", "Excel", "Modelagem"],
    visual: "bi",
    mark: "BI",
    link: "",
    linkLabel: "Estudo aplicado"
  },
  {
    title: "Nina ERP",
    category: "sistemas",
    categoryLabel: "Sistema de gestão",
    year: "2025 — 2026",
    status: "Em desenvolvimento",
    description: "Sistema de gestão empresarial com foco em processos internos, controle de acesso, departamentos e organização de informações. Arquitetura preparada para evoluir de um cenário local para uso conectado.",
    tags: ["C#", ".NET 8", "Docker", "Banco de dados"],
    visual: "erp",
    mark: "ERP",
    link: "https://github.com/BenjamimBorges/nina_erp",
    linkLabel: "Ver repositório"
  },
  {
    title: "Impasto COSMIC",
    category: "linux",
    categoryLabel: "Linux / Desktop",
    year: "2026",
    status: "Projeto pessoal",
    description: "Personalização do ambiente Linux com componentes de desktop, integração de informações do sistema e ajustes de experiência visual no COSMIC / Quickshell.",
    tags: ["Pop!_OS", "COSMIC", "Quickshell", "QML"],
    visual: "linux",
    mark: "OS",
    link: "",
    linkLabel: "Projeto pessoal"
  },
  {
    title: "Network Anomaly Detector",
    category: "pesquisa",
    categoryLabel: "Experimento",
    year: "2025",
    status: "Protótipo experimental",
    description: "Experimento de monitoramento de tráfego de rede e identificação de padrões fora do comportamento esperado usando aprendizado não supervisionado.",
    tags: ["Python", "Scapy", "Isolation Forest", "Análise de dados"],
    visual: "network",
    mark: "NET",
    link: "",
    linkLabel: "Protótipo experimental"
  }
];

window.portfolioLab = [
  {
    title: "BinFBin",
    description: "Conversor entre valores binários e caracteres com base na tabela ASCII.",
    tags: "JavaScript · ASCII",
    link: "https://github.com/BenjamimBorges/BinFBin"
  },
  {
    title: "BBbot",
    description: "Chatbot experimental em Python com processamento de linguagem natural.",
    tags: "Python · NLTK · NLP",
    link: "https://github.com/BenjamimBorges/BBbot"
  },
  {
    title: "ServerTCP / ServerUDP",
    description: "Implementações acadêmicas de clientes e servidores para comunicação em rede.",
    tags: "Java · Sockets · TCP / UDP",
    link: "https://github.com/BenjamimBorges/ServerTCP_ClientTCP"
  },
  {
    title: "NFS Report",
    description: "Relatório prático sobre compartilhamento de arquivos entre máquinas Linux usando NFS.",
    tags: "Linux · NFS · Sistemas operacionais",
    link: "https://github.com/BenjamimBorges/NFS_Report"
  },
  {
    title: "Password Generator",
    description: "Gerador de senhas em linha de comando com diferentes conjuntos de caracteres.",
    tags: "Python · CLI",
    link: "https://github.com/BenjamimBorges/Password_Generator"
  }
];
