'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NotificationDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  expectations: string;
}

interface Notification {
  id: string;
  type: 'danismanlik' | 'sistem';
  message: string;
  date: string;
  read: boolean;
  details?: NotificationDetails;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user !== 'seyithan1907') {
      router.push('/');
      return;
    }
    setCurrentUser(user);

    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(storedNotifications);
  }, [router]);

  const markAsRead = (notification: Notification) => {
    const updatedNotifications = notifications.map(n => {
      if (n.id === notification.id) {
        return { ...n, read: true };
      }
      return n;
    });

    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setSelectedNotification(notification);
  };

  const deleteNotification = (id: string) => {
    if (window.confirm('Bu bildirimi silmek istediğinize emin misiniz?')) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      setSelectedNotification(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bildirimler</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bildirim Listesi */}
          <div className="md:col-span-1 bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tüm Bildirimler</h2>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-gray-400">Bildirim bulunmuyor</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedNotification?.id === notification.id
                        ? 'bg-blue-900'
                        : 'bg-gray-800 hover:bg-gray-700'
                    } ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
                    onClick={() => markAsRead(notification)}
                  >
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(notification.date).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bildirim Detayları */}
          <div className="md:col-span-2 bg-gray-900 rounded-lg p-6">
            {selectedNotification ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Bildirim Detayları</h2>
                    <p className="text-gray-400 mt-1">
                      {new Date(selectedNotification.date).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNotification(selectedNotification.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Bildirimi Sil
                  </button>
                </div>

                {selectedNotification.type === 'danismanlik' && selectedNotification.details && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-400">Ad</h3>
                        <p>{selectedNotification.details.firstName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-400">Soyad</h3>
                        <p>{selectedNotification.details.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-400">Telefon</h3>
                      <p>{selectedNotification.details.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-400">E-posta</h3>
                      <p>{selectedNotification.details.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-400">Beklentiler</h3>
                      <p className="whitespace-pre-wrap">{selectedNotification.details.expectations}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Detayları görüntülemek için bir bildirim seçin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 