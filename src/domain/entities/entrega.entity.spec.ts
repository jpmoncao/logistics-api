import { describe, it, expect } from 'vitest';
import { Entrega } from './entrega.entity';
import { StatusEntrega } from '../types/entrega';
import { DomainRuleError } from '../../core/errors/domain-rule.error';

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

});