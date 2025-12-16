import { describe, it, expect } from 'vitest';
import { Entrega } from './entrega.entity';
import { StatusEntrega } from '../types/entrega';
import { DomainRuleError } from '../../core/errors/domain-rule.error';
import { EntregaDespachadaEvent } from '../events/entrega-despachada.event';
import { Movimentacao } from './movimentacao.entity';
import { EntregaConcluidaEvent } from '../events/entrega-concluida.event';

describe('Entrega Entity', () => {

    it('deve criar a entrega com o status PENDENTE por padrão', () => {
        const entrega = new Entrega({
            status: undefined as any
        });

        expect(entrega.status).toEqual(StatusEntrega.PENDENTE);
        expect(entrega.id).toBeDefined();
    });

    it('deve mudar o status para CAMINHO ao despachar', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE
        });

        entrega.despachar();

        expect(entrega.status).toEqual(StatusEntrega.CAMINHO);
        expect(entrega.movimentacoes.length).toBe(1);
        expect(entrega.movimentacoes[0].props.descricao).toEqual('O pedido saiu para entrega!');
    });

    it('deve lançar DomainRuleError quando despachar uma entrega que não está pendente', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CONCLUIDO
        });

        expect(() => {
            entrega.despachar();
        }).toThrow(DomainRuleError);

        expect(() => {
            entrega.despachar();
        }).toThrow('Apenas entregas com status "PENDENTE" podem ser despachadas.');
    });

    it('deve adicionar um EntregaDespachadaEvent ao despachar a entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE
        });

        entrega.despachar();

        expect(entrega.domainEvents[0].eventName).toEqual(EntregaDespachadaEvent.eventName);
    });

    it('deve mudar o status para CONCLUIDO ao concluir entrega', () => {
        const entrega = new Entrega({
            status: StatusEntrega.CAMINHO,
            movimentacoes: [new Movimentacao('O pedido saiu para entrega!')]
        }, 'test_id');

        entrega.concluirEntrega();

        expect(entrega.status).toEqual(StatusEntrega.CONCLUIDO);
        expect(entrega.movimentacoes.length).toBe(2);
        expect(entrega.movimentacoes[1].props.descricao).toEqual('A entrega do pedido foi concluída!');
    });

    it('deve lançar DomainRuleError quando concluir uma entrega que não está à caminho', () => {
        const entrega = new Entrega({
            status: StatusEntrega.PENDENTE
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
            movimentacoes: [new Movimentacao('O pedido saiu para entrega!')]
        }, 'test_id');

        entrega.concluirEntrega();

        expect(entrega.domainEvents[0].eventName).toEqual(EntregaConcluidaEvent.eventName);
    });
});