import { describe, it, expect } from "vitest";
import { isQrImage, getSafeQrValue } from "./qrPix";

describe("isQrImage", () => {
  it("detecta URLs http/https", () => {
    expect(isQrImage("https://exemplo.com/qr.png")).toBe(true);
    expect(isQrImage("http://exemplo.com/qr.png")).toBe(true);
  });

  it("detecta data URLs de imagem", () => {
    expect(isQrImage("data:image/png;base64,abc")).toBe(true);
  });

  it("rejeita BR Code puro", () => {
    expect(isQrImage("00020126360014BR.GOV.BCB.PIX")).toBe(false);
    expect(isQrImage("")).toBe(false);
  });
});

describe("getSafeQrValue", () => {
  const pixCode = "00020126360014BR.GOV.BCB.PIX0114+5511986847426";

  it("retorna pixCode se qrDisplay vazio", () => {
    expect(getSafeQrValue("", pixCode)).toBe(pixCode);
  });

  it("retorna URL/data URL diretamente", () => {
    const url = "https://exemplo.com/qr.png";
    expect(getSafeQrValue(url, pixCode)).toBe(url);
  });

  it("retorna BR Code curto sem alteração", () => {
    expect(getSafeQrValue(pixCode, pixCode)).toBe(pixCode);
  });

  it("faz fallback para pixCode quando string é grande demais (base64 cru)", () => {
    const huge = "A".repeat(5000);
    expect(getSafeQrValue(huge, pixCode)).toBe(pixCode);
  });

  it("retorna string vazia se nenhum valor utilizável", () => {
    expect(getSafeQrValue("", "")).toBe("");
  });
});
