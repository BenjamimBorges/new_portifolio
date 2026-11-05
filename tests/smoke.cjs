/* Testes de regressão sem dependências externas. Executar: node tests/smoke.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {}, Blob });
for (const file of ['js/projects.js', 'js/demos.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const { parseCSV, analyzeCSV, simulateWebhook } = context.window.portfolioDemoUtils;
const { portfolioProjects: projects, portfolioDemos: demos } = context.window;

const csv = parseCSV('nome;observacao\n"Ana; Maria";"Linha 1\nLinha 2"\nJoão;"texto com ""aspas"""');
assert.equal(csv.delimiter, ';');
assert.equal(csv.rows.length, 3);
assert.equal(csv.rows[1][0], 'Ana; Maria');
assert.equal(csv.rows[1][1], 'Linha 1\nLinha 2');
assert.equal(csv.rows[2][1], 'texto com "aspas"');

const report = analyzeCSV('id;nome;valor\n1;Ana;10\n2;;\n2;;');
assert.equal(report.linhas, 3);
assert.equal(report.colunas, 3);
assert.equal(report.vazios, 4);
assert.equal(report.duplicatas, 1);
assert.equal(report.completude, 55.6);
assert.equal(report.colunasDetalhe[1].vazios, 2);
assert.throws(() => parseCSV('nome\n"sem fim'), /aspas não fechadas/);
assert.throws(() => analyzeCSV(''), /Cole dados/);

const recovery = simulateWebhook('{"event":"teste"}', 'recovery');
assert.equal(recovery.status, 'Entregue');
assert.equal(recovery.tentativas.length, 3);
assert.equal(recovery.tentativas[2].codigo, 200);
assert.equal(recovery.tentativas[2].atrasoSegundos, 2);
assert.equal(simulateWebhook('{"event":"teste"}', '400').tentativas.length, 1);
assert.equal(simulateWebhook('{"event":"teste"}', '500').status, 'Não entregue');
assert.throws(() => simulateWebhook('{invalid}', '200'), /JSON inválido/);
assert.throws(() => simulateWebhook('[]', '200'), /objeto JSON/);

const ids = new Set(projects.map(project => project.id));
assert.equal(ids.size, projects.length, 'IDs de projetos devem ser únicos');
const demoIds = new Set(demos.map(demo => demo.id));
assert.equal(demoIds.size, demos.length, 'IDs de demos devem ser únicos');
for (const project of projects) {
  assert(project.architecture.length >= 3, `Fluxo técnico ausente: ${project.id}`);
  if (project.demoId) assert(demoIds.has(project.demoId), `Demo não encontrada: ${project.demoId}`);
}
for (const demo of demos) {
  assert(context.window.portfolioDemoRunners[demo.id], `Runner ausente: ${demo.id}`);
  assert(projects.some(project => project.demoId === demo.id), `Projeto relacionado ausente: ${demo.id}`);
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const id of ['project-dialog', 'demo-dialog', 'demo-related-project', 'demo-back-project', 'demo-grid']) {
  assert(html.includes(`id="${id}"`), `Elemento ausente: ${id}`);
}
for (const src of ['js/projects.js', 'js/demos.js', 'js/main.js', 'css/style.css', 'css/components.css']) {
  assert(fs.existsSync(path.join(root, src)), `Arquivo ausente: ${src}`);
}
console.log(`OK — ${projects.length} projetos, ${demos.length} demonstrações; CSV, webhook e estrutura verificados.`);
