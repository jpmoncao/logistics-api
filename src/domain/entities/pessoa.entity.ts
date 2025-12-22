import { UniqueEntityID } from "../../core/entities/unique-entity-id.entity";

export interface PessoaProps {
    nome: string;
    cpf: string;
    telefone: string;
}

export class Pessoa {
    protected _id: string;
    protected _nome: string;
    protected _cpf: string;
    protected _telefone: string;

    constructor(props: PessoaProps, id?: string) {
        this._id = new UniqueEntityID(id).toString();
        this._nome = props.nome;
        this._cpf = props.cpf;
        this._telefone = props.telefone;
    }

    get id(): string { return this._id; }
    get nome(): string { return this._nome; }
    get cpf(): string { return this._cpf; }
    get telefone(): string { return this._telefone; }
}