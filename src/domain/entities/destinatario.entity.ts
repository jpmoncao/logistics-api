import { Pessoa, PessoaProps } from "./pessoa.entity";

interface DestinatarioProps extends PessoaProps { }

export class Destinatario extends Pessoa {
    constructor(props: DestinatarioProps, id?: string) { super(props, id); }
}