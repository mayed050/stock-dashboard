export default function TechnicalIndicators({ indicators }) {
  if (!indicators) return null;

  const getRSIColor = (rsi) => {
    if (rsi > 70) return 'text-red-600';
    if (rsi < 30) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getMACDSignal = (macd) => {
    if (macd > 0) return 'إشارة شراء';
    if (macd < 0) return 'إشارة بيع';
    return 'محايد';
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-bold mb-4">المؤشرات الفنية</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indicators.sma_20 && (
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">المتوسط المتحرك (20 يوم)</p>
            <p className="text-lg font-semibold">{indicators.sma_20.toFixed(2)}</p>
          </div>
        )}
        {indicators.sma_50 && (
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">المتوسط المتحرك (50 يوم)</p>
            <p className="text-lg font-semibold">{indicators.sma_50.toFixed(2)}</p>
          </div>
        )}
        {indicators.rsi && (
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">مؤشر القوة النسبية (RSI)</p>
            <p className={`text-lg font-semibold ${getRSIColor(indicators.rsi)}`}>
              {indicators.rsi.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {indicators.rsi > 70 ? 'مبالغ في الشراء' : 
               indicators.rsi < 30 ? 'مبالغ في البيع' : 'محايد'}
            </p>
          </div>
        )}
        {indicators.macd && (
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">MACD</p>
            <p className={`text-lg font-semibold ${
              indicators.macd > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {indicators.macd.toFixed(4)}
            </p>
            <p className="text-xs text-gray-500">{getMACDSignal(indicators.macd)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
