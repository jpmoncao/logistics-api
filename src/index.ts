import dotenv from 'dotenv'
import express from "express";
import cors from 'cors';

import { entregasRouter } from "./infra/http/routers/entrega.router";
import { entregadoresRouter } from "./infra/http/routers/entregador.router";
import { destinatariosRouter } from "./infra/http/routers/destinatario.router";

import { emailWorker } from './infra/jobs/workers/email.worker'
import { EmailQueue } from './infra/jobs/queues/email.queue';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

dotenv.config({ quiet: true });

// Configurações da API
const PORT = process.env.API_PORT ?? '5000';
const API_URL = 'http://localhost:' + PORT;

// Instância do Express
const app = express();

// Instâncias de uso do Express
app.use(express.json());
app.use(cors());

// Adicionando Bull Board na API
const emailQueue = new EmailQueue();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({ queues: [new BullMQAdapter(emailQueue.queue)], serverAdapter });
app.use('/admin/queues', serverAdapter.getRouter());

// Rotas da aplicação
app.use('/entregas', entregasRouter);
app.use('/entregadores', entregadoresRouter);
app.use('/destinatarios', destinatariosRouter);

// Iniciando API
app.listen(PORT, () => { console.log('✅ API is running: ' + API_URL) });

// Iniciando Email Worker
emailWorker('✅ Email Worker is running.');

console.log(`📊 Bull Board rodando em: ${API_URL}/admin/queues`);
