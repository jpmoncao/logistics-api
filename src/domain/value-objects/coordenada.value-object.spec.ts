import { describe, it, expect } from "vitest";

import { ValidationError } from "../../core/errors/validation.error";

import { Coordenada } from "./coordenada.value-object";

describe('Coordenada Value Object', () => {
    it('deve devolver um valor de aproximadamente 378 KM ao calcular a distância entre São Paulo e Rio de Janeiro', () => {
        const coordenadaSP = new Coordenada(-23.55, -46.63);
        const coordenadaRJ = new Coordenada(-22.54, -43.10);

        const distanciaEmKm = coordenadaSP.calcularDistancia(coordenadaRJ);

        console.log('Distância calculada:', distanciaEmKm);

        expect(distanciaEmKm).toBeGreaterThan(360);
        expect(distanciaEmKm).toBeLessThan(380);
    })

    it('deve lançar ValidationError quando a latitude não estiver entre -90 e 90', () => {
        expect(() => {
            new Coordenada(-91, 0);
        }).toThrow(ValidationError);

        expect(() => {
            new Coordenada(-91, 0);
        }).toThrow('A latitude deve estar entre -90 e 90.');

        expect(() => {
            new Coordenada(91, 0);
        }).toThrow(ValidationError);

        expect(() => {
            new Coordenada(91, 0);
        }).toThrow('A latitude deve estar entre -90 e 90.');
    });

    it('deve lançar ValidationError quando a longitude não estiver entre -180 e 180', () => {
        expect(() => {
            new Coordenada(0, -181);
        }).toThrow(ValidationError);

        expect(() => {
            new Coordenada(0, -181);
        }).toThrow('A longitude deve estar entre -180 e 180.');

        expect(() => {
            new Coordenada(0, 181);
        }).toThrow(ValidationError);

        expect(() => {
            new Coordenada(0, 181);
        }).toThrow('A longitude deve estar entre -180 e 180.');
    });
})