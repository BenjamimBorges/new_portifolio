/* Laboratório — protótipos locais em JavaScript puro.
 * Nenhum arquivo é enviado ao servidor. Não executa Rust/Python nem valida NF-e oficialmente.
 */
window.portfolioDemoRunners = (() => {
  "use strict";

  const MAX_BYTES = 1024 * 1024;
  const NF_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe"><NFe><infNFe versao="4.00">
<ide><nNF>12345</nNF><serie>1</serie><dhEmi>2026-10-20T10:30:00-03:00</dhEmi><natOp>Venda de mercadoria</natOp></ide>
<emit><CNPJ>00000000000191</CNPJ><xNome>EMPRESA DEMONSTRAÇÃO LTDA</xNome></emit>
<dest><CNPJ>11111111000191</CNPJ><xNome>CLIENTE FICTÍCIO LTDA</xNome></dest>
<det nItem="1"><prod><cProd>001</cProd><xProd>Produto exemplo A</xProd><NCM>84713012</NCM><CFOP>5102</CFOP><qCom>2</qCom><vProd>150.00</vProd></prod><imposto><ICMS><ICMS00><CST>00</CST></ICMS00></ICMS></imposto></det>
<det nItem="2"><prod><cProd>002</cProd><xProd>Produto exemplo B</xProd><NCM>39269090</NCM><CFOP>5102</CFOP><qCom>1</qCom><vProd>80.00</vProd></prod></det>
<total><ICMSTot><vNF>230.00</vNF></ICMSTot></total>
</infNFe></NFe></nfeProc>`;

  const CSV_SAMPLE = `id;produto;categoria;preco\n1;Teclado;Periféricos;120\n2;Mouse;Periféricos;80\n3;Monitor;Vídeo;\n3;Monitor;Vídeo;\n4;Cabo;Acessórios;25\n5;;Acessórios;19`;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const formatMoney = (value) => value !== "" && Number.isFinite(Number(value))
    ? Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—";

  const field = (label, value) => `<div class="demo-stat"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value === null || value === undefined || value === "" ? "—" : value)}</strong></div>`;

  function statusMessage(host, message, kind = "neutral") {
    host.innerHTML = `<p class="demo-message demo-message-${kind}" role="status">${escapeHTML(message)}</p>`;
  }

  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function bindLocalFile(host, inputSelector, result, target, label) {
    host.querySelector(inputSelector).addEventListener("change", async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_BYTES) {
        statusMessage(result, `O arquivo ultrapassa 1 MB. Escolha outro ${label}.`, "error");
        event.target.value = "";
        return;
      }
      try {
        target.value = await file.text();
        statusMessage(result, `${file.name} carregado localmente. Clique em Analisar para continuar.`, "success");
      } catch (_) {
        statusMessage(result, "Não foi possível ler este arquivo.", "error");
      }
      event.target.value = "";
    });
  }

  function children(node, name) {
    return node ? Array.from(node.children).filter(child => child.localName === name) : [];
  }
  const child = (node, name) => children(node, name)[0] || null;
  const deep = (node, name) => node ? Array.from(node.getElementsByTagName("*")).find(el => el.localName === name) || null : null;
  const value = (node, name) => child(node, name)?.textContent?.trim() || "";

  function parseNFe(xml) {
    if (!xml.trim()) throw new Error("Cole um XML ou carregue a amostra.");
    if (new Blob([xml]).size > MAX_BYTES) throw new Error("O XML ultrapassa 1 MB.");
    if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) throw new Error("Por segurança, documentos com DTD/ENTITY não são aceitos.");
    const documentXML = new DOMParser().parseFromString(xml, "application/xml");
    if (Array.from(documentXML.getElementsByTagName("*")).some(el => el.localName === "parsererror")) {
      throw new Error("XML malformado. Verifique as tags e os caracteres especiais.");
    }
    const infNFe = deep(documentXML, "infNFe");
    if (!infNFe) throw new Error("O documento não contém o elemento infNFe de uma NF-e.");
    const ide = child(infNFe, "ide");
    const emit = child(infNFe, "emit");
    const dest = child(infNFe, "dest");
    const total = child(infNFe, "total");
    const icmsTotal = child(total, "ICMSTot");
    const ibsCbsTotal = child(total, "IBSCBSTot");
    const items = children(infNFe, "det").map(det => {
      const prod = child(det, "prod");
      const imposto = child(det, "imposto");
      const icms = child(imposto, "ICMS");
      return {
        produto: value(prod, "xProd"), ncm: value(prod, "NCM"), cfop: value(prod, "CFOP"),
        cst: deep(icms, "CST")?.textContent?.trim() || deep(icms, "CSOSN")?.textContent?.trim() || "",
        valor: value(prod, "vProd")
      };
    });
    const warnings = [];
    if (!value(ide, "nNF")) warnings.push("Número da NF-e não encontrado.");
    if (!value(emit, "xNome")) warnings.push("Nome do emitente não encontrado.");
    if (!value(dest, "xNome")) warnings.push("Nome do destinatário não encontrado.");
    if (!items.length) warnings.push("Nenhum item det foi encontrado.");
    if (!value(icmsTotal, "vNF")) warnings.push("Total vNF não encontrado.");
    return {
      numero: value(ide, "nNF"), serie: value(ide, "serie"), emissao: value(ide, "dhEmi") || value(ide, "dEmi"),
      versao: infNFe.getAttribute("versao") || "",
      emitente: { nome: value(emit, "xNome"), documento: value(emit, "CNPJ") || value(emit, "CPF") },
      destinatario: { nome: value(dest, "xNome"), documento: value(dest, "CNPJ") || value(dest, "CPF") },
      valorNota: value(icmsTotal, "vNF"),
      // Campos facultativos de leitura exploratória, sem validação do leiaute da reforma tributária.
      ibs: deep(ibsCbsTotal, "vIBS")?.textContent?.trim() || "",
      cbs: deep(ibsCbsTotal, "vCBS")?.textContent?.trim() || "",
      itens: items, avisos: warnings
    };
  }

  function nfeExplorer(host) {
    host.innerHTML = `
      <div class="demo-input-layout">
        <div class="demo-controls">
          <div class="demo-panel-title"><span class="demo-step">01 / ENTRADA</span><strong>Documento XML</strong></div>
          <label class="demo-label" for="nfe-input">XML da NF-e</label>
          <textarea class="demo-textarea" id="nfe-input" spellcheck="false" placeholder="Cole um XML de NF-e ou carregue uma amostra sintética..."></textarea>
          <div class="demo-control-actions">
            <button class="demo-button demo-button-primary" type="button" id="nfe-analyze">Analisar XML ↗</button>
            <button class="demo-button" type="button" id="nfe-sample">Usar exemplo</button>
            <label class="demo-button demo-upload">Importar .xml <input id="nfe-file" type="file" accept=".xml,text/xml,application/xml" aria-label="Escolher arquivo XML"></label>
          </div>
          <p class="demo-small">Até 1 MB · processamento local · sem consulta à SEFAZ.</p>
        </div>
        <div class="demo-results" id="nfe-results" aria-live="polite"><div class="demo-panel-title"><span class="demo-step">02 / RESULTADO</span><strong>Leitura estrutural</strong></div><p class="demo-placeholder">Use a amostra para visualizar emitente, destinatário, produtos e tributos presentes.</p></div>
      </div>`;
    const input = host.querySelector("#nfe-input");
    const result = host.querySelector("#nfe-results");
    host.querySelector("#nfe-sample").addEventListener("click", () => { input.value = NF_SAMPLE; input.focus(); });
    bindLocalFile(host, "#nfe-file", result, input, "XML");
    host.querySelector("#nfe-analyze").addEventListener("click", () => {
      let summary;
      try { summary = parseNFe(input.value.replace(/^\uFEFF/, "")); }
      catch (error) { statusMessage(result, error.message, "error"); return; }
      result.innerHTML = `
        <div class="demo-panel-title"><span class="demo-step">02 / RESULTADO</span><strong>Leitura estrutural</strong></div>
        <div class="demo-stats">${field("Número", summary.numero)}${field("Série", summary.serie)}${field("Itens", summary.itens.length)}${field("Total da NF-e", formatMoney(summary.valorNota))}</div>
        <div class="demo-result-section"><h3>Emitente</h3><p>${escapeHTML(summary.emitente.nome || "Não informado")}</p><small>${escapeHTML(summary.emitente.documento)}</small></div>
        <div class="demo-result-section"><h3>Destinatário</h3><p>${escapeHTML(summary.destinatario.nome || "Não informado")}</p><small>${escapeHTML(summary.destinatario.documento)}</small></div>
        ${summary.ibs || summary.cbs ? `<div class="demo-result-section"><h3>Campos IBS / CBS encontrados</h3><div class="demo-stats">${field("IBS (vIBS)", formatMoney(summary.ibs))}${field("CBS (vCBS)", formatMoney(summary.cbs))}</div><p class="demo-small">Somente leitura dos valores presentes no XML; não valida cálculo nem enquadramento tributário.</p></div>` : ""}
        <div class="demo-result-section"><h3>Itens (${summary.itens.length})</h3><div class="demo-table-scroll"><table class="demo-table"><thead><tr><th>Produto</th><th>NCM</th><th>CFOP</th><th>CST / CSOSN</th><th>Valor</th></tr></thead><tbody>${summary.itens.slice(0, 50).map(item => `<tr><td>${escapeHTML(item.produto)}</td><td>${escapeHTML(item.ncm)}</td><td>${escapeHTML(item.cfop)}</td><td>${escapeHTML(item.cst || "—")}</td><td>${escapeHTML(formatMoney(item.valor))}</td></tr>`).join("")}</tbody></table></div>${summary.itens.length > 50 ? '<small>Exibindo os primeiros 50 itens.</small>' : ''}</div>
        ${summary.avisos.length ? `<div class="demo-alert"><strong>Campos não encontrados</strong><ul>${summary.avisos.map(w => `<li>${escapeHTML(w)}</li>`).join("")}</ul></div>` : '<p class="demo-positive">Campos estruturais básicos encontrados.</p>'}
        <button type="button" class="demo-button demo-export" id="nfe-export">Exportar resumo JSON ↓</button>
        <p class="demo-small">Não valida XSD, assinatura digital, autorização da SEFAZ nem conformidade fiscal.</p>`;
      result.querySelector("#nfe-export").addEventListener("click", () => downloadJSON("resumo-nfe-demo.json", summary));
    });
  }

  const WEBHOOK_SCENARIOS = {
    "200": [200], "400": [400], "429": [429, 429, 429],
    "500": [500, 500, 500], "503": [503, 503, 503],
    "recovery": [503, 503, 200], "rate-limit": [429, 200]
  };
  const RETRYABLE = new Set([429, 500, 502, 503, 504]);
  function simulateWebhook(json, scenario) {
    if (new Blob([json]).size > 32768) throw new Error("O evento deve ter até 32 KB.");
    let payload;
    try { payload = JSON.parse(json); } catch (_) { throw new Error("JSON inválido: verifique chaves, vírgulas e aspas."); }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("O evento precisa ser um objeto JSON.");
    const sequence = WEBHOOK_SCENARIOS[scenario] || WEBHOOK_SCENARIOS["200"];
    const attempts = [];
    for (const code of sequence) {
      const index = attempts.length;
      attempts.push({ tentativa: index + 1, codigo: code, atrasoSegundos: index ? 2 ** (index - 1) : 0 });
      if (code >= 200 && code < 300 || !RETRYABLE.has(code)) break;
    }
    const finalCode = attempts.at(-1).codigo;
    return {
      evento: typeof payload.event === "string" ? payload.event : "Personalizado",
      tentativas: attempts, status: finalCode >= 200 && finalCode < 300 ? "Entregue" : "Não entregue",
      finalCode, payload
    };
  }

  function webhookSimulator(host) {
    host.innerHTML = `
      <div class="demo-input-layout">
        <div class="demo-controls">
          <div class="demo-panel-title"><span class="demo-step">01 / ENTRADA</span><strong>Evento HTTP</strong></div>
          <label class="demo-label" for="webhook-json">Corpo JSON do evento</label>
          <textarea class="demo-textarea" id="webhook-json" spellcheck="false">{\n  "event": "pedido.criado",\n  "data": { "id": 1042, "total": 199.90 }\n}</textarea>
          <div class="demo-control-actions">
            <label class="demo-select-wrap" for="webhook-status">Cenário de resposta
              <select id="webhook-status" class="demo-select">
                <option value="200">200 · Sucesso imediato</option>
                <option value="400">400 · Erro permanente</option>
                <option value="429">429 · Limite de requisições</option>
                <option value="500">500 · Falha persistente</option>
                <option value="503">503 · Serviço indisponível</option>
                <option value="recovery" selected>503 → 503 → 200 · Recuperação</option>
                <option value="rate-limit">429 → 200 · Recuperação</option>
              </select>
            </label>
            <button class="demo-button demo-button-primary" type="button" id="webhook-run">Simular entrega ↗</button>
          </div>
          <p class="demo-small">Até 32 KB · sem rede · política de retry ilustrativa.</p>
        </div>
        <div class="demo-results" id="webhook-results" aria-live="polite"><div class="demo-panel-title"><span class="demo-step">02 / RESULTADO</span><strong>Histórico simulado</strong></div><p class="demo-placeholder">Escolha um cenário e execute para acompanhar as tentativas de entrega.</p></div>
      </div>`;
    const output = host.querySelector("#webhook-results");
    host.querySelector("#webhook-run").addEventListener("click", () => {
      let result;
      try { result = simulateWebhook(host.querySelector("#webhook-json").value, host.querySelector("#webhook-status").value); }
      catch (error) { statusMessage(output, error.message, "error"); return; }
      output.innerHTML = `
        <div class="demo-panel-title"><span class="demo-step">02 / RESULTADO</span><strong>Histórico simulado</strong></div>
        <div class="demo-stats">${field("Evento", result.evento)}${field("Resposta final", `HTTP ${result.finalCode}`)}${field("Tentativas", result.tentativas.length)}${field("Resultado", result.status)}</div>
        <div class="demo-result-section"><h3>Sequência de entregas</h3><ol class="demo-log">${result.tentativas.map(entry => `<li><span>Tentativa ${entry.tentativa}</span><strong class="${entry.codigo >= 200 && entry.codigo < 300 ? "log-success" : "log-error"}">HTTP ${entry.codigo}</strong><small>${entry.atrasoSegundos ? `Atraso ilustrativo antes da tentativa: ${entry.atrasoSegundos}s` : "Envio inicial"}</small></li>`).join("")}</ol></div>
        <div class="demo-alert demo-alert-muted"><strong>Como interpretar</strong><p>2xx encerra com sucesso. 400 não é repetido. 429 e 5xx podem gerar novas tentativas. Não há requisição, fila, espera real ou persistência.</p></div>
        <button type="button" class="demo-button demo-export" id="webhook-export">Exportar log JSON ↓</button>`;
      output.querySelector("#webhook-export").addEventListener("click", () => downloadJSON("webhook-simulacao.json", {
        evento: result.evento, status: result.status, tentativas: result.tentativas, modo: "simulacao-local"
      }));
    });
  }

  function guessDelimiter(csv) {
    const line = csv.split(/\r?\n/, 1)[0] || "";
    const counts = { ";": 0, ",": 0, "\t": 0 };
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { if (quoted && line[i + 1] === '"') i++; else quoted = !quoted; }
      else if (!quoted && Object.prototype.hasOwnProperty.call(counts, line[i])) counts[line[i]]++;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  function parseCSV(text) {
    const delimiter = guessDelimiter(text);
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
        else if (quoted) quoted = false;
        else if (cell === "") quoted = true;
        else cell += ch;
      } else if (ch === delimiter && !quoted) { row.push(cell); cell = ""; }
      else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cell);
        if (row.some(v => v !== "")) rows.push(row);
        row = []; cell = "";
      } else cell += ch;
      if (rows.length > 5000) throw new Error("Limite de 5.000 linhas ultrapassado.");
    }
    if (quoted) throw new Error("CSV inválido: aspas não fechadas.");
    row.push(cell);
    if (row.some(v => v !== "")) rows.push(row);
    return { delimiter, rows };
  }

  function analyzeCSV(raw) {
    if (!raw.trim()) throw new Error("Cole dados CSV ou carregue a amostra.");
    if (new Blob([raw]).size > MAX_BYTES) throw new Error("O CSV ultrapassa 1 MB.");
    const { delimiter, rows } = parseCSV(raw.replace(/^\uFEFF/, ""));
    if (rows.length < 2) throw new Error("Inclua cabeçalho e pelo menos uma linha de dados.");
    const headers = rows[0];
    if (headers.length > 100) throw new Error("Limite de 100 colunas ultrapassado.");
    const data = rows.slice(1);
    const columns = headers.map((name, index) => ({
      nome: name.trim() || `Coluna ${index + 1} (sem nome)`,
      vazios: data.filter(row => String(row[index] ?? "").trim() === "").length
    }));
    const keys = new Set();
    let duplicates = 0;
    for (const row of data) {
      const key = JSON.stringify(headers.map((_, i) => String(row[i] ?? "").trim()));
      if (keys.has(key)) duplicates++; else keys.add(key);
    }
    const missing = columns.reduce((sum, col) => sum + col.vazios, 0);
    const cells = data.length * headers.length;
    const uneven = data.filter(row => row.length !== headers.length).length;
    const names = headers.map(h => h.trim().toLowerCase());
    const duplicateHeaders = names.filter((name, i) => name && names.indexOf(name) !== i).length;
    return {
      linhas: data.length, colunas: headers.length, vazios: missing, duplicatas: duplicates,
      incompletas: uneven, cabecalhosRepetidos: duplicateHeaders,
      completude: cells ? Number(((cells - missing) / cells * 100).toFixed(1)) : 0,
      delimitador: delimiter === "\t" ? "tabulação" : delimiter,
      colunasDetalhe: columns, cabecalho: headers, previa: data.slice(0, 6)
    };
  }

  function dataCheck(host) {
    host.innerHTML = `
      <div class="demo-input-layout">
        <div class="demo-controls">
          <div class="demo-panel-title"><span class="demo-step">01 / ENTRADA</span><strong>Dados tabulares</strong></div>
          <label class="demo-label" for="csv-input">CSV de entrada</label>
          <textarea class="demo-textarea" id="csv-input" spellcheck="false" placeholder="Cole CSV ou carregue um arquivo..."></textarea>
          <div class="demo-control-actions">
            <button class="demo-button demo-button-primary" type="button" id="csv-analyze">Analisar dados ↗</button>
            <button class="demo-button" type="button" id="csv-sample">Usar exemplo</button>
            <label class="demo-button demo-upload">Importar .csv <input id="csv-file" type="file" accept=".csv,text/csv,text/plain" aria-label="Escolher arquivo CSV"></label>
          </div>
          <p class="demo-small">Até 1 MB · 5.000 linhas · separadores: vírgula, ponto e vírgula ou tabulação.</p>
        </div>
        <div class="demo-results" id="csv-results" aria-live="polite"><div class="demo-panel-title"><span class="demo-step">02 / RESULTADO</span><strong>Qualidade dos dados</strong></div><p class="demo-placeholder">Experimente a amostra para visualizar completude, duplicatas e lacunas por coluna.</p></div>
      </div>`;
    const input = host.querySelector("#csv-input");
    const output = host.querySelector("#csv-results");
    host.querySelector("#csv-sample").addEventListener("click", () => { input.value = CSV_SAMPLE; input.focus(); });
    bindLocalFile(host, "#csv-file", output, input, "CSV");
    host.querySelector("#csv-analyze").addEventListener("click", () => {
      let report;
      try { report = analyzeCSV(input.value); }
      catch (error) { statusMessage(output, error.message, "error"); return; }
      output.innerHTML = `
        <div class="demo-panel-title"><span class="demo-step">02 / RESULTADO</span><strong>Qualidade dos dados</strong></div>
        <div class="demo-stats">${field("Linhas", report.linhas)}${field("Colunas", report.colunas)}${field("Células vazias", report.vazios)}${field("Linhas duplicadas", report.duplicatas)}</div>
        <div class="demo-completeness"><div><span>COMPLETUDE</span><strong>${escapeHTML(report.completude)}%</strong></div><div class="demo-meter" role="img" aria-label="Completude ${escapeHTML(report.completude)} por cento"><span style="width:${report.completude}%"></span></div></div>
        ${report.incompletas || report.cabecalhosRepetidos ? `<p class="demo-warning">${report.incompletas ? `${report.incompletas} linha(s) com largura diferente do cabeçalho. ` : ""}${report.cabecalhosRepetidos ? `${report.cabecalhosRepetidos} nome(s) de coluna repetidos.` : ""}</p>` : ""}
        <div class="demo-result-section"><h3>Campos incompletos</h3><div class="demo-column-list">${report.colunasDetalhe.slice(0, 16).map(col => `<div><span>${escapeHTML(col.nome)}</span><strong>${col.vazios} / ${report.linhas}</strong></div>`).join("")}</div>${report.colunasDetalhe.length > 16 ? '<small>Exibindo as primeiras 16 colunas.</small>' : ''}</div>
        <div class="demo-result-section"><h3>Prévia dos dados</h3><div class="demo-table-scroll"><table class="demo-table"><thead><tr>${report.cabecalho.slice(0, 8).map(h => `<th>${escapeHTML(h)}</th>`).join("")}</tr></thead><tbody>${report.previa.map(row => `<tr>${report.cabecalho.slice(0, 8).map((_, i) => `<td>${escapeHTML(row[i] || "—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
        <button type="button" class="demo-button demo-export" id="csv-export">Exportar relatório JSON ↓</button>
        <p class="demo-small">Duplicatas consideram todas as colunas após remover espaços nas extremidades. O relatório exportado contém apenas métricas, não linhas originais.</p>`;
      output.querySelector("#csv-export").addEventListener("click", () => {
        const { cabecalho, previa, ...metrics } = report;
        downloadJSON("data-check-relatorio.json", { ...metrics, modo: "analise-local" });
      });
    });
  }

  // Funções puras disponíveis para testes de regressão, sem dependências externas.
  window.portfolioDemoUtils = { parseCSV, analyzeCSV, simulateWebhook, parseNFe };
  return { "nfe-explorer": nfeExplorer, "webhook-simulator": webhookSimulator, "data-check": dataCheck };
})();
