import { describe, it, expect } from "vitest";
import { detectBrand, validateLuhn, formatCardNumber, formatExpiry } from "./card";

describe("detectBrand", () => {
  it("detecta Visa", () => {
    expect(detectBrand("4111 1111 1111 1111")).toBe("visa");
  });

  it("detecta Mastercard (5x e 2x)", () => {
    expect(detectBrand("5555 5555 5555 4444")).toBe("mastercard");
    expect(detectBrand("2221 0000 0000 0009")).toBe("mastercard");
  });

  it("detecta Amex", () => {
    expect(detectBrand("3782 822463 10005")).toBe("amex");
    expect(detectBrand("3714 496353 98431")).toBe("amex");
  });

  it("detecta Elo", () => {
    expect(detectBrand("6363 6800 0000 0000")).toBe("elo");
  });

  it("detecta Hipercard", () => {
    expect(detectBrand("6062 8200 0000 0000")).toBe("hipercard");
  });

  it("retorna unknown para vazio ou desconhecido", () => {
    expect(detectBrand("")).toBe("unknown");
    expect(detectBrand("9999 9999 9999 9999")).toBe("unknown");
  });
});

describe("validateLuhn", () => {
  it("aceita números válidos conhecidos", () => {
    expect(validateLuhn("4111 1111 1111 1111")).toBe(true);
    expect(validateLuhn("5555555555554444")).toBe(true);
    expect(validateLuhn("378282246310005")).toBe(true);
  });

  it("rejeita Luhn inválido", () => {
    expect(validateLuhn("4111 1111 1111 1112")).toBe(false);
  });

  it("rejeita comprimentos inválidos", () => {
    expect(validateLuhn("411111")).toBe(false);
    expect(validateLuhn("12345678901234567890")).toBe(false);
  });
});

describe("formatCardNumber", () => {
  it("agrupa em blocos de 4", () => {
    expect(formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(formatCardNumber("41111")).toBe("4111 1");
  });

  it("limita a 16 dígitos", () => {
    expect(formatCardNumber("41111111111111119999")).toBe("4111 1111 1111 1111");
  });
});

describe("formatExpiry", () => {
  it("insere barra após mês", () => {
    expect(formatExpiry("12")).toBe("12");
    expect(formatExpiry("125")).toBe("12/5");
    expect(formatExpiry("1228")).toBe("12/28");
  });

  it("limita a 4 dígitos", () => {
    expect(formatExpiry("122899")).toBe("12/28");
  });
});
