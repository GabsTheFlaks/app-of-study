# Análise Crítica e de Vulnerabilidades: `server.ts`

Esta análise considera um cenário onde o código será levado para **produção**. O arquivo atual possui diversas falhas graves de segurança, arquitetura e más práticas que precisam ser corrigidas antes de qualquer deploy real.

## 1. Vulnerabilidades de Segurança Perigosas

*   **Segredo JWT Estático (Hardcoded):** A linha `const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';` usa um segredo padrão `'fallback-secret'` caso a variável de ambiente não esteja configurada. Se isso for para produção e a variável não for setada, qualquer pessoa pode forjar (falsificar) tokens JWT e se passar por qualquer usuário do sistema e obter controle da aplicação.
*   **Armazenamento em Memória (Falso Banco de Dados):** Os arrays `users` e `courses` armazenam tudo na memória RAM da aplicação. Se o servidor reiniciar, **todos os dados são perdidos**. Além disso, não há proteção contra ataques de negação de serviço (DoS). Se alguém criar um script para fazer milhões de cadastros, a memória RAM do servidor irá estourar rapidamente, derrubando o sistema.
*   **Falta de Validação e Sanitização de Entrada:** A rota de registro (`/api/auth/register`) não valida os campos (não verifica tamanho da senha, formato do e-mail, etc.). Isso deixa portas abertas para ataques e, no futuro, caso conecte um banco de dados, para injeções (SQL Injection/NoSQL Injection).
*   **Ausência de Tratamento de Erros (`try...catch`):** Rotas como `/api/auth/register` e `/api/auth/login` executam operações assíncronas do `bcrypt` e não utilizam blocos `try...catch`. Caso o servidor enfrente um erro na geração do hash, o Node.js pode travar a requisição, e a falta de tratamento global de exceções pode até mesmo derrubar (crash) o servidor Express.
*   **Configuração de Cookies Insegura:** O cookie `access_token` é criado com `secure: false`. Em ambiente de produção rodando com HTTPS, essa flag `secure` deve ser **obrigatoriamente `true`**, senão o token trafegará exposto e pode ser roubado em ataques do tipo Man-In-The-Middle.
*   **Falta de Rate Limiting (Limite de Requisições):** A ausência de limite nas rotas de login facilita incrivelmente ataques de "Força Bruta" (Brute Force), em que um atacante tenta milhares de senhas até acertar a de um usuário administrador.

## 2. Falhas de Arquitetura e Más Práticas de Código

*   **Uso Excessivo do tipo `any` (TypeScript):** O uso de `req: any`, `res: any`, `next: any` no middleware `authenticateToken` joga fora a utilidade do TypeScript. O correto é usar os tipos exportados pelo express: `Request`, `Response`, `NextFunction`.
*   **Falta de Tipagem de Entidades:** Os arrays de `users` e `courses` não têm uma `interface` TypeScript os descrevendo, o que prejudica a legibilidade e a inteligência da IDE.
*   **Acoplamento Extremo (Monolito Bagunçado):** O arquivo `server.ts` tem muitas responsabilidades misturadas num só lugar: Rotas de API, Middlewares, Falso Banco de Dados, lógica de Autenticação, integração com Inteligência Artificial e servidor de Frontend (Vite). A prática correta é separar isso em pastas: `controllers`, `routes`, `middlewares`, `services` e `models`.

---

## 3. Desvinculação do Google AI Studio (Remover Gemini)

Para não precisar mais da `GEMINI_API_KEY` e desvincular seu projeto do Google AI Studio, você deve modificar seu código removendo a dependência. Como solicitado, **eu não alterei seu código**, mas aqui está o passo a passo exato do que você deve fazer:

1. **Remova a importação:**
   No topo do arquivo `server.ts`, exclua a linha:
   `import { GoogleGenerativeAI } from '@google/generative-ai';`

2. **Remova a instância da IA:**
   Ainda no `server.ts`, exclua a linha que inicializa a API:
   `const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;`

3. **Delete ou substitua a Rota da IA:**
   Remova todo esse bloco de código do `server.ts` que gerencia a rota de resumo:
   ```typescript
   app.post('/api/ai/summarize', authenticateToken, async (req, res) => {
     if (!genAI) return res.status(503).json({ message: 'AI Service unavailable' });
     const { text } = req.body;
     try {
       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
       const prompt = `Resuma o seguinte texto educacional de forma concisa e em português: \n\n${text}`;
       const result = await model.generateContent(prompt);
       const response = await result.response;
       res.json({ summary: response.text() });
     } catch (error) {
       res.status(500).json({ message: 'AI error' });
     }
   });
   ```

4. **Remova as bibliotecas do pacote:**
   Abra seu terminal na pasta do projeto e rode o comando para remover os pacotes instalados:
   `npm uninstall @google/genai @google/generative-ai`

---

## 4. Como Rodar o Código Localmente (Windows)

**Pré-requisitos:** Ter o **Node.js** instalado (se não tiver, baixe a versão LTS em nodejs.org).

Abra um terminal (Prompt de Comando, PowerShell ou dentro do próprio VS Code) e siga os passos:

1. **Navegue até a pasta do projeto:**
   Seu terminal precisa estar dentro da pasta `edumind-independent-study`.
   `cd caminho\onde\esta\a\pasta\edumind-independent-study`

2. **Instale as dependências do projeto:**
   Execute o seguinte comando para baixar o que está listado no `package.json`:
   `npm install`

3. **Configuração da Variável de Ambiente:**
   - Crie um arquivo com o nome exato `.env` na raiz da pasta `edumind-independent-study`.
   - Coloque o seguinte conteúdo nele:
     `JWT_SECRET=minha_senha_super_secreta_e_longa_para_o_jwt_123`
   - *(Nota: se você seguir o passo "3" desta documentação e desvincular do Gemini, não precisará colocar a GEMINI_API_KEY neste arquivo).*

4. **Inicie o servidor:**
   Execute o comando de desenvolvimento:
   `npm run dev`

5. **Acesse no Navegador:**
   O terminal avisará que o servidor está rodando. Abra seu Chrome/Edge e acesse:
   `http://localhost:3000`