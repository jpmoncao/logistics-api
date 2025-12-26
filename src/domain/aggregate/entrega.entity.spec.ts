import { describe, it, expect } from 'vitest';
import { Entrega } from './entrega.entity';
import { StatusEntrega } from '../types/entrega';
import { Movimentacao } from '../entities/movimentacao.entity';
import { Coordenada } from '../value-objects/coordenada.value-object';

import { EntregaAlreadyDispatchedError } from "../errors/entrega-already-dispatched.error";
import { EntregaWithoutEntregadorError } from '../errors/entrega-without-entregador.error';
import { EntregaAlreadyCompletedError } from '../errors/entrega-already-completed.error';
import { EntregaWithoutProofError } from '../errors/entrega-without-proof.error';
import { EntregaOutsideCompletionRadiusError } from '../errors/entrega-outside-completion-radius.error';
import { EntregaIsNotOnWayError } from '../errors/entrega-is-not-on-way';
import { EntregaDidNotMoveError } from '../errors/entrega-did-not-move.error';

describe('Entrega Entity', () => {
    const coordenadaOrigemFake = new Coordenada(-1, -1);
    const coordenadaAtualizacaoFake = new Coordenada(0, 0);
    const coordenadaDestinoFake = new Coordenada(1, 1);
    const entregadorIdFake = 'entregador_123';
    const destinatarioIdFake = 'destinatario_123';
    const urlComprovanteFake = './comprovante.jpg';

    describe('Criação', () => {
        it('deve criar entrega com os atributos fornecidos', () => {
            const entrega = new Entrega({
                status: StatusEntrega.PENDENTE,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            expect(entrega.status).toEqual(StatusEntrega.PENDENTE);
            expect(entrega.destino.latitude).toEqual(1);
            expect(entrega.destino.longitude).toEqual(1);
            expect(entrega.entregadorId).toEqual(entregadorIdFake);
            expect(entrega.destinatarioId).toEqual(destinatarioIdFake);
            expect(entrega.id).toBeDefined();
        });

        it('deve criar a entrega com o status PENDENTE por padrão', () => {
            const entrega = new Entrega({
                status: undefined as any,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            expect(entrega.status).toEqual(StatusEntrega.PENDENTE);
            expect(entrega.id).toBeDefined();
        });
    });

    describe('Despacho (despachar)', () => {
        it('deve mudar o status para CAMINHO ao despachar', () => {
            const entrega = new Entrega({
                status: StatusEntrega.PENDENTE,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

            expect(entrega.status).toEqual(StatusEntrega.CAMINHO);
            expect(entrega.movimentacoes.length).toBe(1);
            expect(entrega.movimentacoes[0].descricao).toEqual('O pedido saiu para entrega!');
        });

        it('deve atualizar a localização atual da entrega ao despachar', () => {
            const entrega = new Entrega({
                status: StatusEntrega.PENDENTE,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

            expect(entrega.localizacaoAtual?.latitude).toEqual(0);
            expect(entrega.localizacaoAtual?.longitude).toEqual(0);
        });

        it('deve adicionar um EntregaDespachadaEvent ao despachar a entrega', () => {
            const entrega = new Entrega({
                status: StatusEntrega.PENDENTE,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

            expect(entrega.domainEvents[0].eventName).toEqual('EntregaDespachada');
        });

        describe('Regras de Validação', () => {
            it('deve lançar EntregaWithoutEntregadorError quando despachar uma entrega que não tem entregador atribuído', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.PENDENTE,
                    destino: coordenadaDestinoFake,
                    destinatarioId: destinatarioIdFake
                });

                expect(() => {
                    entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
                }).toThrow(EntregaWithoutEntregadorError);
            });

            it('deve lançar EntregaAlreadyDispatchedError quando despachar uma entrega que não está pendente', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.CONCLUIDO,
                    destino: coordenadaDestinoFake,
                    entregadorId: entregadorIdFake,
                    destinatarioId: destinatarioIdFake
                });

                expect(() => {
                    entrega.despachar(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
                }).toThrow(EntregaAlreadyDispatchedError);
            });
        });
    });

    describe('Atualização de Localização (atualizarLocalizacaoAtual)', () => {
        it('deve adicionar uma movimentação com coordenadas e distância calculada', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!', coordenada: coordenadaOrigemFake })],
                localizacaoAtual: coordenadaOrigemFake,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            }, 'test_id');

            entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

            expect(entrega.movimentacoes[1].descricao).toEqual(`O pedido está a ${coordenadaAtualizacaoFake.calcularDistancia(coordenadaDestinoFake)} km do destino.`);
            expect(entrega.movimentacoes[1].coordenada?.latitude).toEqual(0);
            expect(entrega.movimentacoes[1].coordenada?.longitude).toEqual(0);
        });

        it('deve manter o status como CAMINHO ao atualizar localização', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!', coordenada: coordenadaOrigemFake })],
                localizacaoAtual: coordenadaOrigemFake,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            }, 'test_id');

            entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

            expect(entrega.status).toEqual(StatusEntrega.CAMINHO);
        });

        it('deve atualizar a propriedade localizacaoAtual na entidade', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                localizacaoAtual: coordenadaOrigemFake,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);

            expect(entrega.localizacaoAtual?.latitude).toEqual(0);
            expect(entrega.localizacaoAtual?.longitude).toEqual(0);
        });

        it('deve criar uma movimentação "nas redondezas" quando estiver muito próximo do destino', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                localizacaoAtual: coordenadaOrigemFake,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                destinatarioId: destinatarioIdFake
            });

            // Simulando chegar exatamente no destino ou muito perto
            entrega.atualizarLocalizacaoAtual(coordenadaDestinoFake.latitude, coordenadaDestinoFake.longitude);

            expect(entrega.localizacaoAtual?.latitude).toEqual(1);
            expect(entrega.localizacaoAtual?.longitude).toEqual(1);
            expect(entrega.movimentacoes[0].descricao).toEqual('O pedido está nas redondezas do destino.');
        });

        describe('Regras de Validação', () => {
            it('deve lançar EntregaIsNotOnWayError quando atualizar a posição de uma entrega que não está à caminho', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.PENDENTE,
                    destino: coordenadaDestinoFake,
                    entregadorId: entregadorIdFake,
                    destinatarioId: destinatarioIdFake
                });

                expect(() => {
                    entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
                }).toThrow(EntregaIsNotOnWayError);
            });

            it('deve lançar EntregaWithoutEntregadorError quando atualizar a posição de uma entrega sem entregador', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.CAMINHO,
                    destino: coordenadaDestinoFake,
                    destinatarioId: destinatarioIdFake
                });

                expect(() => {
                    entrega.atualizarLocalizacaoAtual(coordenadaAtualizacaoFake.latitude, coordenadaAtualizacaoFake.longitude);
                }).toThrow(EntregaWithoutEntregadorError);
            });

            it('deve lançar EntregaDidNotMoveError quando o deslocamento for insignificante (< 1km)', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.CAMINHO,
                    localizacaoAtual: coordenadaOrigemFake,
                    destino: coordenadaDestinoFake,
                    entregadorId: entregadorIdFake,
                    destinatarioId: destinatarioIdFake
                });

                // Tenta atualizar para a mesma coordenada ou muito perto
                expect(() => {
                    entrega.atualizarLocalizacaoAtual(coordenadaOrigemFake.latitude, coordenadaOrigemFake.longitude);
                }).toThrow(EntregaDidNotMoveError);
            });
        });
    });

    describe('Conclusão (concluirEntrega)', () => {
        it('deve mudar o status para CONCLUIDO ao concluir entrega', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
                localizacaoAtual: coordenadaDestinoFake, // Importante estar no destino
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                urlComprovanteEntrega: urlComprovanteFake,
                destinatarioId: destinatarioIdFake
            }, 'test_id');

            entrega.concluirEntrega();

            expect(entrega.status).toEqual(StatusEntrega.CONCLUIDO);
            expect(entrega.movimentacoes.length).toBe(2);
            expect(entrega.movimentacoes[1].descricao).toEqual('A entrega do pedido foi concluída!');
        });

        it('deve adicionar um EntregaConcluidaEvent ao concluir a entrega', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
                localizacaoAtual: coordenadaDestinoFake,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                urlComprovanteEntrega: urlComprovanteFake,
                destinatarioId: destinatarioIdFake
            }, 'test_id');

            entrega.concluirEntrega();

            expect(entrega.domainEvents[0].eventName).toEqual('EntregaConcluida');
        });

        // Nota: Este teste pode parecer redundante se a localização já for o destino,
        // mas garante que o método não "reseta" a localização.
        it('deve manter/garantir a localização atual correta ao concluir', () => {
            const entrega = new Entrega({
                status: StatusEntrega.CAMINHO,
                movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
                localizacaoAtual: coordenadaDestinoFake,
                destino: coordenadaDestinoFake,
                entregadorId: entregadorIdFake,
                urlComprovanteEntrega: urlComprovanteFake,
                destinatarioId: destinatarioIdFake
            }, 'test_id');

            entrega.concluirEntrega();

            expect(entrega.localizacaoAtual?.latitude).toEqual(1);
            expect(entrega.localizacaoAtual?.longitude).toEqual(1);
        });

        describe('Regras de Validação', () => {
            it('deve lançar EntregaAlreadyCompletedError quando concluir uma entrega que não está à caminho', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.PENDENTE,
                    destino: coordenadaDestinoFake,
                    destinatarioId: destinatarioIdFake
                });

                expect(() => {
                    entrega.concluirEntrega();
                }).toThrow(EntregaAlreadyCompletedError);
            });

            it('deve lançar EntregaWithoutEntregadorError quando concluir sem entregador', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.CAMINHO,
                    destino: coordenadaDestinoFake,
                    destinatarioId: destinatarioIdFake
                });

                expect(() => {
                    entrega.concluirEntrega();
                }).toThrow(EntregaWithoutEntregadorError);
            });

            it('deve lançar EntregaOutsideCompletionRadiusError quando concluir uma entrega longe do destino', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.CAMINHO,
                    movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
                    localizacaoAtual: coordenadaOrigemFake, // Longe do destino
                    destino: coordenadaDestinoFake,
                    entregadorId: entregadorIdFake,
                    urlComprovanteEntrega: urlComprovanteFake,
                    destinatarioId: destinatarioIdFake
                }, 'test_id');

                expect(() => {
                    entrega.concluirEntrega();
                }).toThrow(EntregaOutsideCompletionRadiusError);
            });

            it('deve lançar EntregaWithoutProofError quando concluir sem comprovante de entrega', () => {
                const entrega = new Entrega({
                    status: StatusEntrega.CAMINHO,
                    movimentacoes: [new Movimentacao({ descricao: 'O pedido saiu para entrega!' })],
                    localizacaoAtual: coordenadaDestinoFake,
                    destino: coordenadaDestinoFake,
                    entregadorId: entregadorIdFake,
                    urlComprovanteEntrega: undefined, // Sem comprovante
                    destinatarioId: destinatarioIdFake
                }, 'test_id');

                expect(() => {
                    entrega.concluirEntrega();
                }).toThrow(EntregaWithoutProofError);
            });
        });
    });
});