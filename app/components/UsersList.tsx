'use client';

import { useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

const SUPER_ADMIN = "seyithan1907";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showAdminConfirmation, setShowAdminConfirmation] = useState<string | null>(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, []);

  const handleDeleteUser = (username: string) => {
    // Eğer silinecek kullanıcı admin ise ve işlemi yapan süper admin değilse, silme işlemini engelle
    const currentUser = localStorage.getItem('user');
    const targetUser = users.find(u => u.username === username);
    
    if (targetUser?.isAdmin && currentUser !== SUPER_ADMIN) {
      alert('Admin kullanıcıları sadece süper admin silebilir!');
      return;
    }

    const updatedUsers = users.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowConfirmation(null);
  };

  const handleToggleAdmin = (username: string) => {
    const updatedUsers = users.map(user => {
      if (user.username === username) {
        return { ...user, isAdmin: !user.isAdmin };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowAdminConfirmation(null);
  };

  const currentUser = localStorage.getItem('user');

  return (
    <div className="bg-gray-900 p-6 rounded-lg mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Üyeler</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.username} className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <p className="text-white font-medium">
                {user.username}
                {user.isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-blue-600 text-xs text-white rounded">
                    Admin
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin yapma/çıkarma butonu - sadece süper admin görebilir */}
              {currentUser === SUPER_ADMIN && user.username !== SUPER_ADMIN && (
                <>
                  {showAdminConfirmation === user.username ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm">
                        {user.isAdmin ? 'Admin yetkisini kaldır?' : 'Admin yap?'}
                      </span>
                      <button
                        onClick={() => handleToggleAdmin(user.username)}
                        className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Evet
                      </button>
                      <button
                        onClick={() => setShowAdminConfirmation(null)}
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAdminConfirmation(user.username)}
                      className={`px-3 py-1 ${
                        user.isAdmin ? 'bg-yellow-600' : 'bg-blue-600'
                      } text-white text-sm rounded hover:opacity-90`}
                    >
                      {user.isAdmin ? 'Yetkiyi Kaldır' : 'Admin Yap'}
                    </button>
                  )}
                </>
              )}

              {/* Silme butonu */}
              {(currentUser === SUPER_ADMIN || (!user.isAdmin && currentUser !== user.username)) && (
                <>
                  {showConfirmation === user.username ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm">Emin misiniz?</span>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Evet
                      </button>
                      <button
                        onClick={() => setShowConfirmation(null)}
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmation(user.username)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Sil
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 