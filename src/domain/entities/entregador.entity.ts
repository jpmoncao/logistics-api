import { AggregateRoot } from '../../core/entities/aggregate-root';
import { UniqueEntityID } from '../../core/entities/unique-entity-id.entity';

interface EntregadorProps {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    senha: string;
}

export class Entregador extends AggregateRoot {
    private _id: string;
    private _nome: string;
    private _cpf: string;
    private _telefone: string;
    private _email: string;
    private _senha: string;

    constructor(props: EntregadorProps, id?: string) {
        super();

        this._id = new UniqueEntityID(id).toString();
        this._nome = props.nome;
        this._cpf = props.cpf;
        this._telefone = props.telefone;
        this._email = props.email;
        this._senha = props.senha;
    }

    get id(): string { return this._id; }
    get nome(): string { return this._nome; }
    get cpf(): string { return this._cpf; }
    get telefone(): string { return this._telefone; }
    get email(): string { return this._email; }
    get senha(): string { return this._senha; }
}
