import { Pessoa, PessoaProps } from "./pessoa.entity";

interface DestinatarioProps extends PessoaProps {
    email: string;
    senha: string;
}

export class Destinatario extends Pessoa {
    protected _email: string;
    protected _senha: string;

    get email(): string { return this._email; }
    get senha(): string { return this._senha; }

    constructor(props: DestinatarioProps, id?: string) {
        super(props, id);
        this._email = props.email;
        this._senha = props.senha;
    }
}