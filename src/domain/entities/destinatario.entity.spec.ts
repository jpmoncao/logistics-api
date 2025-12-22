import { describe, it, expect } from "vitest";
import { Destinatario } from "./destinatario.entity";

describe("Destinatario Entity", () => {
    it("deve criar o destinatario com propriedades válidas", () => {
        const destinatario = new Destinatario({
            nome: "João Silva",
            email: "joao.silva@example.com"
        });

        expect(destinatario).toBeInstanceOf(Destinatario);
        expect(destinatario.nome).toBe("João Silva");
        expect(destinatario.email).toBe("joao.silva@example.com");
        expect(destinatario.id).toBeDefined();
    });
});