// Helpers para renderizar QR Code de Pix de forma segura.
// O gateway pode retornar:
//  - uma URL/data URL de imagem (renderiza com <img>)
//  - o BR Code (copia-e-cola) ~150 chars (renderiza com <QRCodeSVG>)
//  - um base64 PNG cru (>5000 chars) — NÃO pode ir para <QRCodeSVG> (RangeError: Data too long)
// Sempre que o valor não couber no QR SVG, usamos o pix_code como fonte de verdade
// (é o BR Code oficial daquela transação, gerado pelo gateway).

export const isQrImage = (value: string): boolean =>
  /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

// Limite seguro do QR Code (Versão 40 / nível L ~ 2953 bytes; usamos folga)
const QR_MAX_LEN = 1500;

export const getSafeQrValue = (qrDisplay: string, pixCode: string): string => {
  if (!qrDisplay) return pixCode || "";
  if (isQrImage(qrDisplay)) return qrDisplay;
  if (qrDisplay.length <= QR_MAX_LEN) return qrDisplay;
  // Fallback: valor é grande demais (provavelmente base64 sem prefixo) — usa o pix_code
  return pixCode || "";
};
