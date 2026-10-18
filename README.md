# Warframe Discord Bot

![Node.js](https://img.shields.io/badge/Node.js-JavaScript-339933?logo=node.js&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)
![Warframe](https://img.shields.io/badge/Warframe-Drop%20Search-0B7285)

Bot para **Discord** desenvolvido com **Node.js** e **discord.js**, com foco em consultar informações de drops de itens do **Warframe** diretamente pelo chat. O projeto utiliza a API pública [WarframeStat](https://api.warframestat.us) para buscar itens e apresentar seus dados em mensagens incorporadas (*embeds*).

## Funcionalidades

- Busca de drops de itens de Warframe, incluindo local, raridade e chance de obtenção.
- Respostas formatadas em *embeds* do Discord.
- Comandos de utilidade para verificar a resposta do bot e consultar informações do servidor e do usuário.
- Registro de *slash commands* em um servidor de desenvolvimento ou globalmente, para produção.
- Organização do código em comandos, eventos, serviços e utilitários.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `/searchdrop input:<item>` | Pesquisa drops de um item e exibe o primeiro resultado retornado pela API, com localização, raridade e chance. |
| `/ping` | Verifica se o bot responde, retornando `Pong!`. |
| `/server` | Exibe o nome do servidor e a quantidade de membros. |
| `/user` | Exibe o nome de usuário e a data de entrada no servidor. |

**Exemplo de uso:** `/searchdrop input:forma`

> O exemplo serve para ilustrar a sintaxe. O resultado depende dos itens aceitos e disponibilizados pela API externa.

## Tecnologias

- **Node.js** — execução da aplicação JavaScript.
- **discord.js 14** — integração com a API do Discord e suporte a *slash commands*.
- **Axios** — requisições HTTP para a API WarframeStat.
- **dotenv** — carregamento de variáveis de ambiente.
- **Yarn** — gerenciador de dependências utilizado pelo arquivo `yarn.lock`.

## Pré-requisitos

- Node.js compatível com o discord.js 14 utilizado pelo projeto (recomenda-se uma versão LTS atual).
- Yarn instalado, ou npm como alternativa.
- Aplicativo e bot criados no [Discord Developer Portal](https://discord.com/developers/applications).
- Permissão para adicionar o bot ao servidor de teste.
- Conexão com a internet para consultar a API WarframeStat.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/LuizMartinez6/warframe-discordbot.git
cd warframe-discordbot
```

Instale as dependências:

```bash
yarn install
```

Alternativamente, utilize `npm install`.

### Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com os seguintes valores:

```dotenv
BOT_TOKEN=seu_token_do_bot
APP_ID=id_da_aplicacao_discord
DISCORD_SERVER_ID=id_do_servidor_de_desenvolvimento
```

| Variável | Utilização |
| --- | --- |
| `BOT_TOKEN` | Token de autenticação do bot no Discord. |
| `APP_ID` | ID da aplicação, usado no registro dos comandos. |
| `DISCORD_SERVER_ID` | ID do servidor em que os comandos serão registrados durante o desenvolvimento. |

No Discord Developer Portal, obtenha o token na seção **Bot** e o Application ID em **General Information**. Para obter o ID do servidor, ative o Modo Desenvolvedor do Discord e use a opção de copiar o ID do servidor.

> **Segurança:** nunca publique o token em commits, capturas de tela ou logs. O `.env` já está listado no `.gitignore` do projeto. Se um token for exposto, regenere-o no Developer Portal.

### Adicionar o bot ao servidor

No Discord Developer Portal, configure a instalação do aplicativo com os escopos `bot` e `applications.commands`. Conceda somente as permissões necessárias para os comandos, incluindo visualizar o canal, enviar mensagens e incorporar links (*embeds*).

## Execução

**1. Registre os comandos** no servidor de desenvolvimento:

```bash
yarn deploy:dev
```

Para registrar os comandos globalmente, use:

```bash
yarn deploy:prd
```

O registro global pode levar algum tempo para ser propagado pelo Discord. Os dois comandos utilizam a configuração do `.env`; o registro em desenvolvimento também exige `DISCORD_SERVER_ID`.

**2. Inicie o bot:**

```bash
yarn start
```

Se preferir npm, os scripts equivalentes são `npm run deploy:dev`, `npm run deploy:prd` e `npm start`.

Ao iniciar com sucesso, o terminal deverá exibir uma mensagem semelhante a:

```text
Ready! Logged in as NomeDoBot#0000
```

## Estrutura do projeto

```text
warframe-discordbot/
├── commands/
│   └── utility/
│       ├── ping.js
│       ├── search.js
│       ├── server.js
│       └── user.js
├── events/
│   ├── interactionCreate.js
│   └── interactionReady.js
├── services/
│   └── axiosConfig.js
├── utils/
│   └── embedBuilder.js
├── deploy-commands-dev.js
├── deploy-commands-prd.js
├── index.js
├── package.json
├── Procfile
└── README.md
```

| Arquivo ou diretório | Responsabilidade |
| --- | --- |
| `index.js` | Inicializa o cliente Discord e carrega automaticamente comandos e eventos. |
| `commands/utility/` | Implementações dos *slash commands*. |
| `events/` | Recebimento das interações e evento de inicialização do bot. |
| `services/axiosConfig.js` | Configura a URL-base `https://api.warframestat.us` para as requisições. |
| `utils/embedBuilder.js` | Formata os dados do drop em um embed do Discord. |
| `deploy-commands-dev.js` | Publica comandos no servidor de desenvolvimento. |
| `deploy-commands-prd.js` | Publica comandos globalmente. |

## Como funciona a busca de drops

Quando o usuário executa `/searchdrop` com um nome de item, o comando faz uma requisição GET para:

```text
https://api.warframestat.us/drops/search/<item>
```

O código extrai do primeiro resultado retornado os campos `place`, `item`, `rarity` e `chance`, e os envia ao canal em um embed.

**Limitações conhecidas da implementação atual:**

- O comando exibe somente o primeiro item retornado pela API.
- A resposta é enviada diretamente ao canal, sem confirmar a interação com `reply()` ou `deferReply()` em caso de sucesso; por isso, o Discord pode indicar que o comando falhou mesmo quando a mensagem é publicada.
- A verificação de resultado vazio está aplicada ao objeto de resposta do Axios (`response.length`), não a `response.data`. Uma busca sem resultados pode causar erro em vez de apresentar a mensagem esperada.
- A opção `input` não é marcada como obrigatória no construtor do comando.

Esses pontos descrevem o código atual e são candidatos a melhorias futuras.

## Próximos passos

- Tratar corretamente buscas sem resultados e falhas de rede.
- Confirmar ou adiar as interações de *slash commands* antes de enviar a resposta.
- Permitir consultar vários resultados com paginação.
- Validar a entrada fornecida pelo usuário.
- Adicionar testes automatizados para comandos e tratamento de erros.
- Documentar configurações de hospedagem e observabilidade.

## Autor

Desenvolvido por [LuizMartinez6](https://github.com/LuizMartinez6).

## Créditos

Os dados de Warframe são consultados por meio da [API WarframeStat](https://api.warframestat.us). Warframe e suas marcas pertencem aos respectivos titulares.

## Licença

O repositório não contém um arquivo de licença identificado nesta revisão. Consulte o autor antes de redistribuir ou reutilizar o código em outros projetos.
