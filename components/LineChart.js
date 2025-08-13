import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function LineChart({ series = [], title = 'Line' }) {
  const data = series.map(s => ({
    x: s.x, y: s.y, type: 'scatter', mode: 'lines', name: s.name
  }));
  const layout = { title, autosize: true, margin: { t: 40, r: 20, b: 40, l: 50 } };
  return (
    <div className="w-full h-[320px]">
      <Plot data={data} layout={layout} useResizeHandler style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
