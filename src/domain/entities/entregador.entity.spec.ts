import { describe, it, expect } from "vitest";

import { Entregador } from "./entregador.entity";

describe('Entregador Entity', () => {
    const entregadorDataFake = {
        nome: 'João Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 99988-7766',
        email: 'joao.silva@example.com',
        senha: 'Senha123!'
    };

    it('deve criar um entregador com as propriedades corretas', () => {
        const entregador = new Entregador(entregadorDataFake);

        expect(entregador.nome).toEqual('João Silva');
        expect(entregador.cpf).toEqual('123.456.789-00');
        expect(entregador.telefone).toEqual('(11) 99988-7766');
        expect(entregador.email).toEqual('joao.silva@example.com');
        expect(entregador.senha).toEqual('Senha123!');
    });

    it('deve criar um entregador com ID fornecido', () => {
        const entregador = new Entregador(entregadorDataFake, 'custom-id-123');

        expect(entregador.id).toEqual('custom-id-123');
    });
});