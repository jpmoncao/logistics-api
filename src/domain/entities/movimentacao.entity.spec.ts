import { describe, expect, it } from "vitest";
import { Movimentacao } from "./movimentacao.entity";
import { ValidationError } from "../../core/errors/validation.error";

describe('Movimentacao Entity', () => {
    it('deve criar um movimentação com a data e hora atual', () => {
        const movimentacao = new Movimentacao({ descricao: 'Teste movimentação' });

        expect(movimentacao.descricao).toEqual('Teste movimentação');
        expect(movimentacao.data).toBeInstanceOf(Date);
    });

    it('deve disparar um ValidationError ao criar descrição com menos de 5 caracteres', () => {
        expect(() => {
            new Movimentacao({ descricao: 'Test' });
        }).toThrow(ValidationError);
    })
});