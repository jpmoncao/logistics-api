import { DomainRuleError } from "../../core/errors/domain-rule.error";
import { StatusEntrega } from "../types/entrega";

export class EntregaIsNotOnWayError extends DomainRuleError {
    constructor(currentStatus: StatusEntrega) {
        super(
            'Delivery is not on its way',
            'Only deliveries with the status "CAMINHO" can receive route updates.',
            '/entrega-nao-esta-a-caminho',
            { currentStatus }
        )
    }
}