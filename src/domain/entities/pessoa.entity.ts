import { UniqueEntityID } from "../../core/entities/unique-entity-id.entity";

export interface PessoaProps {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    senha: string;
}

export class Pessoa {
    protected _id: string;
    protected _nome: string;
    protected _cpf: string;
    protected _telefone: string;
    protected _email: string;
    protected _senha: string;

    constructor(props: PessoaProps, id?: string) {
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