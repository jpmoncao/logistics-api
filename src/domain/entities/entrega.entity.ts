import { DomainRuleError } from "../../core/errors/domain-rule.error";
import { UniqueEntityID } from '../../core/entities/unique-entity-id.entity';
import { AggregateRoot } from "../../core/entities/aggregate-root";

import { Movimentacao } from "./movimentacao.entity";
import { Coordenada } from "../value-objects/coordenada.value-object";

import { EntregaDespachadaEvent } from "../events/entrega-despachada.event";
import { EntregaConcluidaEvent } from "../events/entrega-concluida.event";

import { StatusEntrega } from "../types/entrega";

interface EntregaProps {
    status: StatusEntrega;
    movimentacoes?: Movimentacao[];
    localizacaoAtual?: Coordenada;
    destino: Coordenada;
    entregadorId?: string;
}

export class Entrega extends AggregateRoot {
    private _id: UniqueEntityID;
    private _status: StatusEntrega;
    private _movimentacoes: Movimentacao[];
    private _localizacaoAtual?: Coordenada;
    private _destino: Coordenada;
    private _entregadorId?: string;

    constructor(props: EntregaProps, id?: string) {
        super();
        this._id = new UniqueEntityID(id);
        this._status = props.status || StatusEntrega.PENDENTE;
        this._movimentacoes = props.movimentacoes || [];
        this._localizacaoAtual = props.localizacaoAtual;
        this._destino = props.destino;

        // Relacionamento com Entregador (opcional)
        this._entregadorId = props.entregadorId;
    }

    get id() { return this._id.toString() };
    get status() { return this._status };
    get movimentacoes() { return [...this._movimentacoes] };
    get localizacaoAtual() { return this._localizacaoAtual };
    get destino() { return this._destino };
    get entregadorId() { return this._entregadorId };

    private criarMovimentacaoEntrega(descricao: string) {
        const movimentacao = new Movimentacao({
            descricao,
            coordenada: this._localizacaoAtual
        });

        this._movimentacoes.push(movimentacao);
    }

    public despachar(latitude: number, longitude: number) {
        if (this._status != StatusEntrega.PENDENTE)
            throw new DomainRuleError('Apenas entregas com status "PENDENTE" podem ser despachadas.');

        if (!this._entregadorId)
            throw new DomainRuleError('A entrega precisa ter um entregador atribuído.');

        this._localizacaoAtual = new Coordenada(latitude, longitude);

        this._status = StatusEntrega.CAMINHO;
        this.criarMovimentacaoEntrega('O pedido saiu para entrega!');

        this.addEvent(new EntregaDespachadaEvent(this));
    }

    public concluirEntrega() {
        if (this._status != StatusEntrega.CAMINHO)
            throw new DomainRuleError('Apenas entregas com status "CAMINHO" pode ser concluídas.');

        if (!this._entregadorId)
            throw new DomainRuleError('A entrega precisa ter um entregador atribuído.');

        this._localizacaoAtual = new Coordenada(this.destino.latitude, this.destino.longitude);

        this._status = StatusEntrega.CONCLUIDO;
        this.criarMovimentacaoEntrega('A entrega do pedido foi concluída!');

        this.addEvent(new EntregaConcluidaEvent(this));
    }

    public atualizarLocalizacaoAtual(latitude: number, longitude: number) {
        if (this._status != StatusEntrega.CAMINHO)
            throw new DomainRuleError('Apenas entregas com status "CAMINHO" podem ser receber atualizações do percurso.');

        if (!this._entregadorId)
            throw new DomainRuleError('A entrega precisa ter um entregador atribuído.');

        const coordenada = new Coordenada(latitude, longitude);

        if (!!this._localizacaoAtual && this._localizacaoAtual.calcularDistancia(coordenada) < 1)
            throw new DomainRuleError('Não houve atualizações significativas no percurso dessa entrega.');

        this._localizacaoAtual = coordenada;

        this.criarMovimentacaoEntrega(`O pedido está a ${this.calcularDistanciaAtualParaDestino()} km do destino.`);
    }

    private calcularDistanciaAtualParaDestino() {
        if (!this._localizacaoAtual)
            throw new DomainRuleError('A localização atual da entrega não foi definida.');

        return this._localizacaoAtual.calcularDistancia(this._destino);
    }

    public atribuirEntregador(entregadorId: string) {
        this._entregadorId = entregadorId;
    }
}