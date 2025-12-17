import { Router } from "express";

import { createEntregaFactory } from "../../factories/create-entrega.factory"
import { despacharEntregaFactory } from "../../factories/despachar-entrega.factory";
import { concluirEntregaFactory } from "../../factories/concluir-entrega.factory";
import { listarHistoricoEntregaFactory } from "../../factories/listar-historico-entrega.factory";

const entregasRouter = Router();

const createEntregaController = createEntregaFactory();
const despacharEntregaController = despacharEntregaFactory();
const concluirEntregaController = concluirEntregaFactory();
const listarHistoricoEntregaController = listarHistoricoEntregaFactory();

entregasRouter.post("/", createEntregaController.handle);
entregasRouter.patch("/:id/despachar", despacharEntregaController.handle);
entregasRouter.patch("/:id/concluir", concluirEntregaController.handle);
entregasRouter.get("/:id/historico", listarHistoricoEntregaController.handle);

export { entregasRouter };