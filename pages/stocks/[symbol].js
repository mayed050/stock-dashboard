import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import AdvancedChart from '@/components/AdvancedChart';
import StockReportPDF from '@/components/StockReportPDF';
import { rsi, sma } from '@/components/TechnicalIndicators';

export default function StockDetails() {
  const { query } = useRouter();
  const symbol = (query.symbol || '').toString().toUpperCase();
  const [row, setRow] = useState(null);

  useEffect(() => {
    fetch('/stocks_data.json').then(r => r.json()).then(all => {
      const found = all.find(x => x.symbol.toUpperCase() === symbol);
      setRow(found || null);
    });
  }, [symbol]);

  const closes = useMemo(() => row?.history?.map(h => h.close) || [], [row]);
  const dates = useMemo(() => row?.history?.map(h => h.date) || [], [row]);
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const rsivals = rsi(closes, 14);

  const ohlc = useMemo(() => (row?.history || []).map(h => ({
    date: h.date, open: h.open, high: h.high, low: h.low, close: h.close
  })), [row]);

  const ratios = [
    { name: 'P/E (mock)', value: row?.pe ?? '—' },
    { name: 'ROE % (mock)', value: row?.roe ?? '—' },
    { name: 'EPS (mock)', value: row?.eps ?? '—' },
  ];

  const snapshot = {
    symbol,
    last: row?.last,
    volume: row?.volume,
    date: row?.last_update,
  };

  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-2xl">{symbol}</h1>

      {row ? (
        <>
          <AdvancedChart ohlc={ohlc} title={`الرسم المتقدم - ${symbol}`} />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white p-4 shadow">
              <h3 className="font-semibold mb-1">المؤشرات الفنية</h3>
              <ul className="text-sm opacity-80 list-disc pr-5">
                <li>متوسط 20 يومًا: {sma20.at(-1)?.toFixed?.(2) ?? '—'}</li>
                <li>متوسط 50 يومًا: {sma50.at(-1)?.toFixed?.(2) ?? '—'}</li>
                <li>RSI(14): {rsivals.at(-1)?.toFixed?.(2) ?? '—'}</li>
              </ul>
            </div>
            <StockReportPDF symbol={symbol} snapshot={snapshot} ratios={ratios} />
          </div>
        </>
      ) : (
        <p className="opacity-70">لا توجد بيانات لهذا الرمز.</p>
      )}
    </div>
  );
}
