import { Entrega } from "../../../domain/entities/entrega.entity";

interface EntregaHTTP {
    id_entrega: string;
    status: string;
    movimentacoes: { data: string, descricao: string }[]
}

export class EntregaPresenter {
    static toHTTP(entrega: Entrega): EntregaHTTP {
        return {
            id_entrega: entrega.id,
            status: entrega.status,
            movimentacoes: entrega.movimentacoes
                .sort((a, b) => {
                    return b.data.getTime() - a.data.getTime()
                }).map(m => ({
                    data: m.data.toISOString(),
                    descricao: m.descricao
                }))
        }
    }
}