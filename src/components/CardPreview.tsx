import { CardBrand, brandColors, brandNames } from "@/lib/card";
import { CreditCard, Wifi } from "lucide-react";

interface CardPreviewProps {
  number: string;
  name: string;
  expiry: string;
  brand: CardBrand;
  cpf: string;
}

const BrandLogo = ({ brand }: { brand: CardBrand }) => {
  if (brand === 'visa') return <span className="text-2xl font-bold italic tracking-tight text-white/90">VISA</span>;
  if (brand === 'mastercard') return (
    <div className="flex -space-x-2.5">
      <div className="w-7 h-7 rounded-full bg-red-500 opacity-85" />
      <div className="w-7 h-7 rounded-full bg-yellow-500 opacity-85" />
    </div>
  );
  if (brand === 'elo') return <span className="text-lg font-black text-white/90">elo</span>;
  if (brand === 'amex') return <span className="text-[10px] font-bold leading-tight text-white/90">AMERICAN<br/>EXPRESS</span>;
  if (brand === 'hipercard') return <span className="text-sm font-bold text-white/90">Hipercard</span>;
  return <CreditCard className="h-7 w-7 text-white/70" />;
};

const CardPreview = ({ number, name, expiry, brand, cpf }: CardPreviewProps) => {
  const colors = brandColors[brand];
  const maskedNumber = number || '•••• •••• •••• ••••';
  const displayName = name || 'SEU NOME AQUI';
  const displayExpiry = expiry || 'MM/AA';

  return (
    <div className={`relative mx-auto w-full max-w-[340px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br ${colors.bg} p-5 flex flex-col justify-between shadow-2xl ${colors.accent} select-none overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.06]" />
      <div className="absolute -left-4 bottom-6 h-20 w-20 rounded-full bg-white/[0.04]" />
      <div className="absolute right-12 bottom-16 h-14 w-14 rounded-full bg-white/[0.03]" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner" />
          <Wifi className="h-5 w-5 text-white/40 rotate-90" />
        </div>
        <BrandLogo brand={brand} />
      </div>

      <div className="relative z-10 text-[17px] tracking-[0.22em] font-mono text-white/95 mt-1 drop-shadow-sm">{maskedNumber}</div>

      <div className="relative z-10 flex justify-between items-end text-[11px] text-white">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-white/45 font-medium">Titular</p>
          <p className="font-semibold truncate uppercase text-white/90 text-xs">{displayName}</p>
        </div>
        <div className="text-right ml-3">
          <p className="text-[9px] uppercase tracking-wider text-white/45 font-medium">Validade</p>
          <p className="font-semibold text-white/90 text-xs">{displayExpiry}</p>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
