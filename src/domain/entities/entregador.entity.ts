import { Pessoa, PessoaProps } from "./pessoa.entity";

interface EntregadorProps extends PessoaProps {
    email: string;
    senha: string;
}

export class Entregador extends Pessoa {
    protected _email: string;
    protected _senha: string;

    get email(): string { return this._email; }
    get senha(): string { return this._senha; }

    constructor(props: EntregadorProps, id?: string) {
        super(props, id);
        this._email = props.email;
        this._senha = props.senha;
    }
}