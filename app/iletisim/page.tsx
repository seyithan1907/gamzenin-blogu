'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mevcut mesajları al
    const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');

    // Yeni mesaj oluştur
    const newMessage = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString(),
      status: 'unread',
      replied: false
    };

    // Mesajı listeye ekle
    const updatedMessages = [newMessage, ...existingMessages];
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));

    // Admin için bildirim oluştur
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      type: 'iletisim',
      message: `Yeni iletişim mesajı: ${formData.subject}`,
      date: new Date().toISOString(),
      read: false,
      details: newMessage
    };
    const updatedNotifications = [newNotification, ...existingNotifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Başarılı mesajı göster ve ana sayfaya yönlendir
    alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapılacaktır.');
    router.push('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">İletişim Formu</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          <p className="text-gray-400 mb-8">
            Sorularınız, önerileriniz veya geri bildirimleriniz için aşağıdaki formu doldurabilirsiniz.
            Size en kısa sürede dönüş yapacağız.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                E-posta Adresiniz
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Konu
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Mesajınız
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mesajı Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 