'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import UsersList from '@/app/components/UsersList';

const ADMIN_USER = {
  username: "seyithan1907",
  password: "hsy190778"
};

export default function UsersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user !== ADMIN_USER.username) {
      router.push('/'); // Admin değilse ana sayfaya yönlendir
      return;
    }
    setIsAdmin(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Router yönlendirmesi yapılırken boş sayfa göster
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Header />
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-8">Üye Listesi</h1>
        <UsersList />
      </div>
    </div>
  );
} 