
yagovf
6 min de leitura
·
11 dias atrás
Engenharia reversa no 7a0: a matemática por trás do jogo que viralizou no Brasil
Se você estava na expectativa da copa essa semana, esbarrou no 7a0 (Sete a Zero). O jogo é simples e viciante: você rola um dado, recebe uma seleção histórica, monta um time de craques posição por posição e simula uma Copa torcendo para sair invicto.

Feito por um desenvolvedor brasileiro sozinho, com o empurrão da Cazé TV na pré-Copa de 2026, virou febre nacional.

Nota rápida: a ideia aqui não é estragar a festa nem diminuir o trabalho do criador. É compartilhar, com curiosidade de quem ama tecnologia e futebol, o que encontrei por trás. Continuo jogando e recomendando.

Junto com a febre veio a frustração coletiva. Os comentários estão cheios de "não passo das quartas" e do meme "e aí cai a Escócia de 1974 nas quartas". A galera jura que o jogo te sabota na reta final.

Em vez de teorizar, abri o console do navegador e fui fazer engenharia reversa.

O resultado já estava decidido antes do apito inicial
Todo jogo com elementos aleatórios precisa de um gerador de aleatoriedade. O 7a0 usa um truque clássico: um gerador pseudoaleatório com semente (seed).

Pensa numa senha mestra sorteada no segundo zero da partida. A partir dela, tudo já está definido: quais seleções aparecem quando você rola o dado, contra quem você vai jogar em cada fase, o placar de cada jogo.

O jogo só vai revelando aos poucos, como se estivesse acontecendo na hora. Mas a sorte já foi jogada.

Para provar isso, copiei o gerador do jogo e rodei fora dele. Dada a mesma senha, ele produziu exatamente a mesma sequência de números, dígito por dígito. Sabendo a seed, dá para prever o futuro inteiro da partida antes de apertar "simular".

E mais: contra quem você joga em cada fase também está decidido pela seed. Consegui reproduzir a lista exata de adversários — do grupo até a final — só com a senha. Aquele meme da "Escócia de 1974 nas quartas" não é azar aleatório. É um roteiro escrito no segundo zero.

Curiosidade: a senha é um número com ~4,29 bilhões de possibilidades. A chance de cair uma específica é de 1 em 4,29 bilhões. Na prática, nunca se repete.

Como o placar é calculado
Cada jogo é decidido por dois sorteios independentes — um para os gols que você faz, outro para os que sofre. Cada sorteio segue uma distribuição de Poisson, a mesma matemática que estatísticos usam para modelar gols no futebol de verdade.

A média de gols de cada sorteio é calculada assim:

Média de gols a favor = 1.4 + (meu ATAQUE − força do adversário) × 0.08

Média de gols sofridos = 1.4 + (força do adversário − minha DEFESA) × 0.08

Você começa com um "jogo médio" de 1,4 gols. Para cada ponto que seu ataque supera o adversário, ganha +0,08 de média. Se o adversário for mais forte, a média cai.

O problema: os adversários ficam progressivamente mais fortes a cada fase.

Fase Força do adversário Grupos68 a 76Oitavas79Quartas83Semifinal87Final91

Por que todo mundo trava nas quartas? A conta que explica o meme
Para entender o gargalo, eu precisava da base completa de jogadores com as notas reais. Quando baixei os dados, os números não faziam sentido: Maradona aparecia com "nota 38".

O motivo era simples. O jogo ofusca a força de cada jogador usando uma operação de XOR combinada com um código interno do próprio atleta. Depois de reverter esse processo e reconstruir a base original, encontrei 250 seleções históricas e 5.613 jogadores com notas reais variando de 64 a 99.

Os únicos atletas que atingem nota máxima são Maradona, Messi, Pelé, Neuer e Yashin.

Com a base limpa, finalmente foi possível responder à pergunta que mais aparece entre os jogadores: por que tanta gente parece morrer nas quartas de final?

Para isso, rodei milhares de simulações utilizando as notas reais dos jogadores.

Fase	Time mediano (80)	Time forte (90)
Grupos	60% a 80%	~90%
Oitavas	54%	88%
Quartas	38%	76%
Semifinal	24%	62%
Final	12%	46%
Os números explicam por que a sensação de "bater na trave" é tão comum.

Um time mediano costuma atravessar a fase de grupos sem grandes dificuldades. No entanto, à medida que o torneio avança, a qualidade dos adversários cresce rapidamente. A chance de vitória cai de forma consistente até chegar a apenas 12% na final.

Não é perseguição.

É matemática.

O adversário fica mais forte a cada fase, enquanto o seu time permanece praticamente o mesmo.

A próxima pergunta era inevitável: existe alguma forma de garantir o 7 a 0?

Para responder, rodei 3.000 partidas simuladas utilizando estratégia ótima.

Cenário	Chance de título
Jogador perfeito (escolhas ótimas sem voltar atrás)	~10%
Com visão de retrospecto (reorganiza o time ao final)	~27%
Escolhendo a seed	100%
O resultado mais surpreendente não é o 100%.

É o 10%.

Mesmo um jogador que conhece a nota real de todos os 5.613 jogadores da base e toma sempre a melhor decisão possível conquista o título em apenas cerca de uma em cada dez partidas.

Dar ao jogador o poder de reorganizar completamente o elenco depois de visualizar todas as opções disponíveis melhora o resultado, mas ainda assim a taxa de sucesso permanece em apenas 27%.

Somente quando a seed pode ser escolhida livremente a vitória se torna garantida.

A conclusão é contraintuitiva. O 7 a 0 não é um desafio puramente de habilidade. Existe um limite imposto pela própria estrutura probabilística do jogo.

De acordo com as simulações, aproximadamente 73% das seeds geram torneios nos quais o título é matematicamente impossível, independentemente da qualidade das decisões tomadas ao longo da partida.

Em outras palavras: na maior parte das partidas, o resultado já está parcialmente determinado antes mesmo da primeira escolha ser feita.

O que isso revela
O 7a0 é, na essência, um jogo de sorte com uma camada fina de habilidade. A seed manda. Sua decisão de qual craque colocar em qual posição muda quanto você aproveita a sorte que recebeu, mas raramente transforma uma seed ruim em título.

E tem um detalhe de design escondido aí. A frustração de chegando perto — mais da metade das vezes você alcança pelo menos a final jogando bem — é exatamente o que faz você clicar em "jogar de novo".

O jogo foi projetado para ser quase ganhável.