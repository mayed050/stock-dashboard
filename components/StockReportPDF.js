import DownloadReport from './DownloadReport';

export default function StockReportPDF({ symbol, snapshot, ratios }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow">
      <h3 className="font-semibold mb-2">تقرير PDF</h3>
      <DownloadReport symbol={symbol} snapshot={snapshot} ratios={ratios} />
    </div>
  );
}
