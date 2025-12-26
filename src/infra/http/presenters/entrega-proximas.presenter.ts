import { Entrega } from "../../../domain/aggregate/entrega.entity";

interface EntregasProximasHTTP {
    id_entrega: string;
    distancia: string;
    destino: { latitude: number, longitude: number }
}

export class EntregasProximasPresenter {
    static toHTTP(entregas: Entrega[]): EntregasProximasHTTP[] {
        return entregas
            .sort((a, b) => a.distanciaAtualParaDestino - b.distanciaAtualParaDestino)
            .map(entrega => ({
                id_entrega: entrega.id,
                distancia: entrega.distanciaAtualParaDestino + ' km',
                destino: {
                    latitude: entrega.destino.latitude,
                    longitude: entrega.destino.longitude
                }
            }));
    }
}