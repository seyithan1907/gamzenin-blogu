'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

export default function MigratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const handleMigrate = async () => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    const isAdmin = ADMIN_USERS.some(admin => admin.username === user);
    
    if (!isAdmin) {
      alert('Bu sayfaya erişim yetkiniz yok!');
      router.push('/');
      return;
    }

    setLoading(true);
    try {
      // localStorage'dan blog yazılarını al
      const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      addLog(`${posts.length} blog yazısı bulundu.`);

      // Her yazı için
      for (const post of posts) {
        try {
          // Yazıyı Supabase'e ekle
          const { data, error } = await supabase
            .from('blog_posts')
            .insert([{
              title: post.title,
              content: post.content,
              summary: post.summary,
              date: post.date,
              category: post.category,
              image: post.image,
              author: post.author,
              views: post.views || 0,
              likes: post.likes || 0
            }])
            .select()
            .single();

          if (error) {
            addLog(`Hata: ${post.title} yazısı eklenirken hata oluştu: ${error.message}`);
            continue;
          }

          addLog(`Başarılı: ${post.title} yazısı eklendi.`);

          // Eğer yorumlar varsa, onları da ekle
          if (post.comments && post.comments.length > 0) {
            for (const comment of post.comments) {
              const { error: commentError } = await supabase
                .from('comments')
                .insert([{
                  post_id: data.id,
                  name: comment.name,
                  content: comment.content,
                  date: comment.date
                }]);

              if (commentError) {
                addLog(`Hata: ${post.title} yazısının yorumu eklenirken hata oluştu: ${commentError.message}`);
              }
            }
            addLog(`Başarılı: ${post.title} yazısının ${post.comments.length} yorumu eklendi.`);
          }
        } catch (error) {
          addLog(`Hata: ${post.title} yazısı işlenirken hata oluştu: ${error}`);
        }
      }

      addLog('Migrasyon tamamlandı!');
      alert('Migrasyon başarıyla tamamlandı!');
    } catch (error) {
      addLog(`Kritik hata: ${error}`);
      alert('Migrasyon sırasında bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Veri Taşıma</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <p className="text-gray-400 mb-6">
            Bu sayfa, localStorage'daki blog yazılarını ve yorumları Supabase veritabanına taşımak için kullanılır.
            İşlem başladıktan sonra tamamlanana kadar bekleyin.
          </p>

          <button
            onClick={handleMigrate}
            disabled={loading}
            className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Veriler Taşınıyor...' : 'Verileri Taşımaya Başla'}
          </button>
        </div>

        {logs.length > 0 && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">İşlem Kayıtları</h2>
            <div className="bg-black p-4 rounded-lg max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    log.startsWith('Hata')
                      ? 'text-red-400'
                      : log.startsWith('Başarılı')
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 