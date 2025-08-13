import { usePortfolio } from '@/context/PortfolioContext';
import StockCard from './StockCard';

export default function Portfolio() {
  const { holdings, removeHolding } = usePortfolio();
  if (!holdings.length) return <p className="opacity-70">لا توجد أسهم في المحفظة بعد.</p>;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {holdings.map((h, idx) => (
        <StockCard key={idx} symbol={h.symbol} price={h.price} change={h.change} onRemove={() => removeHolding(idx)} />
      ))}
    </div>
  );
}
