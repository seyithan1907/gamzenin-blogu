'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  registrationDate: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);

    if (!isAdminUser) {
      router.push('/');
      return;
    }

    setIsAdmin(true);

    // Üyeleri yükle
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, [router]);

  const handleDelete = (id: string) => {
    if (!isAdmin) return;

    if (window.confirm('Bu üyeyi silmek istediğinize emin misiniz?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Üst Başlık */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Üye Listesi</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-400">Henüz üye bulunmuyor.</p>
          ) : (
            <div className="grid gap-6">
              {users.map(user => (
                <div
                  key={user.id}
                  className="bg-gray-900 p-6 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-400">@{user.username}</p>
                      <p className="text-gray-400">{user.email}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Kayıt: {new Date(user.registrationDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 