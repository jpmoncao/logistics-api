import dotenv from 'dotenv'
import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiReference } from '@scalar/express-api-reference';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { getOpenApiSpec } from './infra/http/docs/open-api-spec';

import { emailWorker } from './infra/jobs/workers/email.worker'
import { EmailQueue } from './infra/jobs/queues/email.queue';

import { loggerMiddleware } from './infra/http/middlewares/logger.middleware';

import { entregasRouter } from "./infra/http/routers/entrega.router";
import { entregadoresRouter } from "./infra/http/routers/entregador.router";
import { destinatariosRouter } from "./infra/http/routers/destinatario.router";

dotenv.config({ quiet: true });

// Configurações da API
const HOST = process.env.API_HOST ?? 'http://localhost';
const PORT = process.env.API_PORT ?? '5000';
const API_URL = HOST + ':' + PORT;

// Instância do Express
const app = express();

// Instâncias de uso do Express
app.use(express.json());

// Middleware do Helmet
app.use(helmet());

// Adicionando o CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// Adicionar o rate limit do Express
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
}));

// Adicionando Bull Board na API
const emailQueue = new EmailQueue();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({ queues: [new BullMQAdapter(emailQueue.queue)], serverAdapter });
app.use('/admin/queues', serverAdapter.getRouter());

// Middleware do logger
app.use(loggerMiddleware);

// Rotas da aplicação
app.use('/entregas', entregasRouter);
app.use('/entregadores', entregadoresRouter);
app.use('/destinatarios', destinatariosRouter);

// Adicionando Scalar Docs UI na API
app.use('/docs', apiReference({
    content: getOpenApiSpec(),
    theme: 'kepler',
    pageTitle: 'Documentação Logistics API',
    defaultOpenAllTags: true,
    showDeveloperTools: "never"
}));

// Iniciando API
app.listen(PORT, () => {
    console.log(`✅ API is running: ${API_URL}`)
    console.log(`📊 Bull Board rodando em: ${API_URL}/admin/queues`);
    console.log(`📄 Documentação rodando em: ${API_URL}/docs`);
});

// Iniciando Email Worker
emailWorker('✅ Email Worker is running.');
