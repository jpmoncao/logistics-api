import { describe, it, expect } from 'vitest';
import { Entrega } from './entrega.entity';
import { StatusEntrega } from '../types/entrega';
import { DomainRuleError } from '../../core/errors/domain-rule.error';
import { EntregaDespachadaEvent } from '../events/entrega-despachada.event';
import { Movimentacao } from './movimentacao.entity';
import { EntregaConcluidaEvent } from '../events/entrega-concluida.event';
import { Coordenada } from '../value-objects/coordenada.value-object';

describe('Entrega Entity', () => {
    const coordenadaOrigemFake = new Coordenada(-1, -1);
    const coordenadaAtualizacaoFake = new Coordenada(0, 0);
    const coordenadaDestinoFake = new Coordenada(1, 1);

    it('deve criar a entrega com o status PENDENTE por padrão', () => {
        const entrega = new Entrega({
            status: undefined as any,
            destino: coordenadaDestinoFake
        });

        expect(entrega.status).toEqual(StatusEntrega.PENDENTE);
        expect(entrega.id).toBeDefined();
    });

    it('deve criar a entrega informando as coordenadas de destino', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        expect(entrega.destino.latitude).toEqual(1);
        expect(entrega.destino.longitude).toEqual(1);
        expect(entrega.id).toBeDefined();
    });

    it('deve mudar o status para CAMINHO ao despachar', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

        expect(entrega.status).toEqual(StatusEntrega.CAMINHO);
        expect(entrega.movimentacoes.length).toBe(1);
        expect(entrega.movimentacoes[0].descricao).toEqual('O pedido saiu para entrega!');
    });

    it('deve lançar DomainRuleError quando despachar uma entrega que não está pendente', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CONCLUIDO,
            destino: coordenadaDestinoFake
        });

        expect(() => {
            entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
        }).toThrow(DomainRuleError);

        expect(() => {
            entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
        }).toThrow('Apenas entregas com status "PENDENTE" podem ser despachadas.');
    });

    it('deve adicionar um EntregaDespachadaEvent ao despachar a entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

        expect(entrega.domainEvents[0].eventName).toEqual('EntregaDespachada');
    });

    it('deve atualizar a localização atual da entrega ao despachar a entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

        expect(entrega.localizacaoAtual?.latitude).toEqual(0);
        expect(entrega.localizacaoAtual?.longitude).toEqual(0);
    });

    it('deve mudar o status para CONCLUIDO ao concluir entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
            destino: coordenadaDestinoFake
        }, 'test_id');

        entrega.concluirEntrega();

        expect(entrega.status).toEqual(StatusEntrega.CONCLUIDO);
        expect(entrega.movimentacoes.length).toBe(2);
        expect(entrega.movimentacoes[1].descricao).toEqual('A entrega do pedido foi concluída!');
    });

    it('deve lançar DomainRuleError quando concluir uma entrega que não está à caminho', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        expect(() => {
            entrega.concluirEntrega();
        }).toThrow(DomainRuleError);

        expect(() => {
            entrega.concluirEntrega();
        }).toThrow('Apenas entregas com status "CAMINHO" pode ser concluídas.');
    });

    it('deve adicionar um EntregaConcluidaEvent ao concluir a entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
            destino: coordenadaDestinoFake
        }, 'test_id');

        entrega.concluirEntrega();

        expect(entrega.domainEvents[0].eventName).toEqual('EntregaConcluida');
    });

    it('deve adicionar uma movimetação com coordenadas caso haja uma atualização de posição', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!', coordenada: coordenadaOrigemFake })],
            destino: coordenadaDestinoFake
        }, 'test_id');

        entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

        expect(entrega.movimentacoes[1].descricao).toEqual(`O pedido está a ${coordenadaAtualizacaoFake.calcularDistancia(coordenadaDestinoFake)} km do destino.`);
        expect(entrega.movimentacoes[1].coordenada?.latitude).toEqual(0);
        expect(entrega.movimentacoes[1].coordenada?.longitude).toEqual(0);
    });

    it('deve manter o status como CAMINHO ao atualizar localização da entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!', coordenada: coordenadaOrigemFake })],
            destino: coordenadaDestinoFake
        }, 'test_id');

        entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

        expect(entrega.status).toEqual(StatusEntrega.CAMINHO);
    });

    it('deve lançar DomainRuleError quando atualizar a posição de uma entrega que não está à caminho', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        expect(() => {
            entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
        }).toThrow(DomainRuleError);

        expect(() => {
            entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
        }).toThrow('Apenas entregas com status "CAMINHO" podem ser receber atualizações do percurso.');
    });

    it('deve lançar DomainRuleError quando a posição de uma entrega se deslocou menos que 1km', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            localizacaoAtual: coordenadaOrigemFake,
            destino: coordenadaDestinoFake
        });

        expect(() => {
            entrega.atualizarLocalizacaoAtual(coordenadaOrigemFake.latitude, coordenadaOrigemFake.longitude);
        }).toThrow(DomainRuleError);

        expect(() => {
            entrega.atualizarLocalizacaoAtual((coordenadaOrigemFake.latitude), (coordenadaOrigemFake.longitude));
        }).toThrow('Não houve atualizações significativas no percurso dessa entrega.');
    });

    it('deve atualizar a localização atual da entrega ao atualizar a localização', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            localizacaoAtual: coordenadaOrigemFake,
            destino: coordenadaDestinoFake
        });

        entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

        expect(entrega.localizacaoAtual?.latitude).toEqual(0);
        expect(entrega.localizacaoAtual?.longitude).toEqual(0);
    });

    it('deve atualizar a localização atual da entrega ao despachar a entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE,
            destino: coordenadaDestinoFake
        });

        entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
        expect(entrega.localizacaoAtual?.latitude).toEqual(0);
        expect(entrega.localizacaoAtual?.longitude).toEqual(0);
    });

    it('deve atualizar a localização atual da entrega ao concluir a entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
            destino: coordenadaDestinoFake
        }, 'test_id');

        entrega.concluirEntrega();

        expect(entrega.localizacaoAtual?.latitude).toEqual(1);
        expect(entrega.localizacaoAtual?.longitude).toEqual(1);
    });
});