import { useEffect, useState } from 'react';

export default function Notifications() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 px-3 py-2 rounded-xl shadow bg-white border text-sm">
      {online ? 'متصل بالإنترنت' : 'لا يوجد اتصال'}
    </div>
  );
}
