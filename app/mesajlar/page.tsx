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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: "unread" | "read";
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

    // Mesajları yükle
    const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    setMessages(savedMessages);
  }, [router]);

  const handleStatusChange = (id: string) => {
    const updatedMessages = messages.map(message =>
      message.id === id
        ? { ...message, status: message.status === 'unread' ? 'read' : 'unread' }
        : message
    );

    setMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      const updatedMessages = messages.filter(message => message.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mesaj Kutusu</h1>
        
        {messages.length === 0 ? (
          <p className="text-gray-400">Henüz mesaj bulunmuyor.</p>
        ) : (
          <div className="grid gap-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`bg-gray-900 p-6 rounded-lg ${
                  message.status === 'unread' ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{message.name}</h2>
                    <p className="text-gray-400">{message.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleStatusChange(message.id)}
                      className={`px-3 py-1 rounded ${
                        message.status === 'unread'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {message.status === 'unread' ? 'Okundu İşaretle' : 'Okunmadı İşaretle'}
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                <p className="text-gray-500 text-sm mt-4">
                  {new Date(message.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 