import { Pessoa, PessoaProps } from "./pessoa.entity";

interface EntregadorProps extends PessoaProps { }

export class Entregador extends Pessoa {
    constructor(props: EntregadorProps, id?: string) { super(props, id); }
}