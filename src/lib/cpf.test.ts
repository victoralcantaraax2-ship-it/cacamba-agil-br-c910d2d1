import { describe, it, expect } from "vitest";
import { formatCpf, validateCpf } from "./cpf";

describe("formatCpf", () => {
  it("formata progressivamente conforme dígitos", () => {
    expect(formatCpf("123")).toBe("123");
    expect(formatCpf("123456")).toBe("123.456");
    expect(formatCpf("123456789")).toBe("123.456.789");
    expect(formatCpf("12345678900")).toBe("123.456.789-00");
  });

  it("ignora caracteres não numéricos", () => {
    expect(formatCpf("abc123def456")).toBe("123.456");
  });

  it("limita a 11 dígitos", () => {
    expect(formatCpf("123456789001234")).toBe("123.456.789-00");
  });
});

describe("validateCpf", () => {
  it("valida CPFs reais conhecidos", () => {
    expect(validateCpf("111.444.777-35")).toBe(true);
    expect(validateCpf("11144477735")).toBe(true);
  });

  it("rejeita CPF com tamanho inválido", () => {
    expect(validateCpf("123")).toBe(false);
    expect(validateCpf("")).toBe(false);
  });

  it("rejeita sequência repetida", () => {
    expect(validateCpf("11111111111")).toBe(false);
    expect(validateCpf("00000000000")).toBe(false);
  });

  it("rejeita dígito verificador errado", () => {
    expect(validateCpf("111.444.777-00")).toBe(false);
    expect(validateCpf("12345678900")).toBe(false);
  });
});
