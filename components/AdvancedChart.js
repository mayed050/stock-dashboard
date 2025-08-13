import dynamic from 'next/dynamic';
import { useMemo } from 'react';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function AdvancedChart({ ohlc = [], title = 'Advanced Chart' }) {
  const data = useMemo(() => {
    const x = ohlc.map(r => r.date);
    const open = ohlc.map(r => r.open);
    const high = ohlc.map(r => r.high);
    const low = ohlc.map(r => r.low);
    const close = ohlc.map(r => r.close);
    return [
      {
        type: 'candlestick',
        x, open, high, low, close,
        name: 'OHLC'
      }
    ];
  }, [ohlc]);

  const layout = {
    title,
    autosize: true,
    margin: { t: 40, r: 20, b: 40, l: 50 },
    xaxis: { type: 'date', showgrid: false },
    yaxis: { tickformat: ',.2f' },
  };

  return (
    <div className="w-full h-[420px]">
      <Plot data={data} layout={layout} useResizeHandler style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
