## Clean Architecture
A Clean Architecture (Arquitetura Limpa) foi proposta por Robert C. Martin e consiste em organizar o código por camadas, onde cada uma possui sua própria responsabilidade bem definida.

Para que essa abordagem funcione, precisamos seguir sua regra fundamental: a Regra de Dependência. Ela dita que as dependências de código só podem apontar para dentro. Ou seja, as camadas internas, como a camada de domínio (regras de negócio), não conhecem e não dependem das camadas externas, como a infraestrutura.

Isso resulta em um sistema fracamente acoplado e altamente coeso. Por isso, conceitos como SRP (Princípio de Responsabilidade Única) e DI (Injeção de Dependência) são vitais para essa arquitetura.
![Diagrama Clean Architecture](./.github/clean-architecture.png)
## Camadas
### 1. Infrastructure (Infraestrutura)
De forma simplificada, esta é a camada do "mundo real". É onde os detalhes técnicos residem: nosso framework web (Express), banco de dados (Prisma/Postgres), serviço de cache (Redis), filas e implementações de envio de e-mail. Ela muda com frequência, mas não deve afetar o coração do sistema.

### 2. Application (Aplicação)
A camada de aplicação é onde ocorrem as operações e a orquestração das regras de negócio. Aqui encontramos a implementação dos nossos Casos de Uso (Use Cases). Ela atua como uma "cola", buscando dados nos repositórios e acionando as entidades, mas sem conhecer detalhes de frameworks (como rotas HTTP ou SQL puro).

### 3. Domain (Domínio)
Aqui estão as regras de negócio corporativas ("Enterprise Business Rules"). Nossas Entidades e regras vitais estão definidas aqui. É crucial que essa camada não conheça o banco de dados ou qualquer estrutura de infraestrutura. Tudo aqui funciona por meio de contratos (Interfaces) e Lógica Pura, garantindo que o núcleo do software seja agnóstico a tecnologias externas.

### 4. Core/Shared Kernel (Núcleo)
Classes abstratas, tipos genéricas e interfaces que são compartilhadas em todas as outras camadas.