'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
  replied: boolean;
  reply?: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user !== 'seyithan1907') {
      router.push('/');
      return;
    }
    setCurrentUser(user);

    const storedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    setMessages(storedMessages);
  }, [router]);

  const markAsRead = (message: ContactMessage) => {
    const updatedMessages = messages.map(m => {
      if (m.id === message.id) {
        return { ...m, status: 'read' as const };
      }
      return m;
    });

    setMessages(updatedMessages);
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
    setSelectedMessage({ ...message, status: 'read' as const });
  };

  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    // E-posta gönderme simülasyonu
    console.log('E-posta gönderiliyor:', {
      to: selectedMessage.email,
      subject: `Re: ${selectedMessage.subject}`,
      message: replyText
    });

    // Mesajı güncelle
    const updatedMessages = messages.map(m => {
      if (m.id === selectedMessage.id) {
        return {
          ...m,
          replied: true,
          reply: replyText
        };
      }
      return m;
    });

    setMessages(updatedMessages);
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
    setSelectedMessage({ ...selectedMessage, replied: true, reply: replyText });
    setReplyText('');

    alert('Yanıtınız başarıyla gönderildi!');
  };

  const deleteMessage = (id: string) => {
    if (window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      const updatedMessages = messages.filter(m => m.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
      setSelectedMessage(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">İletişim Mesajları</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mesaj Listesi */}
          <div className="md:col-span-1 bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tüm Mesajlar</h2>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-400">Mesaj bulunmuyor</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-900'
                        : 'bg-gray-800 hover:bg-gray-700'
                    } ${message.status === 'unread' ? 'border-l-4 border-blue-500' : ''}`}
                    onClick={() => markAsRead(message)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{message.subject}</p>
                        <p className="text-sm text-gray-400">{message.name}</p>
                      </div>
                      {message.replied && (
                        <span className="px-2 py-1 text-xs bg-green-600 rounded">
                          Yanıtlandı
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(message.date).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mesaj Detayları ve Yanıt */}
          <div className="md:col-span-2 bg-gray-900 rounded-lg p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                    <p className="text-gray-400">
                      Gönderen: {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(selectedMessage.date).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Mesajı Sil
                  </button>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {selectedMessage.replied ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Yanıtınız:</h3>
                    <div className="bg-gray-800 p-4 rounded">
                      <p className="whitespace-pre-wrap">{selectedMessage.reply}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Yanıt Yaz</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={6}
                      className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Yanıtınızı buraya yazın..."
                    />
                    <button
                      onClick={handleReply}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Yanıtı Gönder
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Detayları görüntülemek için bir mesaj seçin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 