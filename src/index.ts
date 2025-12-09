import express from "express";
import cors from 'cors';
import { entregasRouter } from "./infra/http/routers/entrega.router";

// Configurações da API
const PORT = '5000';

// Instância do Express
const app = express();

// Instâncias de uso do Express
app.use(express.json());
app.use(cors());

// Rotas da aplicação
app.use('/entregas', entregasRouter);

app.listen(
    PORT,
    () => { console.log('API is running: http://localhost:' + PORT) }
);
