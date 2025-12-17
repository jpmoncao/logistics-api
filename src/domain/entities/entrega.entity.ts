import { DomainRuleError } from "../../core/errors/domain-rule.error";
import { UniqueEntityID } from '../../core/entities/unique-entity-id.entity';
import { AggregateRoot } from "../../core/entities/aggregate-root";

import { Movimentacao } from "./movimentacao.entity";

import { EntregaDespachadaEvent } from "../events/entrega-despachada.event";
import { EntregaConcluidaEvent } from "../events/entrega-concluida.event";

import { StatusEntrega } from "../types/entrega";

interface EntregaProps {
    status: StatusEntrega,
    movimentacoes?: Movimentacao[]
}

export class Entrega extends AggregateRoot {
    [x: string]: any;
    private _id: UniqueEntityID;
    private _status: StatusEntrega;
    private _movimentacoes: Movimentacao[];
    entrega: any;
    entrega: any;
    entrega: any;

    constructor(props: EntregaProps, id?: string) {
        super();
        this._id = new UniqueEntityID(id);
        this._status = props.status || StatusEntrega.PENDENTE;
        this._movimentacoes = props.movimentacoes || [];
    }

    get id() { return this._id.toString() };
    get status() { return this._status };
    get movimentacoes() { return [...this._movimentacoes] };

    public criarMovimentacao(descricao: string) {
        const movimentacao = new Movimentacao(descricao)
        this._movimentacoes.push(movimentacao);
    }

    public despachar() {
        if (this._status != StatusEntrega.PENDENTE)
            throw new DomainRuleError('Apenas entregas com status "PENDENTE" podem ser despachadas.');

        this._status = StatusEntrega.CAMINHO;
        this.criarMovimentacao('O pedido saiu para entrega!');

        this.addEvent(new EntregaDespachadaEvent(this));
    }

    public concluirEntrega() {
        if (this._status != StatusEntrega.CAMINHO)
            throw new DomainRuleError('Apenas entregas com status "CAMINHO" pode ser concluídas.');

        this._status = StatusEntrega.CONCLUIDO;
        this.criarMovimentacao('A entrega do pedido foi concluída!');

        this.addEvent(new EntregaConcluidaEvent(this));
    }
}