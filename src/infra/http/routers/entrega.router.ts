import { Router } from "express";

import { createEntregaFactory } from "../../factories/create-entrega.factory"
import { despacharEntregaFactory } from "../../factories/despachar-entrega.factory";
import { concluirEntregaFactory } from "../../factories/concluir-entrega.factory";
import { listarHistoricoEntregaFactory } from "../../factories/listar-historico-entrega.factory";
import { atualizarLocalizacaoEntregaFactory } from "../../factories/atualizar-localizacao-entrega.factory";
import { despacharLoteEntregasFactory } from "../../factories/despachar-lote-entregas.factory";

import { verificarEntregadorMiddleware } from "../middlewares/verificar-entregador.middleware";
import { verificarDestinatarioMiddleware } from "../middlewares/verificar-destinatario.middleware";
import { uploadComprovanteEntrega } from "../middlewares/upload-comprovante-entrega.middleware";

const entregasRouter = Router();

const createEntregaController = createEntregaFactory();
const despacharEntregaController = despacharEntregaFactory();
const concluirEntregaController = concluirEntregaFactory();
const listarHistoricoEntregaController = listarHistoricoEntregaFactory();
const atualizarLocalizacaoEntregaController = atualizarLocalizacaoEntregaFactory();
const despacharLoteEntregasController = despacharLoteEntregasFactory();

entregasRouter.post("/", createEntregaController.handle);

entregasRouter.patch("/despachar-lote", verificarEntregadorMiddleware, despacharLoteEntregasController.handle);
entregasRouter.get("/:id/historico", verificarDestinatarioMiddleware, listarHistoricoEntregaController.handle);
entregasRouter.patch("/:id/despachar", verificarEntregadorMiddleware, despacharEntregaController.handle);
entregasRouter.patch("/:id/atualizar", verificarEntregadorMiddleware, atualizarLocalizacaoEntregaController.handle);
entregasRouter.patch("/:id/concluir", verificarEntregadorMiddleware, uploadComprovanteEntrega.single('comprovante'), concluirEntregaController.handle);

export { entregasRouter };