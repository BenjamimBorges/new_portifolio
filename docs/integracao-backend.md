# Integração futura de APIs reais (proposta, não implementada)

O portfólio **não depende de APIs** para funcionar. Os playgrounds atuais são locais e devem continuar disponíveis como modo de demonstração, mesmo que algum backend esteja fora do ar.

## Organização sugerida

| Demonstração | Serviço futuro | Endpoint sugerido |
|---|---|---|
| NF-e Explorer | Rust + Axum | `POST /api/v1/nfe/analyze` |
| Webhook Simulator | Node.js | `POST /api/v1/webhooks/simulate` |
| DataCheck | Python + FastAPI | `POST /api/v1/data/quality` |

Esses caminhos são **contratos planejados**, não URLs existentes. Não configurar os botões do site para chamá-los antes de implementar e testar os serviços.

### NF-e Explorer

- Entrada: XML em `multipart/form-data` com limite de tamanho e de tempo.
- Saída: JSON contendo número, série, emitente/destinatário anonimizados quando necessário, itens, totais e alertas estruturais.
- O serviço deve explicitar se executa validação XSD, assinatura, regras fiscais ou apenas leitura. Não declarar autorização da SEFAZ sem consulta oficial.
- Para a demonstração pública, preferir XML sintético. Se permitir upload real, garantir exclusão após o processamento, sem logs do conteúdo.

### Webhook Simulator

- Entrada: JSON sintético e política de tentativas.
- Saída: log de tentativas com códigos HTTP, estado e intervalos.
- **Não aceitar URLs arbitrárias de destino enviadas pelo visitante**: isso evitará abuso do serviço como proxy ou SSRF.
- Manter destinos em lista de permissões, autenticação entre serviços, limites de requisição e idempotência.

### DataCheck

- Entrada: CSV com limite de bytes, linhas e colunas.
- Saída: métricas agregadas, completude, campos vazios, duplicatas e avisos; evitar retornar linhas originais desnecessariamente.
- Executar parsing com limite de memória e CPU; não armazenar dados pessoais enviados pelos visitantes.

## Infraestrutura e segurança

- Hospedar o frontend estático separadamente dos serviços.
- Usar HTTPS, CORS restrito à origem do portfólio, rate limiting, timeouts e logs sem conteúdo sensível.
- Nunca embutir tokens ou senhas no JavaScript público.
- Exibir na interface se o resultado foi produzido pelo **navegador** ou pela **API real**.
- Manter amostras sintéticas e oferecer fallback local se as APIs não estiverem disponíveis.
