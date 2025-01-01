'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ConsultationForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  expectations: string;
}

export default function ConsultationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ConsultationForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    expectations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mevcut bildirimleri al
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');

    // Yeni bildirim oluştur
    const newNotification = {
      id: Date.now().toString(),
      type: 'danismanlik',
      message: `Yeni danışmanlık başvurusu: ${formData.firstName} ${formData.lastName}`,
      date: new Date().toISOString(),
      read: false,
      details: formData
    };

    // Bildirimi listeye ekle
    const updatedNotifications = [newNotification, ...existingNotifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Başvuru başarılı mesajı göster ve ana sayfaya yönlendir
    alert('Başvurunuz başarıyla alındı. En kısa sürede size dönüş yapılacaktır.');
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
            <h1 className="text-3xl font-bold">Online Danışmanlık Başvurusu</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
          
          <p className="text-gray-400 mb-8">
            Sağlıklı bir yaşam için profesyonel destek almak üzeresiniz. 
            Lütfen aşağıdaki formu doldurun, size en kısa sürede dönüş yapacağız.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Adınız
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Soyadınız
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Telefon Numaranız
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
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
                Diyetetik Beklentileriniz
              </label>
              <textarea
                name="expectations"
                required
                value={formData.expectations}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Hedefleriniz, özel durumlarınız ve beklentileriniz hakkında bilgi veriniz..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Başvuruyu Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 