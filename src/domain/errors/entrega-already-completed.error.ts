import { StatusEntrega } from "@prisma/client";
import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaAlreadyCompletedError extends DomainRuleError {
    constructor(currentStatus: StatusEntrega) {
        super(
            'Delivery already completed',
            'Only deliveries with a "CAMINHO" status can be completed.',
            '/entrega-concluida',
            { currentStatus }
        )
    }
}