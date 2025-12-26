import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaOutsideCompletionRadiusError extends DomainRuleError {
    constructor(currentDistance: string) {
        super(
            'Delivery outside the completion radius',
            'Delivery must be made within a 1 km radius of the destination.',
            '/entrega-fora-do-raio-entrega',
            { currentDistance }
        )
    }
}