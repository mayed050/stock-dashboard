import { useEffect, useState } from 'react';
import Link from 'next/link';
import LineChart from '@/components/LineChart';
import Notifications from '@/components/Notifications';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/stocks_data.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-2 gap-4">
        {data.map(s => (
          <div key={s.symbol} className="rounded-2xl border bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{s.symbol}</h2>
              <Link href={`/stocks/${s.symbol}`} className="text-indigo-600 hover:underline">عرض</Link>
            </div>
            <p className="text-sm opacity-70">آخر سعر: {Number(s.last).toLocaleString('en-US', { maximumFractionDigits: 3 })}</p>
            <div className="mt-3">
              <LineChart title={`إغلاق ${s.symbol}`} series={[{ name: s.symbol, x: s.history?.map(h => h.date), y: s.history?.map(h => h.close) }]} />
            </div>
          </div>
        ))}
      </section>
      <Notifications />
    </div>
  );
}
