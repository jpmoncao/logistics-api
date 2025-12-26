import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaDidNotMoveError extends DomainRuleError {
    constructor() {
        super(
            'Delivery did not move',
            'There have been no significant updates to the route of this delivery.',
            '/entrega-nao-se-deslocou'
        )
    }
}