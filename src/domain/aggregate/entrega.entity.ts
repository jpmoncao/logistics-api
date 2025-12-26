import { UniqueEntityID } from '../../core/entities/unique-entity-id.entity';
import { EntityEvent } from "../../core/entities/entity-event";
import { StatusEntrega } from "../types/entrega";

import { Movimentacao } from "../entities/movimentacao.entity";
import { Coordenada } from "../value-objects/coordenada.value-object";

import { EntregaDespachadaEvent } from "../events/entrega-despachada.event";
import { EntregaConcluidaEvent } from "../events/entrega-concluida.event";

import { EntregaAlreadyDispatchedError } from "../errors/entrega-already-dispatched.error";
import { EntregaWithoutEntregadorError } from '../errors/entrega-without-entregador.error';
import { EntregaAlreadyCompletedError } from '../errors/entrega-already-completed.error';
import { EntregaWithoutProofError } from '../errors/entrega-without-proof.error';
import { EntregaOutsideCompletionRadiusError } from '../errors/entrega-outside-completion-radius.error';
import { EntregaIsNotOnWayError } from '../errors/entrega-is-not-on-way';
import { EntregaDidNotMoveError } from '../errors/entrega-did-not-move.error';
import { EntregaWithoutCurrentLocationError } from '../errors/entrega-without-current-location.error';
import { EntregaWithoutDestinationError } from '../errors/entrega-without-destination.error';

interface EntregaProps {
    status: StatusEntrega;
    localizacaoAtual?: Coordenada;
    destino: Coordenada;
    urlComprovanteEntrega?: string;
    movimentacoes?: Movimentacao[];
    destinatarioId: string;
    entregadorId?: string;
}

export class Entrega extends EntityEvent {
    private _id: UniqueEntityID;
    private _status: StatusEntrega;
    private _localizacaoAtual?: Coordenada;
    private _destino: Coordenada;
    private _urlComprovanteEntrega?: string;
    private _movimentacoes: Movimentacao[];
    private _destinatarioId: string;
    private _entregadorId?: string;

    get id() { return this._id.toString() };
    get status() { return this._status };
    get localizacaoAtual() { return this._localizacaoAtual };
    get destino() { return this._destino };
    get distanciaAtualParaDestino() { return this._localizacaoAtual.calcularDistancia(this._destino) }
    get urlComprovanteEntrega() { return this._urlComprovanteEntrega };
    get movimentacoes() { return [...this._movimentacoes] };
    get destinatarioId() { return this._destinatarioId };
    get entregadorId() { return this._entregadorId };

    constructor(props: EntregaProps, id?: string) {
        super();
        this._id = new UniqueEntityID(id);
        this._status = props.status || StatusEntrega.PENDENTE;
        this._localizacaoAtual = props.localizacaoAtual;
        this._destino = props.destino;
        this._urlComprovanteEntrega = props.urlComprovanteEntrega;
        this._movimentacoes = props.movimentacoes || [];
        this._destinatarioId = props.destinatarioId;

        // Relacionamento com Entregador (opcional)
        this._entregadorId = props.entregadorId;
    }

    private criarMovimentacaoEntrega(descricao: string) {
        const movimentacao = new Movimentacao({
            descricao,
            coordenada: this._localizacaoAtual
        });

        this._movimentacoes.push(movimentacao);
    }

    public despachar(latitude: number, longitude: number) {
        if (this._status != StatusEntrega.PENDENTE)
            throw new EntregaAlreadyDispatchedError(this._status)

        if (!this._entregadorId)
            throw new EntregaWithoutEntregadorError();

        this._localizacaoAtual = new Coordenada(latitude, longitude);

        this._status = StatusEntrega.CAMINHO;
        this.criarMovimentacaoEntrega('O pedido saiu para entrega!');

        this.addEvent(new EntregaDespachadaEvent(this));
    }

    public concluirEntrega() {
        if (this._status != StatusEntrega.CAMINHO)
            throw new EntregaAlreadyCompletedError(this._status);

        if (!this._entregadorId)
            throw new EntregaWithoutEntregadorError();

        if (!this._urlComprovanteEntrega)
            throw new EntregaWithoutProofError();

        const distanciaAtualParaDestino = this.calcularDistanciaAtualParaDestino();
        if (distanciaAtualParaDestino > 1)
            throw new EntregaOutsideCompletionRadiusError(distanciaAtualParaDestino + ' km');

        this._localizacaoAtual = new Coordenada(this.destino.latitude, this.destino.longitude);

        this._status = StatusEntrega.CONCLUIDO;
        this.criarMovimentacaoEntrega('A entrega do pedido foi concluída!');

        this.addEvent(new EntregaConcluidaEvent(this));
    }

    public atualizarLocalizacaoAtual(latitude: number, longitude: number) {
        if (this._status != StatusEntrega.CAMINHO)
            throw new EntregaIsNotOnWayError(this._status);

        if (!this._entregadorId)
            throw new EntregaWithoutEntregadorError();

        const coordenada = new Coordenada(latitude, longitude);

        if (!this.houveDeslocamentoEntrega(coordenada))
            throw new EntregaDidNotMoveError();

        this._localizacaoAtual = coordenada;

        const distancia = this.calcularDistanciaAtualParaDestino();

        if (this.entregaEstaNasRedondezasDestino(distancia)) {
            this.criarMovimentacaoEntrega(`O pedido está nas redondezas do destino.`);
            return;
        }

        this.criarMovimentacaoEntrega(`O pedido está a ${distancia} km do destino.`);
    }

    private calcularDistanciaAtualParaDestino() {
        if (!this._localizacaoAtual)
            throw new EntregaWithoutCurrentLocationError();

        if (!this._destino)
            throw new EntregaWithoutDestinationError();

        return this._localizacaoAtual.calcularDistancia(this._destino);
    }

    public atribuirEntregador(entregadorId: string) {
        this._entregadorId = entregadorId;
    }

    public anexarComprovanteEntrega(urlComprovanteEntrega: string) {
        this._urlComprovanteEntrega = urlComprovanteEntrega;
    }

    public houveDeslocamentoEntrega(coordenada: Coordenada): boolean {
        return this._localizacaoAtual && this._localizacaoAtual.calcularDistancia(coordenada) >= 1
    }

    public entregaEstaNasRedondezasDestino(distancia: number): boolean {
        return distancia < 1;
    }
}