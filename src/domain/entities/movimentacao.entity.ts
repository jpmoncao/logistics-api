import { ValidationError } from "../../core/errors/validation.error";
import { Coordenada } from "../value-objects/coordenada.value-object";

export interface MovimentacaoProps {
    descricao: string;
    data?: Date;
    coordenada?: Coordenada;
}

export class Movimentacao {
    private _descricao: string;
    private _data: Date;
    private _coordenada: Coordenada | null;

    constructor(props: MovimentacaoProps) {
        if (props.descricao.length < 5) {
            throw new ValidationError([{
                field: 'descricao',
                message: "The description of the transaction must be at least 5 characters long."
            }]);
        }

        this._descricao = props.descricao;
        this._data = props.data ?? new Date();
        this._coordenada = props.coordenada ?? null;
    }

    get descricao(): string { return this._descricao; }
    get data(): Date { return this._data; }
    get coordenada(): Coordenada | null { return this._coordenada; }
}