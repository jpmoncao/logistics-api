import { Router } from "express";

import { createEntregadorFactory } from "../../factories/create-entregador.factory"
import { autenticarEntregadorFactory } from "../../factories/autenticar-entregador.factory";
import { atualizarLocalizacaoEntregadorFactory } from "../../factories/atualizar-localizacao-entregador.factory";

import { verificarEntregadorMiddleware } from "../middleware/verificar-entregador.middleware";

const entregadoresRouter = Router();

const createEntregadorController = createEntregadorFactory();
const autenticarEntregadorController = autenticarEntregadorFactory();
const atualizarLocalizacaoEntregadorController = atualizarLocalizacaoEntregadorFactory();

entregadoresRouter.post("/", createEntregadorController.handle);
entregadoresRouter.post("/login", autenticarEntregadorController.handle);
entregadoresRouter.post("/me", verificarEntregadorMiddleware, atualizarLocalizacaoEntregadorController.handle);

export { entregadoresRouter };
