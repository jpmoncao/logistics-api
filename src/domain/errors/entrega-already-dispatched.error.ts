import { StatusEntrega } from "@prisma/client";
import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaAlreadyDispatchedError extends DomainRuleError {
    constructor(currentStatus: StatusEntrega) {
        super(
            'Delivery already dispatched',
            'Only deliveries with a "PENDENTE" status can be dispatched.',
            '/entrega-despachada',
            { currentStatus }
        )
    }
}