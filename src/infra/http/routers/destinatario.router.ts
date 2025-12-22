import { Router } from "express";

import { createDestinatarioFactory } from "../../factories/create-destinatario.factory"
import { autenticarDestinatarioFactory } from "../../factories/autenticar-destinatario.factory";

const destinatariosRouter = Router();

const createDestinatarioController = createDestinatarioFactory();
const autenticarDestinatarioController = autenticarDestinatarioFactory();

destinatariosRouter.post("/", createDestinatarioController.handle);
destinatariosRouter.post("/login", autenticarDestinatarioController.handle);

export { destinatariosRouter };
