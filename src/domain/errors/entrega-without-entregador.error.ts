import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaWithoutEntregadorError extends DomainRuleError {
    constructor() {
        super(
            'Delivery without a recipient',
            'The delivery requires a delivery person to be dispatched.',
            '/entrega-sem-entregador'
        )
    }
}