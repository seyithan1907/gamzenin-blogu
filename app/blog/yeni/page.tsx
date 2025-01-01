'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';
import Header from '@/app/components/Header';
import Image from 'next/image';

// Kategoriler
const CATEGORIES = [
  { id: 1, name: 'Sağlıklı Tarifler' },
  { id: 2, name: 'Beslenme Bilimi' },
  { id: 3, name: 'Diyet Türleri' },
  { id: 4, name: 'Hastalık ve Beslenme' },
  { id: 5, name: 'Fitness ve Sporcu Beslenmesi' },
  { id: 6, name: 'Yeme Alışkanlıkları ve Psikoloji' },
  { id: 7, name: 'Beslenme ve Çocuklar' },
  { id: 8, name: 'Yaşam Tarzı ve Beslenme' },
  { id: 9, name: 'Güncel Diyet Trendleri' },
  { id: 10, name: 'Bitkisel Beslenme ve Veganlık' },
  { id: 11, name: 'Detoks ve Arınma' },
  { id: 12, name: 'Kilo Alma ve Verme Stratejileri' },
  { id: 13, name: 'Sağlık İpuçları ve Tüyolar' },
  { id: 14, name: 'Uzman Görüşleri ve Röportajlar' },
  { id: 15, name: 'Gıda Güvenliği ve Etiket Okuma' }
];

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user === 'seyithan1907') {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else {
      router.push('/');
    }
  }, [router]);

  // Resim yükleme fonksiyonu
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert('Lütfen başlık, kategori ve içerik alanlarını doldurun!');
      return;
    }

    // Mevcut blog yazılarını al
    const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');

    // Kategori bilgisini al
    const selectedCategory = CATEGORIES.find(c => c.id === parseInt(category));

    // Yeni yazıyı ekle
    const newPost = {
      id: Date.now().toString(),
      title,
      summary,
      content,
      category: {
        id: selectedCategory?.id,
        name: selectedCategory?.name
      },
      date: new Date().toISOString(),
      image: image // Resmi de kaydet
    };

    // Yazıları güncelle
    localStorage.setItem('blog_posts', JSON.stringify([...existingPosts, newPost]));

    // Ana sayfaya yönlendir
    router.push('/');
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Header />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Yeni Yazı Ekle</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">
              Kapak Fotoğrafı
              <span className="text-sm text-gray-400 ml-2">
                (Önerilen boyut: 1200x630 piksel)
              </span>
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
              {image && (
                <div className="relative w-full h-64">
                  <Image
                    src={image}
                    alt="Kapak fotoğrafı önizleme"
                    fill
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    Kaldır
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg mb-2">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Kategori seçin</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg mb-2">
              Özet
              <span className="text-sm text-gray-400 ml-2">
                (Ana sayfada görünecek kısa açıklama)
              </span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              rows={3}
              maxLength={150}
              placeholder="Yazınız için kısa bir özet girin (en fazla 150 karakter)"
            />
            <p className="text-sm text-gray-400 mt-1">
              {summary.length}/150 karakter
            </p>
          </div>

          <div>
            <label className="block text-lg mb-2">İçerik</label>
            <Editor
              apiKey="7nypjsdnr897d1t2j0psecllg4pct25cqbzw2xqcthksbok5"
              initialValue=""
              init={{
                height: 500,
                menubar: true,
                disabled: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                branding: false,
                promotion: false,
                skin: 'oxide-dark',
                content_css: 'dark'
              }}
              onEditorChange={(newContent) => setContent(newContent)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Yazıyı Yayınla
          </button>
        </form>
      </div>
    </div>
  );
} 