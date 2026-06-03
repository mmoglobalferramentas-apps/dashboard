###

* [ ] Adicionar "marcado" na tabela de funnel_events, para conseguirmos capturar o mercado de um funil.

* [ ] Listar métricas principais do funil, que devem ser listadas no frontend.

* [ ] Listar melhores práticas de otimização realizad pelo mercado para serem exibidas quando alguma métrica estiver abaixo do definido do escopo de saúde.

### Briefing Dashboard
Processo: Escrever as ideias de forma solta. Condensá-las em um documento, expandir com pesquisa, finalizar a tomada de decisão.

### Job To DO

TO DO:

* [ ] Planejar O Frontend ( Wireframe, componentes, assets ). O Thema, Tipgrafia e Logo já foram definidos.

1. À princípio, haverão 3 telas, uma contendo os dados gerais do funil, com um filtro de funnel_id + country. ( Existirá mais de um funil, para mais de um país ), dados como passagem de páginas / etapas do funil ( principal ), quantidade de ICs, Vendas, etc. 

Outra, contendo uma tabela com a lista de leads que entraram no funil, com filtragem por data, funnel_id, lead_id, country, contato, e eventos realizados ( como compra ou IC ), uma marcação clara para leads que realizaram IC / compra.

A feature deverá ser uma checkbox para marcar se quer filtrar por X, se a checkbox for marcada, surge uma input box para definir o valor que quer filtrar, isso é excessão para filtros de ( country, funnel_id e data, que deverão ser populados em uma select box com base nos dados pré-disponíveis ).

Então, será possível selecionar um lead, o que irá exibir uma tela contendo o detalhamento geral de todos os seus dados.

* [ ] Planejar as regras de negócio e features.

1. A leitura dos dados deverão acontecer por uma viewer, contendo os dados mais atualizados de funil / leads. Para isso, podemos modelar a viewer pré-existente do dashboard 2.0, do projeto elevate.

* [ ] Planejar o Backend do Projeto. 

--> Leitura de Tabelas.

--> Dados exibidos no frontend. Os dados exibidos no frontend deverão ser dados relacionados aos eventos e aos dados de leads. Dados de eventos serão principais para mapear a passagem do funil ( Passagem de página / etapas ). A passagem de páginas / etapas se deve principalmente à presseis e quizes.

Além disso, deve haver um local onde será possível vizualizar métricas gerais dos funis filtrados. Como vendas, ICS totais, ICs não convertidos, taxa de conversão do checkout, e outras métricas chave.

---

* [ ] Tecnologia.

A tecnologia usada para lidar com o frontend será a mesta será a mesma da página de vendas inicial. Ou seja, NEXT.JS para compilar react, com a finalizade de ter páginas otimizadas para o usuáiro final, afinal, o next é ressponsável por fazer com que a página renderize no servidor, antes de chegar ao usuário final, além de conter tecnologias que otimizam imagem e códigos, deixando o código final infinitamente MAIS otimizado. 

Outra tecnologia que iremos utilizar para o frontend é a tecnologia de Radix UI, Framer Motion e Tailwind CSS. Radix UI será para capturar a lógica de componentes, o tawilind nos permitrá ter uma estilização entre páginas otimizadas, evitando problemas de código morto e CSS perdido. Por fim, o framer-motion será responsável pela delegação da lógica de animação de elementos da página.

Uma das principais animações que queremos ter é a animação de surgimento dos ícones, realizada na página de vendas inicial, sendo que sua estratégia consiste em 4 simples pilares:

Pilar 01: Zerar a opacidade do elemento em seu surgimento.

Pilar 02: Deslocar negativamente o y do componente em seu surgimento.

Pilar 03: Ao componente surgir na viewport, ele deve ser realocado em sua posição original e voltar para a sua opacidade correta. O que gera o efeito final de "fade-up".

Pilar 04: Fazer com que isso só aconteça uma vez, para garantir com que "scrollar" a página de cima para baixo não faça os componentes ficarem re-spawnando, apenas por saírem da viewport inicial.


Por fim, para importar os componentes, iremos utilizar o MCP do shadcn, que já contém componentes prontos e validados, além de utilizarmos o mesmo tema, logo e tipografia definidos no projeto original.

O ponto chave do frontend será garantir que ele terá uma aparência que *não remeta* à nenhum de seus concorrentes ( facebook, redtrack e utmfy ), para isso, precisamos garantir que: os wireframes componentes não tenham uma aparencia igual às imagens de referência:

Ref 1:

Ref 2: 

Ref 3:

Ref 4:
 

Além disso, dentro do nosso wireframe, iremos querer conter espaço para adicionar imagens, ( seja de fundo ), ou seja em componentes específicos, para dar o "design visual premium" e diferênciado da aplicação.

Agora, partindo para STACK tecnológica do backend.

Aqui é simples. Nós iremos ter uma API que le dados do nosso SUPABASE, que já está construído e já foi mapeado no projeto /tdi-latam ( é o projeto do funil inicial, onde foi construído o banco de dados e o primeiro funil que recebeu o código de captura de telemetria do funil ).

Para isso, preciamos gerar viewers que consomem duas tebals já existentes funnel_leads e funnel_events e então, fazer o frontend consumir estes eventos.

Agora, para ambiente de deploy, por agora, temos duas opções:

A) Usar a vercel.

B) Usar um subdomínio do domínio que já temos configurados da CLOUDFARE.

O maior problema é o backend. Temos um worker configurado no cloudfare, porém, ainda não sei se ela aceita servidores para termos nossa própria API que le os dados. Isso é algo que irá ficar en open-questions, para pesquisa.

Na via das dúvidas, vou considerar que sim.

### Briefing-Template Preenchido
# Template Resumido de Briefing de Projeto

Use este template antes de transformar uma ideia em PRD, arquitetura ou tarefas. A meta nao e escrever muito: e responder o suficiente para saber o que construir, para quem, por que agora e quais decisoes ainda estao abertas.

### OUT OF MVP

## 1. Nome e contexto do projeto

*Por que adicionar esta secao:* e onde damos identidade ao projeto e explicamos rapidamente em que mundo ele existe. Isso evita que o restante do briefing fique solto ou dependa de contexto verbal.

**Preencha:**

- Nome do projeto: XBOARD
- Tipo de produto: SaaS.
- Contexto atual: Um dashboard que irá exibir as principais métricas de um funil de conversão de vendas. Feitas para auxiliar na otimização de tráfego e elevar a conversão de funil. A pergunta chave aqui é: quais são estas métricas?
- Repositorio ou referencias existentes: '/Users/brunogovas/Projects/Silver Bullet/Projetos/Dashboard_2.0'
- Estado atual: Estado de planejamento para a construção do MVP.

## 2. Job-To-Be-Done

*Por que adicionar esta secao:* e onde definimos qual problema central o projeto ajuda o usuario a resolver. Todo o restante do produto deve ser construido levando este Job-To-Be-Done em consideracao.

**Preencha:**

Quando **[situacao]**, o usuario quer **[progresso desejado]**, para conseguir **[resultado valioso]**.

Exemplo:

Quando um gestor de tráfego ou copywriter estão responsáveis por um funil, eles precisam saber quais são os seus gargá-los e pontos fortes, para saber o que otimizar e o que modelar para adicionar em próximos funis.

**Key:** Adicionar no documento de planejamento quais são as principais métricas que deverão ser exibidas pelo dashboard, além de recomendações simples de otimização que devem aparecer no frontend caso o usuário clique uma tool-tip, ou caso alguma métrica esteja abaixo do esperado, com base em práticas validadas do mercado.

Para isso, precisamos de uma feature adicional: A configuração de "métricas base", por nicho, onde o usuário irá conseguir definir quais são as métricas base de cada nicho. Então, o dashboard irá exibir notificações com a "saúde do funiL", ao exibir os dados de um funil selecionado. ( Um nicho será definido por país + mercado ).

Além disso, precisamos: Listar as principais métricas de um funil e as melhores práticas de otimização do funil.

## 3. Usuario-alvo

*Por que adicionar esta secao:* produto bom nasce de um usuario especifico. Se o usuario e generico, o escopo cresce, as telas ficam confusas e as prioridades perdem criterio.

**Preencha:**

- Usuario primario: Gestores de Tráfego, Donos de Operação e Copywriters.
- Perfil do usuario: 
- Como ele resolve isso hoje: Através de mettngs semanais e relatórios de gestores. 
- Principais dores: Falta clareza de informação e a capacidade simplificada de ver isso em tempo real.
- Objetivos do usuario: Otimizar o funil e coletar o resultado de suas otimizações, para adicionar em seu swipe-file.
- Usuarios secundarios ou futuros: 

## 4. Problema

*Por que adicionar esta secao:* aqui separamos sintoma de causa. Um bom problema explica o custo real de nao construir nada.

**Preencha:**

- Qual problema esta acontecendo?

O usuário não tem um lugar simplificado onde ele consegue coletar os dados de um funil de aquisição de vendas. O resultado final é que as otimizações são lentas, imprecisas e faltam com clareza.

- Quem sofre com ele?

Toda a operação, que fatura menos e tem menos eficiencia em seus processos.

- Quando ele aparece?

Ele aparece sempre que um usuário quer adiquirir clareza do que está acontecedno em cada funil de aquisição de vendas.

- Qual impacto pratico: tempo, dinheiro, qualidade, risco, escala, frustracao?

O impacto prático é:

A) Menos dinheiro faturado.

B) Menos independência dos membros.

C) Menor eficiencia dos processos de otimização de funil. 

- Por que as solucoes atuais nao resolvem bem?

Porque elas estão espalhadas, são de difícil acesso e não permitem que qualquer um consiga adquirir os dados necessários do funil.

## 5. Proposta de solucao

*Por que adicionar esta secao:* transforma o problema em uma direcao de produto sem ainda cair em lista infinita de features.

**Preencha:**

- Solucao em uma frase:
- Como o usuario usaria isso no fluxo real? Ele analisaria a saúde do funil. E então, tomaria duas decisões diferentes: Primeiro, ele decifraria seus gargalos. Ou s ele iria coletar os dados de resultado de alguma otimização específica.

- O que torna esta solucao melhor que o jeito atual?

Centraliza todas as informações necessárias para que os seus membros consigam realizar the two tasks defined above.

- Quais dados reais, sistemas ou operacoes ela precisa usar?

funnel_events data and funnel_leads data, wich both are data colected from the telemetry of the funnels implemented from the operation.

- O que precisa continuar sob controle humano?

The humam ( coder ), should be responsible EXPECIALY, for adding the telemetry capture in new funnels, and configure health metrics based on niche ( country + market ). The final product should have a feature where the user can copy the health metric data to another niche, so it dont have to work repeteadly to add data from niches with similar metrics.

## 6. Escopo do MVP

*Por que adicionar esta secao:* define o menor produto validavel. MVP nao e versao pobre; e a versao que testa a tese principal com o menor desperdicio.

**Preencha:**

### Deve ter

- Feature 1: A page where the user can see the funnel metrics, including: funnel passage, key metrics like CTR, IC, Checkout Conversion Rate, Purchases, etc.
- Feature 2: A page where the user can see a table-list of the leads, with key pointers, like "IC", "Purchased", etc. And another page with detailed data of the lead.
- Feature 3: A page where the user can configure the health-metrics for each niche. Where each niche will be based on market + country. We will need to add the market-data to data insert at funnel_events. Then, when the code sees that a funnel-metric is not healthy ( based on the metrics configured ), it should appear a card notification at the screen, notifing the user and proposing list of possible optmizations. Based on most revelant optimizations, found at the market.

### Pode ter se nao atrasar a validacao

- Feature opcional 1: Being able do configure recomendations when each mettric is bellow health level. 
- Feature opcional 2: 

### Fora do MVP

1. Detaield pointer of leads, like upsell purchase.
2. Action pipeline or notifications for the end-user when funnel health is low. 

## 7. Criterio de sucesso do MVP

*Por que adicionar esta secao:* sucesso precisa ser observavel. Sem criterio, o projeto vira uma lista de entregas em vez de uma validacao de valor.

**Preencha:**

O MVP sera considerado bem-sucedido quando:

- O usuario conseguir: Ver métricas chave do funil de forma clara no dashboard. Com um visual artistico diferente do restante do mercado - para dar um ar visual "premium".
- O sistema provar: Usabilidade e simplicidade, ou seja, o usuário final precisa estar engajado em utilizar o produto para adquirir as métricas chave.
- O negocio aprender: A utulizr a ferramenta, configurar métricas saudáveis.
- O risco principal for reduzido: 

## 8. Metricas principais

*Por que adicionar esta secao:* metricas conectam construcao com aprendizado. Elas mostram se o produto esta ficando util, nao apenas maior.

**Preencha:**

- Metrica de ativacao: 100%
- Metrica de uso: 70%
- Metrica de qualidade: 50% 
- Metrica de resultado de negocio: 100% 
- Metrica de custo ou eficiencia: 100%

## 9. Fluxo principal do usuario

*Por que adicionar esta secao:* obriga o projeto a ser pensado como experiencia, nao como amontoado de telas, tabelas ou endpoints.

**Preencha o caminho feliz:**

1. O usuario comeca em: Página de login / apresentação do dash.
2. Ele informa ou conecta: Email e senha. 
3. O sistema processa: Os dados. 
4. O usuario revisa ou decide:
5. O resultado final e: Ele é redirecionado para a página, contendo os dados principais do funil. 

**Preencha os desvios importantes:**

- Se algo falhar: Notifica o usuário com o erro que aconteceu.
- Se faltar dado: Não é exibdo na tela. 
- Se o usuario quiser intervir manualmente: Ele pode. 
- Se uma integracao externa responder diferente do esperado: Exibe o erro na tela. 

## 10. Regras de negocio

*Por que adicionar esta secao:* regras de negocio sao as decisoes que mantem o produto confiavel. Elas devem ficar explicitas antes de virar codigo espalhado.

**Preencha:**

- Regra 1: Só pode ser exibido um funil por vez na página principal de exibição do funil. O filtro acontece por funnel_id. Adicionar outros filtros como country, são "filtros aninhados", dentro do filtro pai, que é o funnel_id.
- Regra 2: 
- Regra 3:
- O que nunca deve acontecer: Deixar de ser exibido um funnel_id / country na select box, quando houver. 
- O que precisa ser auditavel: Erros de requisição de daso.

## 11. Dados essenciais

*Por que adicionar esta secao:* todo produto serio depende de dados reais. Esta secao evita construir telas bonitas em cima de dados que nao existem, nao sao confiaveis ou nao tem dono.

**Preencha:**

- Entidades principais: Usuário
- Dados obrigatorios por entidade: Email, Nome, Senha.
- Fonte dos dados: Supabase. 
- Quem cria ou atualiza os dados: Eventos de telemetria realizado do funil. Configuração manual de "health-metrics", por mercado.
- Dados sensiveis: Eventos / leads.  
- Historico ou auditoria necessaria: Se o usuário está logado. 

## 12. Integracoes e infraestrutura

*Por que adicionar esta secao:* integracoes costumam ser onde o projeto parece simples e depois encarece. Aqui registramos dependencias externas cedo.

**Preencha:**

- APIs externas:
- Banco de dados: supabase. funnel_events ( atualizar, com market ) funnel_leads, users ( para criar ), health_metrics.
- Automacoes ou workflows: none.
- Autenticacao: email e senha.
- Pagamentos: none-for know
- Notificacoes: apenas em cards, dentro do dash, por agora. 
- Custos variaveis relevantes: none.
- Credenciais ou permissoes necessarias: supabase secret, supabase url. 

## 13. Restricoes e premissas

*Por que adicionar esta secao:* restricoes sao limites reais; premissas sao apostas. Separar as duas coisas ajuda a decidir o que pesquisar, testar ou cortar.

**Preencha:**

### Restricoes

- Orcamento: 000
- Prazo: 1 Dia
- Time ou recursos: 1 Pessoa.
- Limites tecnicos: Sem easy-panel para deploy de API.
- Limites legais, plataforma ou compliance: None. 

### Premissas

- Acreditamos que: Conseguiremos dar clareza sobre as métricas de eventos que estão acontecendo dentro da operação. Além de conseguir facilitar a otimização de dados que acontecem dentro de cada operação. 
- Ainda nao provamos que: Nós iremos conseguir fazer o usuário final aderir ao produto e utilizá-lo, como fonte primária de informações.
- Se esta premissa estiver errada, o impacto sera: Esforço gasto, de forma desnecessária.

## 14. Riscos e mitigacoes

*Por que adicionar esta secao:* todo projeto tem risco. Bons construtores nomeiam o risco cedo e criam um plano para reduzi-lo.

**Preencha:**

- Risco 1: Dados incompletos.
  - Impacto: Otimização falha, perca de confiança.
  - Como validar ou reduzir: Garantir que todos os eventos sejam disparados / coletados via sendBeacon + fetch com keepalive como fallback. 
- Risco 2: Complexidade demais para o usuáiro final.
  - Impacto: REsitencia interna para o usuáiro final utilizar o software.
  - Como validar ou reduzir: Garantir que a UI pareça menos técnica e visualmente amigável. 
- Risco 3: Pessoas de outras operações terem acesso ao nosso dash.
  - Impacto: Dados principais da operação vazados.
  - Como validar ou reduzir: Fazer com que apenas o administrador consiga criar emails de acesso. 

## 15. Perguntas em aberto

*Por que adicionar esta secao:* perguntas abertas sao trabalho legitimo. Elas impedem que duvidas importantes virem decisoes escondidas.

**Preencha:**

- Pergunta 1: Como iremos realizar o deploy da nossa api? É possível realizar pelo worker e pages do cloudfare?
- Pergunta 2: Quais são os principais dados que devem ser exibidos pela dashboard?
- Pergunta 3: Quais são as principais tomadas de decisão / otimizações que podem ser realizadas para melhorar cada métrica?
- Quem pode responder: Pesquisa profunda. Eu, operação. 
- Qual experimento, pesquisa ou leitura resolve: Primeiro, um leve brainsotrm como meu repertório, então uma pesquisa focada com o intuíto de coletar essas métricas principais. 

## 16. Proximos passos

*Por que adicionar esta secao:* encerra o briefing com acao. Um bom proximo passo reduz incerteza ou aproxima o produto de validacao real.

**Preencha:**

1. Primeira acao: Coletar principais métricas de um funil.
2. Segunda acao: Coletar principais otimizações de um funil.
3. Terceira acao: Descobrir como realizar o deploy da API.
4. Quarta ação: Construir WIREFRAME, Construír Assets, Mapear componentes e expandir página página de catálogo inicial.
5. Quinta ação: Construir as 3 páginas do frontend. Página por página.
6. Sexta ação: Planejar o backend.
7. Sétima ação: Construir o backend + fazer as páginas consumirem ele. 

**Antes de construir, confirme:**

- O problema esta claro? Sim. 
- O usuario primario esta claro? Sim.
- O MVP esta pequeno o bastante? Sim. 
- As dependencias externas foram verificadas? Não, falta como realizar o deploy de API. 
- Existe dado real para sustentar a experiencia? Sim.
- O criterio de sucesso e mensuravel? Sim. Uso ou não da Operação. 

---

Próximos passos: 

1) Coletar principais métricas de um funil.

Lista:

A: Taxa de conversão.

B: CTR ( para IC )

C: Quantidade de conversão.

D: Quantidade de IC.

E: Taxa de conversão de checkout.

2) Coletar principais otimizaçõs por métrica.

A: 1. Melhorar Bloco de Oferta. 2. Adicionar Elementos de Prova Superiores. 3. Reduzir fricção do usuário ao iniciar o checkout ( copy e programação ).

B: 1. Diminuir fricção para IC. 2. Aumentar nível de compromentimento do LEAD. 3. Fortalecer Close.

C e E: 1. Aumentar nível de compromentimento do lead. 2. Aumentar a segurança do le ead. 3. Aumentar a clareza sobre o processo de pagamento.

D: 1. Diminuir fricção com o checkout. 2. Aumentar Segurança. 3. Fortalecer Bloco de Oferta.

3) Descobrir como realizar deploy da API.
Iresmos realizar o recurso chamado PAGES functions, da cloudfare. Onde iremos colocar a nossa api dentro de uma pasta chamda /functions. Este recurso permite que arquivos dentros dessa pasta se tornem endpoints. 

---

Lista de componentes:

Lista de assets:

1. Asset de fundo para página de login.

2. Configuração da pasta: Layout, UI, Sections. ( Ui, contém atomos e molêculas, enquanto Layout contém componentes e as sections inportam tudo )

---

Mini engenharia reversa: 

Pasta com a API do projeto:

/lib/providers, essa pasta contém arquivos que irão prover informações para páginas no frontend.

/lib

1. Revisar Wireframe - Mapear Componentes. 

a. Logo.
b. Input box.
c. button.
d. side-bar.
e. side-bar icons.
f. select box. 
g. progress bar.
h. badges.
i. Alert-Cards.
j. check box.
k. check box com input.
l. select box com datas.
m. pagination.
n. copy button.
p. icon logo. ( Made from only the icon, taken from the SGV at: /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/logoblack.svg & /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/logoWhite.svg ).

2. Assets.

a. Imagem para página de loggin: @/Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/login-img.png
b. Imagem para fundo da página de funil. /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/mountains-funnel-flux.png
c. Imagem para página de perfil do lead. /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/lead-detail-img.png
d. imagem para página funnel-health:  /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/funnel-health-img.png.

---

Enegnharia reversa do PROCESSO.

PARTE 00: PESQUISA DE MERCADO. 

Aqui, o objetivo é simples, queremos saber três coisas.

1. Detalhes do nosso publico alvo, como suas dores, identidades, desejos e crenças.

2. Detalhes da estratégia de marketing de nossos concorrentes.

3. Detalhesm de tecnologia, ui e ux, usados e validados pelo nossos concorrentes.

PARTE 01: Geração de ICONE, LOGO e IDENTIDADE VISUAL ( PALETA DE CORES + ESTILO ARTÍSTICO ).

Primeiro, gera ideias de icones, com base no contexto do projeto, o ícone deve remeter intuítivamente ao que o projeto representa. Quanto mais ele conseguir remeter a essa representação de forma intuitíva, melhor o ícone é.

Segundo, pesquisa concorrentes. O objetivo é entender quais são os seus principais concorrentes mapeados no consciênte coletivo do seu público, assim seu objetivo passa a ser se diferenciar deles o máximo possível, para que a sua marca seja verdadeiramente "única". 

PARTE 02: Criação da copy.

Aqui, é o processo clássico de criação de copy.

1. Define mercado.
2. Define mecanismo.
3. Define big-idea.
4. Define oferta.
5. Define história / estrutura.
6. Define Headline / Hero.

> **Key:** A parte de copy 

PARTE 03: Criação do wireframe das páginas. 

PARTE 04: Criação dos assets e thema da página. 

PARTE 05: Definição da Stack-Tecnológica de Frontend e Organização de todo Material do projeto.

PARTE 06: Construção da página inicial de catálogo dos componentes.

PARTE 07: Construção de cada página do frontend do projeto.  

PARTE 08: Planejamento da lógica de backend do projeto. 

PARTE 09: Construção do backend.

PARTE 10: Conectar o Backend com o front e dar deploy. 

### Prompt utilizado catálogo.
1. We are at the second fase of development of our APP at [dashboard](dashboard/). Right now, our main goal is build the dashboard frotnend wich will be the main functionality page of the project. It has five main pages cataloged.

Page 01: Login.
Page 02: Funnel Overview.
Page 03: Leads Table.
Page 04: Lead Detail.
Page 05: Health Config.

2. We have the tecnological stack planned, and the files already organized in folders, as documented at: [planejamento-dash.md](file;file:///Users/brunogovas/Projects/Projetos%20Solo/dashboard/planejamento-dash.md) 

3. Your goal right know is:

A. Mapping the components we need to implement our LP. Review our wireframe with the paper MCP. And the components already mapped at the document shared above.

A list of pre-existing mapped components are:
a. Logo.
b. Input box.
c. button.
d. side-bar.
e. side-bar icons.
f. select box. 
g. progress bar.
h. badges.
i. Alert-Cards.
j. check box.
k. check box com input.
l. select box com datas.
m. pagination.
n. copy button.
p. icon logo. ( Made from only the icon, taken from the SGV at: /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/logoblack.svg & /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/logoWhite.svg ).

B. Import its components, from shadcn mcp.

C. Expand the already existing catalog page, adding the new components for the dashboard for stakeholder aproaval, before continuing with the dashboard page. ( DO NOT IMPLEMENT THE DASHBOARD YET ).

This catalog page will be responsable to be the source of truth of our design sistem. ( witch is documented at [global.css](dashboard/styles/global.css) ). 

D. Also, place the components that have images and organize the images mapped at the folder.

---
a. Imagem para página de loggin: @/Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/login-img.png
b. Imagem para fundo da página de funil. /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/mountains-funnel-flux.png
c. Imagem para página de perfil do lead. /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/lead-detail-img.png
d. imagem para página funnel-health:  /Users/brunogovas/Projects/Projetos Solo/dashboard/assets-raw/funnel-health-img.png.

__

Rules:

1. the project at paper MCP is a WIREFRAME, DO NOT COPY IT COMPONENTS / ELEMENTS, JUST INTERPRET IT AS A "MOCK-UP".
2. Do not duplicate components that already exists at our design-system / catalog page.

### Prompt utilizado - planejamento backend.

1. Invoque [data-engineer.md](.aios-core/development/agents/data-engineer.md) e aplique *create-migration-plan.

O objetivo é criar o planejamento do nosso backend ( apis ) e schema, para fazer a conexão frontend-backend do projeto [dashboard](dashboard/).

---

O que foi feito:

PARTE 01:

1. Definido extamente o que deve ser adicionado nas tabelas exisitentes.
2. Definido quais são features que precisam de views e RPCs.
3. Definida tabela nova para nova feature.4. Planejamento do sistema de AUTH.
5. Mapeamento do lugar onde adicionar à API.

PARTE 02:

Detalhamento de exatamente o que será adicionado / removido de cada tabela.

PARTE 03: 

### Prompt construír página
1. Invoque [dev.md](.aios-core/development/agents/dev.md) e aplique *develo-preflight.

O objetivo é construir a página inicial de Funnel Overview do nosso app [dashboard](dashboard/) . Considerando o nosso wireframe ( just use it as a referênce, DONT'T reuse ANY component from it, its just an wireframe ).

So, I need you to build a plan do build the page, with all its already built-in components and assets, referenced at the catalog page.

Be sure to use the design-system / theme already configured at the project.

RULES: 

1. DO NOT CREATE ANY NEW COMPONENT, RE-USE PLANNED COMPONENTS.

---

Perguntas: o que é PGCRYPTO?

---

COMO APLICAR EFEITOS DE FADE EM UMA IMAGEM:

1. Você precisa aplicar uma gradient mask em sua imagem.

2. Ela é um efeito em que faz algo surgir "aos poucos", na tela. Por isso - gradient.

3. É simples, você usa um gradient overlay. Você faz a imagem, em um ponto inicial, começar com opacidade total, tendo a cor de fundo do site. Então faça com que em algum enquadramento de pixel, ela tnha a cor 100% dela novamente

---

80/20 de trabalhar com AI é o prompt + repertório. Ou seja, o jogo é validar um prompt / processo e ir re-utilizando ele, então aplicar:

1. Prompt.

2. Coda.

3. Aplica outros prompts enquanto coda.

4. Revisa resultados finais, um por um. 

A questão é: o prompt inicial precisa ser minimamente validado, para evitar excesso de retrabalho.


---


Sobre a organização de layout. 

Para organizar o layout, tenho que pensar em seu objetivo final. Por exemplo, o objetivo do dashboard é ter clareza do que está acontecendo em um funil.

E é justamente por isso que o que o usuário deve ver primeiro são os cards de métricas e progress bars com a passagem do funil.

Por fim, o nome disso é "hierarquia visual da tela", ela deve ser completamente intencional.

Agora, vamos para o seguindo ponto.

Nós podemos organizar as páginas, através de "grids" que não são nada mais do que colunas. E dentro de uma grid, podemos colocar mais de uma grid.

Assim, podemos utilizar técnicas que separam o conteúdo da tela de forma visual em colunas.

Por exemplo, podemos definir que o layout main será dividio em duas colunas e que a coluna da esquerda será dividia em outras colunas.

Por fim, podemos definir o espaçamaento dos componentes de forma organizada.

O espaço entre colunas é maior do que os elemntos dentro de uma mesma coluna, por exmeplo.

---

Agora: fica uma pergunta crucial: os componentes estão sendo corretamente importados, ou apenas estão sendo criados com base no existente? 

O caso 2 não pode acontecer.


---

Para animar elementos que são preenchidos.