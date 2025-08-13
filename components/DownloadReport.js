import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function DownloadReport({ symbol, snapshot = {}, ratios = [] }) {
  const handleDownload = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Stock Report: ${symbol}`, 40, 40);

    const tableBody = ratios.map(r => [r.name, r.value]);
    // @ts-ignore
    doc.autoTable({ startY: 60, head: [["Metric", "Value"]], body: tableBody });

    doc.text('Snapshot', 40, doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 100);
    const snapY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 50 : 120;

    Object.entries(snapshot).forEach(([k, v], i) => {
      doc.text(`${k}: ${v}`, 40, snapY + i * 18);
    });

    doc.save(`${symbol}_report.pdf`);
  };

  return (
    <button onClick={handleDownload} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">
      تنزيل تقرير PDF
    </button>
  );
}
