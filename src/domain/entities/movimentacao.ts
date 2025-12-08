export interface MovimentacaoProps {
    descricao: string;
    data: Date;
}

export class Movimentacao {
    public readonly props: MovimentacaoProps;

    constructor(descricao: string, data?: Date) {
        if (descricao.length < 5) {
            throw new Error("A descrição da movimentação deve ter no mínimo 5 caracteres.");
        }

        this.props = {
            descricao,
            data: data ?? new Date()
        }
    }

    get descricao(): string { return this.props.descricao; }
    get data(): Date { return this.props.data; }
}