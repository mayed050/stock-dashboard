import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import StockCard from '../components/StockCard';

export default function Home() {
  const [stocks, setStocks] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch('/stocks_data.json')
      .then(response => response.json())
      .then(data => {
        const { metadata, ...stocksData } = data;
        setStocks(stocksData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">لوحة متابعة الأسهم</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stocks).map(([name, data]) => (
            <StockCard key={name} name={name} data={data} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => router.push('/portfolio')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4"
          >
            عرض محفظتي الاستثمارية
          </button>
          <button 
            onClick={() => router.push('/stocks/DEWA')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            عرض تحليل DEWA التفصيلي
          </button>
        </div>
      </div>
    </div>
  );
}
