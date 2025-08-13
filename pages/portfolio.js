import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Portfolio from '../components/Portfolio';

export default function PortfolioPage() {
  const [currentPrices, setCurrentPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/stocks_data.json');
        const data = await response.json();
        
        const prices = {};
        Object.keys(data).forEach(symbol => {
          if (symbol !== 'metadata') {
            prices[symbol] = parseFloat(data[symbol].price) || 0;
          }
        });
        
        setCurrentPrices(prices);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">محفظتي الاستثمارية</h1>
          <Portfolio currentPrices={currentPrices} />
        </div>
      </div>
    </div>
  );
}
