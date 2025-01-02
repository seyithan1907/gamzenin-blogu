'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminRequest {
  id: string;
  username: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  username: string;
  isAdmin: boolean;
  joinDate: string;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  registrationDate?: string;
}

export default function MemberManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [newAdmin, setNewAdmin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    setCurrentUser(user);
    
    const isAdminUser = user === 'seyithan1907' || user === 'gamzeaktas';
    setIsAdmin(isAdminUser);

    if (!isAdminUser) {
      router.push('/'); // Admin değilse ana sayfaya yönlendir
      return;
    }

    // Üyeleri ve admin isteklerini yükle
    const savedRequests = JSON.parse(localStorage.getItem('admin_requests') || '[]');
    setRequests(savedRequests);

    // Varsayılan adminler
    const defaultAdmins: User[] = [
      { 
        username: 'seyithan1907', 
        isAdmin: true, 
        joinDate: new Date().toISOString(),
        email: 'seyithan@example.com',
        firstName: 'Seyithan',
        lastName: 'Yıldız',
      },
      { 
        username: 'gamzeaktas', 
        isAdmin: true, 
        joinDate: new Date().toISOString(),
        email: 'gamze@example.com',
        firstName: 'Gamze',
        lastName: 'Aktaş',
      },
    ];

    // Kayıtlı üyeleri yükle
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Varsayılan adminleri ve kayıtlı üyeleri birleştir
    const allUsers = [...defaultAdmins];
    
    // Kayıtlı üyeleri ekle (eğer aynı kullanıcı adı yoksa)
    savedUsers.forEach((savedUser: User) => {
      if (!allUsers.some(user => user.username === savedUser.username)) {
        // Eğer joinDate yoksa şimdiki zamanı ekle
        if (!savedUser.joinDate) {
          savedUser.joinDate = new Date().toISOString();
        }
        allUsers.push(savedUser);
      }
    });

    // Admin listesinden gelen adminleri ekle
    const adminList = JSON.parse(localStorage.getItem('admins') || '[]');
    adminList.forEach((adminUsername: string) => {
      const existingUserIndex = allUsers.findIndex(u => u.username === adminUsername);
      if (existingUserIndex !== -1) {
        allUsers[existingUserIndex].isAdmin = true;
      }
    });

    setUsers(allUsers);
  }, [router]);

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

      // Üye listesini güncelle
      setUsers(prevUsers => {
        const userExists = prevUsers.find(u => u.username === request.username);
        if (userExists) {
          return prevUsers.map(u => 
            u.username === request.username ? { ...u, isAdmin: true } : u
          );
        } else {
          return [...prevUsers, {
            username: request.username,
            isAdmin: true,
            joinDate: new Date().toISOString(),
            email: undefined,
            firstName: undefined,
            lastName: undefined
          }];
        }
      });

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

  const handleDeleteUser = (username: string) => {
    if (!isAdmin) return;

    if (window.confirm(`${username} kullanıcısını silmek istediğinize emin misiniz?`)) {
      // Kullanıcıyı sil
      const updatedUsers = users.filter(user => user.username !== username);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Bildirim oluştur
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const notification = {
        id: Date.now().toString(),
        title: 'Üye Silindi',
        message: `${username} kullanıcısı silindi.`,
        date: new Date().toISOString(),
        type: 'user_deleted',
        isActive: true
      };
      localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));
    }
  };

  if (!isAdmin) return null;

  const adminUsers = users.filter(user => user.isAdmin);
  const regularUsers = users.filter(user => !user.isAdmin)
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık ve Ana Sayfa Butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Üye Yönetimi</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Ana Sayfaya Dön
        </button>
      </div>

      {/* Admin Listesi */}
      <div className="bg-gray-900 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-6">Adminler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminUsers.map((admin) => (
            <div key={admin.username} className="bg-gray-800 p-4 rounded">
              <p 
                className="font-medium text-green-500 cursor-pointer hover:underline"
                onClick={() => setSelectedUser(admin)}
              >
                {admin.username}
              </p>
              <p className="text-sm text-gray-400">
                Katılım: {new Date(admin.joinDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Üye Listesi */}
      <div className="bg-gray-900 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Üyeler</h2>
          <div className="w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Üye ara..."
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-4">Kullanıcı Adı</th>
                <th className="pb-4">Katılım Tarihi</th>
                <th className="pb-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.map((user) => (
                <tr key={user.username} className="border-b border-gray-800">
                  <td className="py-4">
                    <span 
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.username}
                    </span>
                  </td>
                  <td className="py-4">{new Date(user.joinDate).toLocaleDateString('tr-TR')}</td>
                  <td className="py-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setNewAdmin(user.username)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Admin Yap
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin İstekleri */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-6">Admin İstekleri</h2>
        
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

        {/* İstek Listesi */}
        <div className="space-y-4">
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

      {/* Üye Profili Modalı */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Üye Profili</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p>
                <span className="text-gray-400">Kullanıcı Adı:</span>{' '}
                <span className="font-medium">{selectedUser.username}</span>
              </p>
              {selectedUser.firstName && (
                <p>
                  <span className="text-gray-400">Ad:</span>{' '}
                  <span className="font-medium">{selectedUser.firstName}</span>
                </p>
              )}
              {selectedUser.lastName && (
                <p>
                  <span className="text-gray-400">Soyad:</span>{' '}
                  <span className="font-medium">{selectedUser.lastName}</span>
                </p>
              )}
              {selectedUser.email && (
                <p>
                  <span className="text-gray-400">E-posta:</span>{' '}
                  <span className="font-medium">{selectedUser.email}</span>
                </p>
              )}
              <p>
                <span className="text-gray-400">Yetki:</span>{' '}
                <span className={`font-medium ${selectedUser.isAdmin ? 'text-green-500' : 'text-gray-300'}`}>
                  {selectedUser.isAdmin ? 'Admin' : 'Üye'}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Katılım Tarihi:</span>{' '}
                <span className="font-medium">
                  {new Date(selectedUser.joinDate).toLocaleDateString('tr-TR')}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 