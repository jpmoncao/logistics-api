import { Router } from "express";

import { createEntregaFactory } from "../../factories/create-entrega.factory"
import { despacharEntregaFactory } from "../../factories/despachar-entrega.factory";
import { concluirEntregaFactory } from "../../factories/concluir-entrega.factory";

const entregasRouter = Router();

const createEntregaController = createEntregaFactory();
const despacharEntregaController = despacharEntregaFactory();
const concluirEntregaController = concluirEntregaFactory();

entregasRouter.post("/", createEntregaController.handle);
entregasRouter.patch("/:id/despachar", despacharEntregaController.handle);
entregasRouter.patch("/:id/concluir", concluirEntregaController.handle);

export { entregasRouter };