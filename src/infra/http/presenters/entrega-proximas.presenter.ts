import { Entrega } from "../../../domain/aggregate/entrega.entity";

interface EntregasProximas {
    id_entrega: string;
    distancia: string;
    destino: { latitude: number, longitude: number };
}

interface EntregasProximasHTTP {
    localizacaoAtual: { latitude: number, longitude: number };
    entregas: EntregasProximas[];
}

export class EntregasProximasPresenter {
    static toHTTP(entregas: Entrega[]): EntregasProximasHTTP {
        const sortedEntregas = entregas.sort((a, b) => a.distanciaAtualParaDestino - b.distanciaAtualParaDestino);

        return {
            localizacaoAtual: {
                latitude: sortedEntregas[0].localizacaoAtual.latitude,
                longitude: sortedEntregas[0].localizacaoAtual.longitude
            },
            entregas: sortedEntregas.map(entrega => ({
                id_entrega: entrega.id,
                distancia: entrega.distanciaAtualParaDestino + ' km',
                destino: {
                    latitude: entrega.destino.latitude,
                    longitude: entrega.destino.longitude
                }
            }))
        };
    }
}