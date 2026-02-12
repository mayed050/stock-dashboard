import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('./LineChart'), { ssr: false });

export default function StockCard({ name, data }) {
  const router = useRouter();
  const analysis = data.analysis || {};
  
  return (
    <div 
      className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => router.push(`/stocks/${name}`)}
    >
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      
      <div className="space-y-2">
        <p><span className="font-semibold">السعر:</span> {data.price || 'N/A'}</p>
        <p><span className="font-semibold">التغير:</span> {data.change || 'N/A'}</p>
        <p><span className="font-semibold">الحجم:</span> {data.volume || 'N/A'}</p>
        <p><span className="font-semibold">القيمة السوقية:</span> {data.market_cap || 'N/A'}</p>
        <p><span className="font-semibold">EPS:</span> {data.eps || 'N/A'}</p>
        <p><span className="font-semibold">P/E:</span> {data.pe || 'N/A'}</p>
        <p><span className="font-semibold">ROE:</span> {data.roe || 'N/A'}</p>
      </div>
      
      {analysis.recommendation && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2">التحليل والتوصية</h3>
          <p><span className="font-semibold">التوصية:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-white ${
              analysis.recommendation === 'شراء' ? 'bg-green-500' :
              analysis.recommendation === 'بيع' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
              {analysis.recommendation}
            </span>
          </p>
          {analysis.target_price && (
            <p><span className="font-semibold">السعر المستهدف (3 أشهر):</span> {analysis.target_price.toFixed(2)}</p>
          )}
          {analysis.target_return && (
            <p><span className="font-semibold">العائد المتوقع:</span> {analysis.target_return.toFixed(2)}%</p>
          )}
          <p className="text-sm mt-2">{analysis.pe_analysis}</p>
          <p className="text-sm">{analysis.roe_analysis}</p>
        </div>
      )}
      
      <div className="mt-4">
        <LineChart />
      </div>
    </div>
  );
}
