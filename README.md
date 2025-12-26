> Este repositório ainda está em desenvolvimento...

# Logistics API

### Caso de uso:
- Para estudar arquitetura de software na prática, com conceitos de Clean Architecture, DDD, Clean Code, selecionei um caso de uso de um **setor de logística**.
- Aqui estão alguns pontos do que essa API pode fazer:
1. **Entregas**
    - Criação de entregas
    - Manipulação do fluxo de entrega: `despacho` > `em caminho` > `conclusão da entrega`
    - Rastreamento com geolocalização da entrega
    - Controle de histórico e movimentações da entrega
2. **Entregador**
    - Criação do entregador
    - Autenticação no sistema
    - Atribuição das entregas em lote
    - Atualização da localização do entregador
    - Confirmação de entrega com comprovante
3. **Destinatário**
    - Criação do destinatário
    - Autenticação no sistema
    - Rastreio da suas entregas
  
### Stack utilizada:
- **Typescript**
- **Node 22.15.0**
- **API**: Express 5
- **ORM**: Prisma
- **Banco de dados**: MySQL
- **Cache**: Redis
- **Queue**: BullMQ
- **Testes**: Vitest

### NPM scripts
```bash

npm run dev # hot reload da api

npm run prisma:generate # inicia o schema do prisma

npm run prisma:migrate-dev # verifica alterações no schema 

npm run prisma:deploy # roda as migrations no banco

npm run prisma:reset # reseta o banco

npm run test # testes automatizados
```
