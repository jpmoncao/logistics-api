import { createRouteGroup } from "../../../core/base/router-group";

import { createEntregadorFactory } from "../../factories/create-entregador.factory"
import { autenticarEntregadorFactory } from "../../factories/autenticar-entregador.factory";
import { atualizarLocalizacaoEntregadorFactory } from "../../factories/atualizar-localizacao-entregador.factory";
import { buscarEntregasProximasFactory } from "../../factories/buscar-entregas-proximas.factory";

import { verificarAutentificacaoMiddleware } from "../middlewares/verificar-autentificacao.middleware";
import { verificarEntregadorMiddleware } from "../middlewares/verificar-entregador.middleware";

const group = createRouteGroup('/entregadores');

const createEntregadorController = createEntregadorFactory();
const autenticarEntregadorController = autenticarEntregadorFactory();
const atualizarLocalizacaoEntregadorController = atualizarLocalizacaoEntregadorFactory();
const buscarEntregasProximasController = buscarEntregasProximasFactory();

group.route('post', "/", createEntregadorController);
group.route('post', "/login", autenticarEntregadorController);
group.route('post', "/me", atualizarLocalizacaoEntregadorController, verificarAutentificacaoMiddleware, verificarEntregadorMiddleware);
group.route('get', "/entregas-proximas", buscarEntregasProximasController, verificarAutentificacaoMiddleware, verificarEntregadorMiddleware);

const entregadoresRouter = group.router;
export { entregadoresRouter };
