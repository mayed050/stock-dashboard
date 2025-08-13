import Link from 'next/link';

export default function StockCard({ symbol, price, change, onRemove }) {
  const isUp = Number(change) >= 0;
  return (
    <div className="rounded-2xl border bg-white p-4 shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{symbol}</h3>
        <button onClick={onRemove} className="text-xs opacity-60 hover:opacity-100">إزالة</button>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold">{Number(price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        <span className={isUp ? 'text-green-600' : 'text-red-600'}>
          {isUp ? '▲' : '▼'} {Number(change).toFixed(2)}%
        </span>
      </div>
      <Link href={`/stocks/${symbol}`} className="mt-3 inline-block text-indigo-600 hover:underline">تفاصيل السهم</Link>
    </div>
  );
}
