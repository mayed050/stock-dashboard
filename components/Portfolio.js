import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PlusIcon, MinusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Portfolio({ currentPrices }) {
  const { portfolio, transactions, addToPortfolio, sellFromPortfolio, getPortfolioValue, getPortfolioReturn } = usePortfolio();
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState('buy');

  const totalValue = getPortfolioValue(currentPrices);
  const totalReturn = getPortfolioReturn(currentPrices);
  const investedValue = portfolio.reduce((total, item) => total + item.totalValue, 0);

  const handleAction = () => {
    if (!selectedStock || !quantity) return;
    
    const qty = parseInt(quantity, 10);
    const price = currentPrices[selectedStock] || 0;
    
    if (action === 'buy') {
      addToPortfolio(selectedStock, qty, price);
    } else {
      sellFromPortfolio(selectedStock, qty, price);
    }
    
    setQuantity('');
    setSelectedStock(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">المحفظة الاستثمارية</h2>
        <button
          onClick={() => setShowTransactions(!showTransactions)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <ChartBarIcon className="h-5 w-5" />
          {showTransactions ? 'إخفاء المعاملات' : 'عرض المعاملات'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">القيمة الحالية</p>
          <p className="text-2xl font-bold text-green-600">
            {totalValue.toLocaleString('ar-EG', { style: 'currency', currency: 'AED' })}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">إجمالي الاستثمار</p>
          <p className="text-2xl font-bold text-blue-600">
            {investedValue.toLocaleString('ar-EG', { style: 'currency', currency: 'AED' })}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${totalReturn >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="text-sm text-gray-600">العائد الإجمالي</p>
          <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalReturn.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">إضافة معاملة</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={selectedStock || ''}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">اختر السهم</option>
            <option value="DEWA">DEWA</option>
            <option value="SALIK">SALIK</option>
            <option value="TALABAT">TALABAT</option>
            <option value="NMDC">NMDC</option>
          </select>
          
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="الكمية"
            className="p-2 border rounded"
          />
          
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="buy">شراء</option>
            <option value="sell">بيع</option>
          </select>
          
          <button
            onClick={handleAction}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {action === 'buy' ? <PlusIcon className="h-5 w-5" /> : <MinusIcon className="h-5 w-5" />}
            {action === 'buy' ? 'شراء' : 'بيع'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">تفاصيل المحفظة</h3>
        {portfolio.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد أسهم في المحفظة</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">السهم</th>
                  <th className="text-right p-2">الكمية</th>
                  <th className="text-right p-2">متوسط التكلفة</th>
                  <th className="text-right p-2">السعر الحالي</th>
                  <th className="text-right p-2">القيمة الحالية</th>
                  <th className="text-right p-2">العائد</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => {
                  const currentPrice = currentPrices[item.symbol] || 0;
                  const currentValue = item.quantity * currentPrice;
                  const returnValue = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;
                  
                  return (
                    <tr key={item.symbol} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-semibold">{item.symbol}</td>
                      <td className="p-2">{item.quantity.toLocaleString()}</td>
                      <td className="p-2">{item.avgPrice.toFixed(2)}</td>
                      <td className="p-2">{currentPrice.toFixed(2)}</td>
                      <td className="p-2">{currentValue.toLocaleString('ar-EG', { style: 'currency', currency: 'AED' })}</td>
                      <td className={`p-2 font-semibold ${returnValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {returnValue.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showTransactions && (
        <div>
          <h3 className="text-lg font-semibold mb-4">سجل المعاملات</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد معاملات</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">التاريخ</th>
                    <th className="text-right p-2">السهم</th>
                    <th className="text-right p-2">النوع</th>
                    <th className="text-right p-2">الكمية</th>
                    <th className="text-right p-2">السعر</th>
                    <th className="text-right p-2">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {new Date(transaction.date).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-2 font-semibold">{transaction.symbol}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white text-sm ${
                          transaction.type === 'شراء' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="p-2">{transaction.quantity.toLocaleString()}</td>
                      <td className="p-2">{transaction.price.toFixed(2)}</td>
                      <td className="p-2">
                        {transaction.total.toLocaleString('ar-EG', { style: 'currency', currency: 'AED' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
