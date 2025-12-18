export function validarCpf(cpf: string): boolean {
    // 1. Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // 2. Verifica comprimento e se todos os dígitos são iguais (ex: 111.111.111-11)
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

    // 3. Validação matemática dos dígitos verificadores
    const cpfs = cpf.split('').map(el => +el);

    const rest = (count: number) => (
        (cpfs.slice(0, count - 12)
            .reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11
    ) % 10;

    return rest(10) === cpfs[9] && rest(11) === cpfs[10];
}