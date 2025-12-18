import { Router } from "express";

import { createEntregadorFactory } from "../../factories/create-entregador.factory"

const entregadoresRouter = Router();

const createEntregadorController = createEntregadorFactory();

entregadoresRouter.post("/", createEntregadorController.handle);

export { entregadoresRouter };
