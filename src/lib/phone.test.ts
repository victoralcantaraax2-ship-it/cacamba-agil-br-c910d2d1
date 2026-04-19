import { describe, it, expect } from "vitest";
import { formatPhone, validatePhone } from "./phone";

describe("formatPhone", () => {
  it("formata celular brasileiro completo (11 dígitos)", () => {
    expect(formatPhone("11986847426")).toBe("(11) 98684-7426");
  });

  it("formata 10 dígitos no padrão celular (função sempre usa máscara de 11)", () => {
    // formatPhone trata todo input como celular: (XX) XXXXX-XXXX
    expect(formatPhone("1130172222")).toBe("(11) 30172-222");
  });

  it("formata parcialmente conforme digitação", () => {
    expect(formatPhone("1")).toBe("(1");
    expect(formatPhone("11")).toBe("(11");
    expect(formatPhone("119")).toBe("(11) 9");
    expect(formatPhone("11986")).toBe("(11) 986");
  });

  it("ignora caracteres não numéricos e limita a 11 dígitos", () => {
    expect(formatPhone("abc11986847426999")).toBe("(11) 98684-7426");
  });
});

describe("validatePhone", () => {
  it("aceita 10 e 11 dígitos", () => {
    expect(validatePhone("(11) 98684-7426")).toBe(true);
    expect(validatePhone("(11) 3017-2222")).toBe(true);
    expect(validatePhone("11986847426")).toBe(true);
  });

  it("rejeita tamanhos inválidos", () => {
    expect(validatePhone("119")).toBe(false);
    expect(validatePhone("")).toBe(false);
    expect(validatePhone("119868474261234")).toBe(false);
  });
});
