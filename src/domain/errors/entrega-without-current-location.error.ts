import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaWithoutCurrentLocationError extends DomainRuleError {
    constructor() {
        super(
            'Delivery without a current location',
            'The current delivery location has not been determined.',
            '/entrega-sem-localizacao-atual'
        )
    }
}