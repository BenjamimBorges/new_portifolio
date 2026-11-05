/*
 * Conteúdo do portfólio.
 * Para adicionar um projeto, copie um objeto e edite os campos.
 * categories aceitas: sistemas, dados, pesquisa, linux.
 * Use link: "" quando o repositório ainda não for público.
 */

window.portfolioProjects = [
  {
    id: "balancete-fiscal",
    demoId: "nfe-explorer",
    title: "Balancete Fiscal",
    problem: "Organizar documentos fiscais XML de diferentes empresas de maneira consistente e rastreável.",
    solution: "Importação de XML, organização dos dados por empresa e preparação de relatórios de conferência.",
    challenge: "Interpretar XML de NF-e com cuidado e manter origem e transformações dos dados documentadas.",
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
    id: "anomalias-nfe",
    title: "Detecção de anomalias em NF-e",
    problem: "Identificar registros fiscais atípicos sem confundir anomalias estatísticas com fraude comprovada.",
    solution: "Combinação experimental de regras fiscais com modelos de aprendizagem automática, com avaliação dos alertas.",
    challenge: "Construir critérios de avaliação sem assumir que existam dados rotulados de fraude.",
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
    id: "sales-performance-bi",
    title: "Sales Performance BI",
    problem: "Transformar vendas, metas e atendimentos em indicadores úteis para acompanhamento.",
    solution: "Modelagem de dados e indicadores de vendas e metas, com medidas DAX e visualizações.",
    challenge: "Garantir consistência dos indicadores e proteger dados empresariais em qualquer publicação.",
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
    id: "nina-erp",
    title: "Nina ERP",
    problem: "Organizar processos e informações de gestão empresarial em um sistema evolutivo.",
    solution: "Módulos de gestão, departamentos e serviços organizados para expansão gradual.",
    challenge: "Separar responsabilidades da aplicação e preparar persistência e serviços.",
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
    id: "impasto-cosmic",
    title: "Impasto COSMIC",
    problem: "Personalizar a experiência do desktop COSMIC com informações úteis e comportamento consistente.",
    solution: "Componentes QML com Quickshell e ajustes de interface no ambiente Linux.",
    challenge: "Integrar componentes à área de trabalho sem prejudicar janelas ou interação.",
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
    id: "network-anomaly-detector",
    title: "Network Anomaly Detector",
    problem: "Explorar como identificar desvios em métricas de tráfego de rede com aprendizado não supervisionado.",
    solution: "Extração de características de tráfego e aplicação de Isolation Forest para pontuação de anomalias.",
    challenge: "Escolher características relevantes e reduzir falsos alertas durante os testes.",
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
  },
  {
    id: "webhook-simulator",
    demoId: "webhook-simulator",
    title: "Webhook Simulator",
    problem: "Entender como sistemas integrados lidam com eventos, erros HTTP e tentativas de entrega.",
    solution: "Um playground local para editar JSON e visualizar respostas HTTP e retries simulados.",
    challenge: "Representar claramente o comportamento de entrega sem sugerir que houve requisição de rede real.",
    category: "sistemas",
    categoryLabel: "Experimento interativo",
    year: "2026",
    status: "Protótipo demonstrável",
    description: "Ferramenta educativa para experimentar eventos JSON, códigos HTTP e lógica de novas tentativas. Executada inteiramente no navegador.",
    tags: ["JavaScript", "JSON", "HTTP", "Simulação"],
    visual: "network",
    mark: "API",
    link: "",
    linkLabel: "Experimentar no Laboratório"
  },
  {
    id: "data-check",
    demoId: "data-check",
    title: "DataCheck Playground",
    problem: "Encontrar rapidamente problemas básicos de qualidade em conjuntos de dados tabulares.",
    solution: "Uma interface local que analisa CSV e resume campos vazios, duplicatas e diferenças de estrutura.",
    challenge: "Lidar com delimitadores e campos entre aspas, sem enviar dados pessoais a um servidor.",
    category: "dados",
    categoryLabel: "Experimento interativo",
    year: "2026",
    status: "Protótipo demonstrável",
    description: "Analisador exploratório de CSV com indicadores de qualidade de dados e prévia de registros. Protótipo em JavaScript puro, sem backend Python.",
    tags: ["JavaScript", "CSV", "Qualidade de dados"],
    visual: "bi",
    mark: "CSV",
    link: "",
    linkLabel: "Experimentar no Laboratório"
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


// Cada demonstração é implementada uma única vez e acessível do Laboratório
// e dos projetos que apontam para demoId.
window.portfolioDemos = [
  {
    id: "nfe-explorer",
    title: "NF-e Explorer",
    category: "XML · Fiscal",
    description: "Explore uma NF-e XML de exemplo ou carregue um arquivo local. Visualize emitente, destinatário, itens e valores.",
    notice: "Leitura local de XML no navegador. Não consulta SEFAZ, não valida assinatura digital e não executa o backend Rust.",
    how: "O navegador lê o XML com DOMParser, extrai campos comuns da NF-e e apresenta um resumo estrutural. Os arquivos não são enviados a servidores.",
    mark: "XML",
    tone: "fiscal"
  },
  {
    id: "webhook-simulator",
    title: "Webhook Simulator",
    category: "API · JavaScript",
    description: "Monte um evento JSON e simule respostas HTTP, falhas e tentativas de reenvio.",
    notice: "Simulação local: nenhuma requisição HTTP real é enviada.",
    how: "Um objeto JSON é validado no navegador. O simulador constrói uma sequência de tentativas e respostas, para ilustrar tratamento de falhas e retries.",
    mark: "API",
    tone: "network"
  },
  {
    id: "data-check",
    title: "DataCheck Playground",
    category: "Dados · CSV",
    description: "Analise um CSV de exemplo ou um arquivo local para identificar lacunas e linhas duplicadas.",
    notice: "Análise local em JavaScript. Não executa Python nem envia os dados a servidores.",
    how: "Um parser CSV reconhece delimitadores comuns e campos entre aspas. O navegador calcula quantidade de linhas, colunas, células vazias e duplicatas.",
    mark: "CSV",
    tone: "bi"
  }
];
