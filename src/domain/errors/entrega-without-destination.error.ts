import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaWithoutDestinationError extends DomainRuleError {
    constructor() {
        super(
            'Delivery without a destination',
            'The delivery has no destination.',
            '/entrega-sem-destino'
        )
    }
}