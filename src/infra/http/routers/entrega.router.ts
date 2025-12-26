import { createRouteGroup } from "../../../core/base/router-group";

import { createEntregaFactory } from "../../factories/create-entrega.factory"
import { despacharEntregaFactory } from "../../factories/despachar-entrega.factory";
import { concluirEntregaFactory } from "../../factories/concluir-entrega.factory";
import { listarHistoricoEntregaFactory } from "../../factories/listar-historico-entrega.factory";
import { atualizarLocalizacaoEntregaFactory } from "../../factories/atualizar-localizacao-entrega.factory";
import { despacharLoteEntregasFactory } from "../../factories/despachar-lote-entregas.factory";

import { verificarAutentificacaoMiddleware } from "../middlewares/verificar-autentificacao.middleware";
import { verificarEntregadorMiddleware } from "../middlewares/verificar-entregador.middleware";
import { verificarDestinatarioMiddleware } from "../middlewares/verificar-destinatario.middleware";
import { uploadComprovanteEntrega } from "../middlewares/upload-comprovante-entrega.middleware";

const group = createRouteGroup('/entregas');

const createEntregaController = createEntregaFactory();
const despacharEntregaController = despacharEntregaFactory();
const concluirEntregaController = concluirEntregaFactory();
const listarHistoricoEntregaController = listarHistoricoEntregaFactory();
const atualizarLocalizacaoEntregaController = atualizarLocalizacaoEntregaFactory();
const despacharLoteEntregasController = despacharLoteEntregasFactory();

group.route('post', "/", createEntregaController);
group.route('patch', "/despachar-lote", despacharLoteEntregasController, verificarAutentificacaoMiddleware, verificarEntregadorMiddleware);
group.route('get', "/:id/historico", listarHistoricoEntregaController, verificarAutentificacaoMiddleware, verificarDestinatarioMiddleware);
group.route('patch', "/:id/despachar", despacharEntregaController, verificarAutentificacaoMiddleware, verificarEntregadorMiddleware);
group.route('patch', "/:id/atualizar-localizacao", atualizarLocalizacaoEntregaController, verificarAutentificacaoMiddleware, verificarEntregadorMiddleware);
group.route('patch', "/:id/concluir", concluirEntregaController, verificarAutentificacaoMiddleware, verificarEntregadorMiddleware, uploadComprovanteEntrega.single('comprovante'));

const entregasRouter = group.router;
export { entregasRouter };