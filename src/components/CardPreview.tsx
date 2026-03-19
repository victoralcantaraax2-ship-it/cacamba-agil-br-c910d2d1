import { CardBrand, brandColors, brandNames } from "@/lib/card";
import { CreditCard } from "lucide-react";

interface CardPreviewProps {
  number: string;
  name: string;
  expiry: string;
  brand: CardBrand;
  cpf: string;
}

const BrandLogo = ({ brand }: { brand: CardBrand }) => {
  if (brand === 'visa') return <span className="text-xl font-bold italic tracking-tight">VISA</span>;
  if (brand === 'mastercard') return (
    <div className="flex -space-x-2">
      <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
      <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80" />
    </div>
  );
  if (brand === 'elo') return <span className="text-lg font-black">elo</span>;
  if (brand === 'amex') return <span className="text-xs font-bold leading-tight">AMERICAN<br/>EXPRESS</span>;
  if (brand === 'hipercard') return <span className="text-sm font-bold">Hipercard</span>;
  return <CreditCard className="h-6 w-6" />;
};

const CardPreview = ({ number, name, expiry, brand, cpf }: CardPreviewProps) => {
  const colors = brandColors[brand];
  const maskedNumber = number || '•••• •••• •••• ••••';
  const displayName = name || 'SEU NOME AQUI';
  const displayExpiry = expiry || 'MM/AA';

  return (
    <div className={`mx-auto w-full max-w-[320px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br ${colors.bg} p-5 flex flex-col justify-between shadow-xl ${colors.accent} select-none`}>
      <div className="flex justify-between items-start">
        <div className="w-10 h-7 rounded bg-yellow-400/80" />
        <BrandLogo brand={brand} />
      </div>
      <div className="text-lg tracking-[0.2em] font-mono mt-2">{maskedNumber}</div>
      <div className="flex justify-between items-end text-[11px]">
        <div className="flex-1 min-w-0">
          <p className="opacity-60 text-[9px] uppercase">Titular</p>
          <p className="font-semibold truncate uppercase">{displayName}</p>
          {cpf && (
            <>
              <p className="opacity-60 text-[9px] uppercase mt-0.5">CPF</p>
              <p className="font-mono text-[10px]">{cpf}</p>
            </>
          )}
        </div>
        <div className="text-right ml-3">
          <p className="opacity-60 text-[9px] uppercase">Validade</p>
          <p className="font-semibold">{displayExpiry}</p>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
