import dotenv from 'dotenv'
import express from "express";
import cors from 'cors';

import { entregasRouter } from "./infra/http/routers/entrega.router";
import { entregadoresRouter } from "./infra/http/routers/entregador.router";
import { destinatariosRouter } from "./infra/http/routers/destinatario.router";

dotenv.config({ quiet: true });

// Configurações da API
const PORT = process.env.API_PORT ?? '5000';
const API_URL = 'http://localhost:' + PORT;

// Instância do Express
const app = express();

// Instâncias de uso do Express
app.use(express.json());
app.use(cors());

// Rotas da aplicação
app.use('/entregas', entregasRouter);
app.use('/entregadores', entregadoresRouter);
app.use('/destinatarios', destinatariosRouter);

app.listen(
    PORT,
    () => { console.log('API is running: ' + API_URL) }
);
