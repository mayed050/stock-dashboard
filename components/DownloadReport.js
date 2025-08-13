import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { DownloadIcon } from '@heroicons/react/24/outline';
import StockReportPDF from './StockReportPDF';

export default function DownloadReport({ stockData, symbol }) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const blob = await pdf(<StockReportPDF stockData={stockData} symbol={symbol} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_${symbol}_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
    >
      <DownloadIcon className="h-5 w-5" />
      {loading ? 'جاري الإنشاء...' : 'تحميل التقرير PDF'}
    </button>
  );
}
