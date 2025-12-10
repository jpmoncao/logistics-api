import { Router } from "express";

import { createEntregaFactory } from "../../factories/create-entrega.factory"
import { despacharEntregaFactory } from "../../factories/despachar-entrega.factory";

const entregasRouter = Router();

const createEntregaController = createEntregaFactory();
const despacharEntregaController = despacharEntregaFactory();

entregasRouter.post("/", createEntregaController.handle);
entregasRouter.patch("/:id/despachar", despacharEntregaController.handle)

export { entregasRouter };