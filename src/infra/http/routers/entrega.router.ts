import { Router } from "express";

import { createEntregaFactory } from "../../factories/create-entrega-factory"

const entregasRouter = Router();

const createEntregaController = createEntregaFactory();

entregasRouter.post("/", createEntregaController.handle);

export { entregasRouter };