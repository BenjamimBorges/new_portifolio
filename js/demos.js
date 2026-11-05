/* Laboratório: demonstrações locais, sem frameworks e sem chamadas a APIs externas.
 * Não representa execução de Rust ou Python. Todos os arquivos ficam no navegador.
 */
window.portfolioDemoRunners = (() => {
  "use strict";

  const NF_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe"><NFe><infNFe versao="4.00">
<ide><nNF>12345</nNF><serie>1</serie><dhEmi>2026-10-20T10:30:00-03:00</dhEmi><natOp>Venda de mercadoria</natOp></ide>
<emit><CNPJ>00000000000191</CNPJ><xNome>EMPRESA DEMONSTRAÇÃO LTDA</xNome></emit>
<dest><CNPJ>11111111000191</CNPJ><xNome>CLIENTE FICTÍCIO LTDA</xNome></dest>
<det nItem="1"><prod><cProd>001</cProd><xProd>Produto exemplo A</xProd><NCM>84713012</NCM><CFOP>5102</CFOP><qCom>2</qCom><vProd>150.00</vProd></prod></det>
<det nItem="2"><prod><cProd>002</cProd><xProd>Produto exemplo B</xProd><NCM>39269090</NCM><CFOP>5102</CFOP><qCom>1</qCom><vProd>80.00</vProd></prod></det>
<total><ICMSTot><vNF>230.00</vNF></ICMSTot></total>
</infNFe></NFe></nfeProc>`;

  const CSV_SAMPLE = `id;produto;categoria;preco\n1;Teclado;Periféricos;120\n2;Mouse;Periféricos;80\n3;Monitor;Vídeo;\n3;Monitor;Vídeo;\n4;Cabo;Acessórios;25\n5;;Acessórios;19`;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function field(label, value) {
    return `<div class="demo-stat"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value === null || value === undefined || value === "" ? "—" : value)}</strong></div>`;
  }

  function nfeExplorer(host) {
    host.innerHTML = `
      <div class="demo-input-layout">
        <div class="demo-controls">
          <label class="demo-label" for="nfe-input">XML da NF-e</label>
          <textarea class="demo-textarea" id="nfe-input" spellcheck="false" placeholder="Cole aqui um XML de NF-e ou utilize a amostra..."></textarea>
          <div class="demo-control-actions">
            <button class="demo-button demo-button-primary" type="button" id="nfe-analyze">Analisar XML <span aria-hidden="true">↗</span></button>
            <button class="demo-button" type="button" id="nfe-sample">Carregar exemplo</button>
            <label class="demo-button demo-upload">Escolher XML <input id="nfe-file" type="file" accept=".xml,text/xml,application/xml" aria-label="Escolher arquivo XML"></label>
          </div>
          <p class="demo-small">Amostra sintética. Arquivos locais de até 1 MB. Sem envio de dados.</p>
        </div>
        <div class="demo-results" id="nfe-results" aria-live="polite"><p class="demo-placeholder">Carregue o exemplo e clique em Analisar XML para visualizar os campos.</p></div>
      </div>`;
    const input = host.querySelector("#nfe-input");
    const result = host.querySelector("#nfe-results");
    host.querySelector("#nfe-sample").addEventListener("click", () => { input.value = NF_SAMPLE; input.focus(); });
    host.querySelector("#nfe-file").addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 1024 * 1024) { result.textContent = "Arquivo acima do limite de 1 MB."; return; }
      input.value = await file.text();
      result.textContent = "Arquivo carregado localmente. Clique em Analisar XML.";
    });
    host.querySelector("#nfe-analyze").addEventListener("click", () => {
      const xml = input.value.trim();
      if (!xml) { result.textContent = "Informe um XML ou carregue o exemplo."; return; }
      if (xml.length > 1024 * 1024) { result.textContent = "XML acima do limite de 1 MB."; return; }
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      if (doc.getElementsByTagName("parsererror").length) { result.textContent = "XML inválido: verifique a sintaxe do documento."; return; }
      const descendants = (node, tag) => node ? [...node.getElementsByTagName("*")].filter(el => el.localName === tag) : [];
      const first = (node, tag) => descendants(node, tag)[0] || null;
      const value = (node, tag) => first(node, tag)?.textContent?.trim() || "";
      const root = first(doc, "infNFe");
      if (!root) { result.textContent = "XML válido, mas não foi encontrada a estrutura infNFe de uma NF-e."; return; }
      const emit = first(root, "emit");
      const dest = first(root, "dest");
      const ide = first(root, "ide");
      const items = descendants(root, "det");
      const total = first(root, "ICMSTot");
      const money = value(total, "vNF");
      result.innerHTML = `
        <p class="demo-results-kicker">RESULTADO / LEITURA ESTRUTURAL</p>
        <div class="demo-stats">${field("Nota", value(ide, "nNF"))}${field("Série", value(ide, "serie"))}${field("Itens", items.length)}${field("Valor da NF-e", money && Number.isFinite(Number(money)) ? "R$ " + Number(money).toLocaleString("pt-BR", {minimumFractionDigits:2, maximumFractionDigits:2}) : "—")}</div>
        <div class="demo-result-section"><h3>Emitente</h3><p>${escapeHTML(value(emit,"xNome") || "Não informado")}</p><small>${escapeHTML(value(emit,"CNPJ") || value(emit,"CPF"))}</small></div>
        <div class="demo-result-section"><h3>Destinatário</h3><p>${escapeHTML(value(dest,"xNome") || "Não informado")}</p><small>${escapeHTML(value(dest,"CNPJ") || value(dest,"CPF"))}</small></div>
        <div class="demo-result-section"><h3>Itens (${items.length})</h3><div class="demo-table-scroll"><table class="demo-table"><thead><tr><th>Produto</th><th>NCM</th><th>CFOP</th><th>Valor</th></tr></thead><tbody>${items.slice(0, 50).map(det => {const prod=first(det,"prod");return `<tr><td>${escapeHTML(value(prod,"xProd"))}</td><td>${escapeHTML(value(prod,"NCM"))}</td><td>${escapeHTML(value(prod,"CFOP"))}</td><td>${escapeHTML(value(prod,"vProd"))}</td></tr>`;}).join("")}</tbody></table></div>${items.length > 50 ? '<small>Exibindo os primeiros 50 itens.</small>' : ''}</div>
        <p class="demo-small">Esta leitura não substitui validação XSD, assinatura digital ou autorização da SEFAZ.</p>`;
    });
  }

  function webhookSimulator(host) {
    host.innerHTML = `
      <div class="demo-input-layout">
        <div class="demo-controls">
          <label class="demo-label" for="webhook-json">Evento JSON</label>
          <textarea class="demo-textarea" id="webhook-json" spellcheck="false">{\n  "event": "pedido.criado",\n  "data": { "id": 1042, "total": 199.90 }\n}</textarea>
          <div class="demo-control-actions">
            <label class="demo-select-wrap" for="webhook-status">Resposta simulada
              <select id="webhook-status" class="demo-select"><option value="200">200 OK</option><option value="400">400 Bad Request</option><option value="500">500 Internal Server Error</option><option value="503">503 Service Unavailable</option></select>
            </label>
            <button class="demo-button demo-button-primary" type="button" id="webhook-run">Simular envio ↗</button>
          </div>
          <p class="demo-small">Simulador educativo. Não faz requisições de rede.</p>
        </div>
        <div class="demo-results" id="webhook-results" aria-live="polite"><p class="demo-placeholder">Execute uma simulação para visualizar o histórico de tentativas.</p></div>
      </div>`;
    const output = host.querySelector("#webhook-results");
    host.querySelector("#webhook-run").addEventListener("click", () => {
      let parsed;
      try { parsed = JSON.parse(host.querySelector("#webhook-json").value); }
      catch (e) { output.textContent = "JSON inválido: revise as aspas, vírgulas e chaves."; return; }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) { output.textContent = "O evento deve ser um objeto JSON."; return; }
      const code = Number(host.querySelector("#webhook-status").value);
      const attempts = code >= 500 ? 3 : 1;
      const status = code < 300 ? "Entregue" : code >= 500 ? "Falha após tentativas" : "Rejeitado";
      const entries = Array.from({length: attempts}, (_,i) => ({n:i+1, code, note: i===0 ? "Envio inicial" : `Retry ${i} (intervalo ilustrativo)`}));
      output.innerHTML = `
        <p class="demo-results-kicker">RESULTADO / SIMULAÇÃO LOCAL</p>
        <div class="demo-stats">${field("Evento", parsed.event || "Personalizado")}${field("HTTP", code)}${field("Tentativas", attempts)}${field("Estado", status)}</div>
        <div class="demo-result-section"><h3>Histórico de entregas</h3><ol class="demo-log">${entries.map(e => `<li><span>Tentativa ${e.n}</span><strong class="${code < 300 ? "log-success" : "log-error"}">HTTP ${e.code}</strong><small>${escapeHTML(e.note)}</small></li>`).join("")}</ol></div>
        <p class="demo-small">Na integração real, o backend gerenciaria autenticação, fila, idempotência e intervalos de retry.</p>`;
    });
  }

  function guessDelimiter(csv) {
    const line = csv.split(/\r?\n/,1)[0] || "";
    const counts = {";":0, ",":0, "\t":0};
    let quoted = false;
    for (let i=0;i<line.length;i++) {
      if (line[i] === '"') { if (quoted && line[i+1] === '"') i++; else quoted=!quoted; }
      else if (!quoted && Object.hasOwn(counts, line[i])) counts[line[i]]++;
    }
    return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
  }

  function parseCSV(text) {
    const delimiter = guessDelimiter(text);
    const rows = []; let row = [], cell = "", quoted = false;
    for (let i=0; i<text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        if (quoted && text[i+1] === '"') { cell+='"'; i++; }
        else if (quoted) quoted = false;
        else if (cell === "") quoted = true;
        else cell += ch;
      } else if (ch === delimiter && !quoted) { row.push(cell); cell=""; }
      else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && text[i+1] === "\n") i++;
        row.push(cell); if (row.some(v=>v!=="")) rows.push(row);
        row=[]; cell="";
      } else cell += ch;
      if (rows.length > 5001) throw new Error("Limite de 5.000 linhas ultrapassado.");
    }
    if (quoted) throw new Error("CSV inválido: aspas não fechadas.");
    row.push(cell); if (row.some(v=>v!=="")) rows.push(row);
    return rows;
  }

  function dataCheck(host) {
    host.innerHTML = `
      <div class="demo-input-layout">
        <div class="demo-controls">
          <label class="demo-label" for="csv-input">Dados CSV</label>
          <textarea class="demo-textarea" id="csv-input" spellcheck="false" placeholder="Cole dados CSV ou carregue um arquivo..."></textarea>
          <div class="demo-control-actions">
            <button class="demo-button demo-button-primary" type="button" id="csv-analyze">Analisar dados ↗</button>
            <button class="demo-button" type="button" id="csv-sample">Carregar exemplo</button>
            <label class="demo-button demo-upload">Escolher CSV <input id="csv-file" type="file" accept=".csv,text/csv,text/plain" aria-label="Escolher arquivo CSV"></label>
          </div>
          <p class="demo-small">Até 1 MB e 5.000 linhas. CSV com vírgula, ponto e vírgula ou tabulação.</p>
        </div>
        <div class="demo-results" id="csv-results" aria-live="polite"><p class="demo-placeholder">Use o exemplo para ver indicadores de qualidade de dados.</p></div>
      </div>`;
    const input = host.querySelector("#csv-input");
    const output = host.querySelector("#csv-results");
    host.querySelector("#csv-sample").addEventListener("click", () => { input.value = CSV_SAMPLE; input.focus(); });
    host.querySelector("#csv-file").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 1024*1024) { output.textContent="Arquivo acima do limite de 1 MB."; return; }
      input.value = await file.text();
      output.textContent = "Arquivo carregado localmente. Clique em Analisar dados.";
    });
    host.querySelector("#csv-analyze").addEventListener("click", () => {
      const raw = input.value.replace(/^\uFEFF/, "");
      if (!raw.trim()) { output.textContent = "Informe dados CSV ou carregue o exemplo."; return; }
      if (raw.length > 1024*1024) { output.textContent = "Conteúdo acima do limite de 1 MB."; return; }
      let rows;
      try { rows = parseCSV(raw); } catch (e) { output.textContent = e.message; return; }
      if (rows.length < 2) { output.textContent = "Inclua uma linha de cabeçalho e pelo menos uma linha de dados."; return; }
      const headers = rows[0];
      const data = rows.slice(1);
      const missing = data.reduce((n,row) => n + headers.reduce((m,_,i)=>m + (String(row[i] ?? "").trim()==="" ? 1 : 0),0),0);
      const keys = new Set(); let duplicates = 0;
      for (const row of data) {
        const key = JSON.stringify(headers.map((_,i)=>String(row[i] ?? "").trim()));
        if (keys.has(key)) duplicates++; else keys.add(key);
      }
      const uneven = data.filter(row=>row.length!==headers.length).length;
      output.innerHTML = `
        <p class="demo-results-kicker">RESULTADO / QUALIDADE DOS DADOS</p>
        <div class="demo-stats">${field("Linhas", data.length)}${field("Colunas", headers.length)}${field("Células vazias", missing)}${field("Duplicatas", duplicates)}</div>
        ${uneven ? `<p class="demo-warning">Atenção: ${uneven} linha(s) com número de colunas diferente do cabeçalho.</p>` : ''}
        <div class="demo-result-section"><h3>Prévia dos dados</h3><div class="demo-table-scroll"><table class="demo-table"><thead><tr>${headers.slice(0,8).map(h=>`<th>${escapeHTML(h)}</th>`).join("")}</tr></thead><tbody>${data.slice(0,6).map(row=>`<tr>${headers.slice(0,8).map((_,i)=>`<td>${escapeHTML(row[i] || "—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
        <p class="demo-small">Duplicatas consideram todas as colunas, após remover espaços nas extremidades. Este relatório é exploratório.</p>`;
    });
  }

  return {
    "nfe-explorer": nfeExplorer,
    "webhook-simulator": webhookSimulator,
    "data-check": dataCheck
  };
})();
