import { usePortfolio } from '@/context/PortfolioContext';
import Portfolio from '@/components/Portfolio';
import { useState } from 'react';

export default function PortfolioPage() {
  const { addHolding } = usePortfolio();
  const [symbol, setSymbol] = useState('DEWA');
  const [price, setPrice] = useState('2.5');
  const [change, setChange] = useState('0.0');

  const add = () => {
    addHolding({ symbol: symbol.toUpperCase(), price: Number(price), change: Number(change) });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-4 shadow">
        <h1 className="font-semibold mb-3">إدارة المحفظة</h1>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-sm">الرمز</label>
            <input value={symbol} onChange={e => setSymbol(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-sm">السعر</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-sm">التغير %</label>
            <input value={change} onChange={e => setChange(e.target.value)} className="input" />
          </div>
          <button onClick={add} className="btn-primary">إضافة</button>
        </div>
      </div>
      <Portfolio />
    </div>
  );
}
