Planejamento da construção de páginas

1. Passo 01: Mapear os assets, para cada componente definido no wireframe.

Asset 01: Hero background: dashboard/assets/hero-background.png. 

Ideia: Transformar a imagem da lua em um SGV e aplicar o efeito de luz já codado.

Asset 02: 3 Avatares da badge de "Prova Social" do hero: /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/test-fem-1.png, /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/test-fem-2.png, /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/test-fem-3.png.

Asset 03: Avatares da sessão de depoimentos: /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/test-masc1.png, /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/test-masc-3.png, /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/testmasc2.png

Asset 04 e 05 ( respectivamente ), exibidos na sessão de "Mepeie os eventos do leads" e "Tenha em mãos"... /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/test-fem-4.png, /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/fundo-mapear-leads.png.

Asset 06: Foto Bruno: /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/fundo-bruno.jpeg

Asset 07 e 08: Logos White & Black ( Icone e texto ): /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/logoblack.svg, /Users/brunogovas/Projects/Projetos Solo/dashboard/assets/logoWhite.svg.

**To do:** Criar SGV com só imagem.

2. Passo 02: Criar uma organização mínima de pastas.

/assets-raw, contém todos os assets do projeto, sem estarem organizados, não deve ir para ambiente de deploy.

/app, contém o layout global do APP, com o global CSS. E as principais páginas.

/components, contém os componentes da página. Dividos em / layout ( componentes ) / sections ( sessões da LP ) / ui ( componentes atômicos e moléculas da página ).

/lib, contém as funções de backend da página.

/node_modules, contém os arquivos node ( o que são ??? ).

/public/images, contém o endereço final das imagens, de forma organizada. Divido entre, backgrounds, testmonials e logos. 

Perguntas restantes: Para que serve o components.json?

Este é um documento de configuração do shadcn. Todos os componentes importados do MCP receberão os dados que estão configurados neste documento.

1. Apontar para o CSS em app/global.css.
2. Usar a cor base "neutral".
3. Usar variáveis CSS.
4. Importar componentes na pasta correta: componentes em /components. utils em /utils, lib em /lib e hooks em /hooks.
5. Configurar qual é a biblioteca de ícones utilizadas: lucide.

Assim, sempre que algo for importado do shadcn, ele irá respeitar essas regras definidas.

para que serve next-env.d.ts?

Usado como fonte para ensinar o tyescript como interpretar arquivos exlcusivos do sistema next.js, como imagens e módulos CSS.

para que serve next.config.ts?

Usado para configurar o comportamento do aplicativo NEXT.js após o Build. Permite ler arquivos fora da SRC, configurar redirecionamentos entre outros. 

para que serve package-lock.json

> Para mapear o local das bibliotecas que serão instaladas via NPM.

para que serve postcss.config.mjs.

// Exporta um objeto config, que tem dentro um objeto "plugins", com "tailwindcss.postccs" configurado, porém vazio.

para que serve tsconfig.json.

// Configura as responsabilidades do typescript. Para exibir erros de código. Está configurado para se ater as regras específicas do next.JS. Ou seja, é neste arquivo que é definido a responsabilidade do javascript, à depender do framwork utilizado para desenvolver o código.

3. Passo 03: Definir a Stack-Tecnológica do projeto e porque. 

A) Porque NEXT.JS, next JS é um framework utilizado para lidar com implementações em REACT ( Que permite construção de páginas à partir de compotentes isolados ). Porém, diferentemente do REACT padrão, que renderiza a página no cliente ( client-side ), o next renderiza a página no servidor, antes da página ser carregada no cliente final. O resultado é que a página renderiza com muito mais rapidez do que se fosse começar a se renderizada só no client-side.

Além disso, ele aplica otimizações automáticas para fontes e imagens, acelerando ainda mais o desenvolvimento de código. Por fim, ele conta com um sistema de rotas de páginas intuítivo, feito por pastas, simplificando o desenvolvimento de código.

Em suma ele trás 3 benefícios:

    1. Otimização e Melhora na velocidade de carregamento da página.
    2. Simplifcação dos processos de configuração de roteamento de página.
    3. Otimização em imagens e fontes codadas no texto.

O que significa que o next é a tecnologia ideal para construir uma página em react, que é veloz.

B) Porque TAILWIND? 

O Tailwind é como um global CSS pré-definido. Permitindo que você não precise criar um arquivo extenso de configuração de CSS. Assim, ao invés de seguir o fluxo tradicional de: criar arquivo css --> criar componente com variáveis CSS. Você apenas injeta as classes pré-definidas do tawilind no seu HTML.

O resultado final é uma exclusão de um dos maiores problemas em desenvolvimento de sites e aplicações: código CSS morto e desorganizado. Ou seja, se algum dia você deixa de usar uma classe / componente específico que usa uma classe, a classe deixa de existir no código.

Além disso, o compilador do tawilind ( ao realizar o build ), varre código morto, limpando o código, de forma que ele fique muito mais otimizado. 

C) Radix UI

O Radix ui é uma biblioteca que fornece a engenharia por trás de componentes, sem fornecer a sua parte visual ( estilo ), isso nos permite criar componentes que envolvem algum tipo de lógica complexa, sem nos colocar sobre a responsabilidade de desenvolver a lógica.

Por exemplo: com o Radix UI, ao invés de construir a lógica de ativação de um exit pop-up ( o que significaria tentar prever inúmeros comportamentos e meios diferentes pelo qual um usuário pode sair a página ), você pode simplesmente importar o RADIX UI, deixar que ele cuida da lógica, enquanto você cuida do CSS.

D) Framer Motion

Framer motion é uma das principais bibliotecas modernas no que se tange a movimento de elementos da página. Assim como o Radix UI, ele serve como uma forma de "Delegar" complexidade de código. Então, ao invés de codar uma animação via CSS, por exemplo, você pode simplesmente utilizar o framer-motion.

A junção de RADIX + Framer motion + Tailwind cria a estrutura dinâmica completa para a construção de páginas de ALTO nível.

4. Passo 04: Criar o design-system ( página de catá-logo do design-system ), com componentes, moléculas e átomos.

Componentes Mapeados:

    1. Botão Principal ( Hero ). Botão secundário ( Bruno + Header )
    2. card depoimento.
    3. Sessão header. 
    4. Img Template.
    5. Img Section ( onde vai a img template ).
    6. IMG Template + img section 3 ( da parte de bruno ).
    7. Faq boxes ( com sistema de abrir / fechar ).

5. Passo 05: Criar sessão por sessão.

---

1. Importar componentes.

2. Planejar framer-motion.

3. planejar sessão por sessão.

---

### Prompt Utilizado para Criar os Componentes.
1. We are at the first fase of development of our APP at [dashboard](dashboard/). Right now, our main goal is build the initial LP page witch will be our "presentation", to new users.

2. We have the tecnological stack planned, and the files already organized in folders, as documented at: [Planejamento da construção de páginas.md](dashboard/Planejamento da construção de páginas.md).

3. Your goal right know is:

A. Mapping the components we need to implement our LP. Review our wireframe with the paper MCP. And the components already mapped at the document shared above.
B. Import its components, from shadcn mcp.
C. Create a catalog page, where it will have all the components mapped, and design-system documented, for stakeholder aproaval. This catalog page will be responsable to be the source of truth of our design sistem. ( witch is documented at [global.css](dashboard/styles/global.css) ). 

Rules: the project at paper MCP is a WIREFRAME, DO NOT COPY IT COMPONENTS / ELEMENTS, JUST INTERPRET IT AS A "MOCK-UP".

---

Sua intuição serve para lidar com problemas complexos no qual a mente consciente não consegue lidar, por isso, se está tendo que lidar com um problema muito complexo - confie em sua intuição. Para deixar ela trabalhar é necessário "brincar" e esquecer complexidades da vida.

---

### Sobre animação de surgimento de elemento

Essa é uma técnica simples: utilizada para a criação de um efetio premium de página.

Isso faz com que uma vez que o usuário mova a tela para baixo, o componente surga com um efeito de fade-up, capturando sua atenção e direcionando a sua leitura.

**Key:** Micro-alavanca de captura de atenção do funil.

Você consegue realizar isso através do motion do Framer motion e com um passo a passo de 4 etapas.

Etapa 1: Faça com que no surgimento do componente, ele esteja deslocado para baixo de sua posição atual ( -y ).

Etapa 2: Faça com que no surgimento do componente, ele esteja com uma opacidade de 0.

Etapa 3: Faça com que quando o componente apareça na vieport, ele tenha uma opacidade de 1 e volte para a posição original.

Etapa 4: Faça uma regra que este efeito só pode ser realizado uma vez após a renderização da página. ( Para que não fique se repetindo, caso o usuário scrolle decima para baixo ).

---

O que fazer enquanto o agente executa uma tarefa?

Resposta: executar outras tarefas ( que não tenham à ver com codagem ).

Por exemplo: Fazer networking. Preencher forms, etc.

Agora estamos na parte "codagem da página".

**Key:** Tudo que é "codar" é shallow work.

Agora, já passei da faze de planejamento e estou "codando". 

Resposta:

1. Networking.
2. Estudo.
3. Aumento de opicionalidade.

Regra geral: NÃO codar, deixar a mente descançar.

---

1. Testar fontes secundárias: Satoshi, Space Grotesk.

2. Fazer com que o header tenha o mesmo fundo do restante da página.

3. Manter um padrão de background-color das sections.

4. Ao invés de cada section ser sepada por cor, usar o estilo:

Headline + Elementos principais, como acontece em epic.new.

