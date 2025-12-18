import { haversineDistance } from '../../core/utils/haversine-distance';

import { ValidationError } from '../../core/errors/validation.error'

export class Coordenada {
    private _latitude: number;
    private _longitude: number;

    constructor(latitude: number, longitude: number) {
        this.validarCoordendas(latitude, longitude);

        this._latitude = latitude;
        this._longitude = longitude;
    }

    get latitude() { return this._latitude };
    get longitude() { return this._longitude };

    private validarCoordendas(latitude: number, longitude: number) {
        if (latitude < -90 || latitude > 90)
            throw new ValidationError('A latitude deve estar entre -90 e 90.');

        if (longitude < -180 || longitude > 180)
            throw new ValidationError('A longitude deve estar entre -180 e 180.');
    }

    public calcularDistancia(para: Coordenada) {
        this.validarCoordendas(para.latitude, para.longitude);

        const distance = haversineDistance(this._latitude, this._longitude, para.latitude, para.longitude);

        return distance.toLocaleString('pt-BR', { style: 'unit', unit: 'kilometer', maximumFractionDigits: 1 });
    }
}