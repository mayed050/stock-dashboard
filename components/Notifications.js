import { useState, useEffect } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch('/stocks_data.json');
        const data = await response.json();
        const lastUpdate = localStorage.getItem('lastUpdate');
        
        if (data.metadata && data.metadata.last_updated !== lastUpdate) {
          addNotification({
            id: Date.now(),
            type: 'success',
            title: 'تحديث البيانات',
            message: `تم تحديث بيانات الأسهم في ${data.metadata.last_updated}`,
            timestamp: data.metadata.last_updated
          });
          localStorage.setItem('lastUpdate', data.metadata.last_updated);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    const interval = setInterval(checkForUpdates, 60000);
    checkForUpdates();

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'الإشعارات مفعلة',
          message: 'ستصلك إشعارات عند تحديث البيانات',
          timestamp: new Date().toLocaleString()
        });
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <BellIcon className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">الإشعارات</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                لا توجد إشعارات جديدة
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    notification.type === 'success' ? 'border-l-4 border-l-green-500' :
                    notification.type === 'error' ? 'border-l-4 border-l-red-500' :
                    'border-l-4 border-l-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t">
            <button
              onClick={requestNotificationPermission}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              تفعيل إشعارات المتصفح
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
