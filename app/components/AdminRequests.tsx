'use client';

import { useState, useEffect } from 'react';

interface AdminRequest {
  id: string;
  username: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [newAdmin, setNewAdmin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    setCurrentUser(user);
    
    const isAdminUser = user === 'seyithan1907' || user === 'gamzeaktas';
    setIsAdmin(isAdminUser);

    // Admin isteklerini yükle
    const savedRequests = JSON.parse(localStorage.getItem('admin_requests') || '[]');
    setRequests(savedRequests);
  }, []);

  const handleNewAdminRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.trim() || !currentUser) return;

    // Yeni istek oluştur
    const newRequest: AdminRequest = {
      id: Date.now().toString(),
      username: newAdmin.trim(),
      requestedBy: currentUser,
      date: new Date().toISOString(),
      status: 'pending'
    };

    // İstekleri güncelle
    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem('admin_requests', JSON.stringify(updatedRequests));

    // Formu temizle
    setNewAdmin('');

    // Bildirim oluştur
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notification = {
      id: Date.now().toString(),
      title: 'Yeni Admin İsteği',
      message: `${currentUser} kullanıcısı, ${newAdmin} kullanıcısını admin yapmak istiyor.`,
      date: new Date().toISOString(),
      type: 'admin_request',
      isActive: true
    };
    localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));
  };

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    // İsteği güncelle
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return { ...request, status: action };
      }
      return request;
    });
    setRequests(updatedRequests);
    localStorage.setItem('admin_requests', JSON.stringify(updatedRequests));

    // İstek onaylandıysa admin listesini güncelle
    const request = requests.find(r => r.id === requestId);
    if (action === 'approved' && request) {
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      admins.push(request.username);
      localStorage.setItem('admins', JSON.stringify(admins));

      // Bildirim oluştur
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const notification = {
        id: Date.now().toString(),
        title: 'Admin İsteği Onaylandı',
        message: `${request.username} kullanıcısı artık admin yetkilerine sahip.`,
        date: new Date().toISOString(),
        type: 'admin_request',
        isActive: true
      };
      localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Admin Yönetimi</h2>

      {/* Yeni Admin Ekleme Formu */}
      <form onSubmit={handleNewAdminRequest} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
            placeholder="Kullanıcı adı"
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Admin Yap
          </button>
        </div>
      </form>

      {/* Admin İstekleri Listesi */}
      <div className="space-y-4">
        <h3 className="font-bold mb-4">Admin İstekleri</h3>
        {requests.length === 0 ? (
          <p className="text-gray-400">Henüz admin isteği bulunmuyor.</p>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{request.username}</p>
                <p className="text-sm text-gray-400">
                  İsteyen: {request.requestedBy} | {new Date(request.date).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-sm mt-1">
                  Durum:{' '}
                  <span
                    className={`${
                      request.status === 'pending'
                        ? 'text-yellow-500'
                        : request.status === 'approved'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {request.status === 'pending'
                      ? 'Bekliyor'
                      : request.status === 'approved'
                      ? 'Onaylandı'
                      : 'Reddedildi'}
                  </span>
                </p>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequestAction(request.id, 'approved')}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reddet
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 