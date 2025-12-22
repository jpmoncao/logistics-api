import { Router } from "express";

import { createDestinatarioFactory } from "../../factories/create-destinatario.factory"

const destinatariosRouter = Router();

const createDestinatarioController = createDestinatarioFactory();

destinatariosRouter.post("/", createDestinatarioController.handle);

export { destinatariosRouter };
