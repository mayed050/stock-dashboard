import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../../components/Navigation';
import AdvancedChart from '../../components/AdvancedChart';
import TechnicalIndicators from '../../components/TechnicalIndicators';
import DownloadReport from '../../components/DownloadReport';

export default function StockDetail() {
  const router = useRouter();
  const { symbol } = router.query;
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (symbol) {
      fetch('/stocks_data.json')
        .then(response => response.json())
        .then(data => {
          setStockData(data[symbol.toUpperCase()]);
          setLoading(false);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [symbol]);

  if (loading) return <div className="text-center p-8">جاري التحميل...</div>;
  if (!stockData) return <div className="text-center p-8">السهم غير موجود</div>;

  const analysis = stockData.analysis || {};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ← العودة
            </button>
            <DownloadReport stockData={stockData} symbol={symbol} />
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">{symbol} - تفاصيل السهم</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">البيانات الأساسية</h2>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">السعر الحالي</span>
                    <span>{stockData.price || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">التغير</span>
                    <span>{stockData.change || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">حجم التداول</span>
                    <span>{stockData.volume || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">القيمة السوقية</span>
                    <span>{stockData.market_cap || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">ربحية السهم (EPS)</span>
                    <span>{stockData.eps || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">مضاعف الربحية (P/E)</span>
                    <span>{stockData.pe || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-semibold">العائد على حقوق الملكية (ROE)</span>
                    <span>{stockData.roe || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">التحليل والتوقعات</h2>
                {analysis.recommendation && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">التوصية الاستثمارية</h3>
                      <div className={`inline-block px-4 py-2 rounded text-white text-lg font-bold ${
                        analysis.recommendation === 'شراء' ? 'bg-green-500' :
                        analysis.recommendation === 'بيع' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        {analysis.recommendation}
                      </div>
                    </div>
                    
                    {analysis.target_price && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">التوقعات لـ 3 أشهر</h3>
                        <p><span className="font-semibold">السعر المستهدف:</span> {analysis.target_price.toFixed(2)}</p>
                        <p><span className="font-semibold">العائد المتوقع:</span> {analysis.target_return.toFixed(2)}%</p>
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">تحليل النسب المالية</h3>
                      <p className="mb-2">{analysis.pe_analysis}</p>
                      <p>{analysis.roe_analysis}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">الأداء التاريخي</h2>
              <AdvancedChart historicalData={stockData.historical} />
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">التحليل الفني</h2>
              <TechnicalIndicators indicators={stockData.indicators} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
