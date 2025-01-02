'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_USERS = [
  {
    username: "seyithan1907",
    password: "hsy190778"
  },
  {
    username: "gamzeaktas",
    password: "gamze6302"
  }
];

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isActive: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const
  });

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    const password = localStorage.getItem('password');
    const isAdminUser = ADMIN_USERS.some(admin => 
      admin.username === user && admin.password === password
    );

    if (!isAdminUser) {
      router.push('/');
      return;
    }

    setIsAdmin(true);

    // Bildirimleri yükle
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(savedNotifications);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      date: new Date().toISOString(),
      isActive: true
    };

    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    setNewNotification({
      title: '',
      message: '',
      type: 'info'
    });
  };

  const toggleNotification = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id
        ? { ...notification, isActive: !notification.isActive }
        : notification
    );

    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: string) => {
    if (window.confirm('Bu bildirimi silmek istediğinize emin misiniz?')) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Bildirim Yönetimi</h1>

        {/* Yeni Bildirim Formu */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Yeni Bildirim Oluştur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Mesaj
              </label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tür
              </label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              >
                <option value="info">Bilgi</option>
                <option value="success">Başarı</option>
                <option value="warning">Uyarı</option>
                <option value="error">Hata</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bildirimi Yayınla
            </button>
          </form>
        </div>

        {/* Bildirim Listesi */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-400">Henüz bildirim bulunmuyor.</p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-gray-900 p-6 rounded-lg border-l-4 ${
                  notification.type === 'info' ? 'border-blue-500' :
                  notification.type === 'success' ? 'border-green-500' :
                  notification.type === 'warning' ? 'border-yellow-500' :
                  'border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{notification.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(notification.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={`px-3 py-1 rounded ${
                        notification.isActive
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {notification.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{notification.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 