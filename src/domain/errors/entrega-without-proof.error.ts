import { DomainRuleError } from "../../core/errors/domain-rule.error";

export class EntregaWithoutProofError extends DomainRuleError {
    constructor() {
        super(
            'Delivery without proof of delivery.',
            'To prove delivery, please attach a photo of the delivery proof.',
            '/entrega-sem-comprovante-entrega'
        )
    }
}