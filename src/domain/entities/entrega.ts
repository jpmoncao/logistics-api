import { UniqueEntityID } from '../../core/entities/unique-entity-id';
import { StatusEntrega } from "../types/entrega";

import { Movimentacao } from "./movimentacao";

interface EntregaProps {
    status: StatusEntrega,
    movimentacoes?: Movimentacao[]
}

export class Entrega {
    private _id: UniqueEntityID;
    private _status: StatusEntrega;
    private _movimentacoes: Movimentacao[];

    constructor(props: EntregaProps, id?: string) {
        this._id = new UniqueEntityID(id);
        this._status = props.status || StatusEntrega.PENDENTE;
        this._movimentacoes = props.movimentacoes || [];
    }

    get id() { return this._id.toString() };
    get status() { return this._status };
    get movimentacoes() { return this._movimentacoes };

    public criarMovimentacao(descricao: string) {
        const movimentacao = new Movimentacao(descricao)
        this.movimentacoes.push(movimentacao);
    }

    public despachar() {
        if (this._status != StatusEntrega.PENDENTE)
            throw new Error('A entrega precisar estar PENDENTE para sair para entrega!');

        this._status = StatusEntrega.CAMINHO;
        this.criarMovimentacao('O pedido saiu para entrega!');
    }
}