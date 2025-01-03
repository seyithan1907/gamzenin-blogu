'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';
import Header from '@/app/components/Header';
import { createBlogPost } from '@/lib/blog';

interface Category {
  id: number;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  date: string;
  image: string | null;
  author: string | null;
}

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

export default function YeniBlogYazisi() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [image, setImage] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>('Gamze');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newPost = {
        title,
        summary,
        content,
        category,
        date: new Date().toISOString(),
        image,
        author
      };

      const result = await createBlogPost(newPost);

      if (result) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Blog yazısı eklenirken bir hata oluştu');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı</h1>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-2">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
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
            <label className="block text-lg mb-2">Kategori</label>
            <select
              value={category.id}
              onChange={(e) => {
                const selectedCategory = CATEGORIES.find(c => c.id === Number(e.target.value));
                if (selectedCategory) {
                  setCategory(selectedCategory);
                }
              }}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg mb-2">İçerik</label>
            <Editor
              apiKey="7nypjsdnr897d1t2j0psecllg4pct25cqbzw2xqcthksbok5"
              initialValue=""
              init={{
                height: 500,
                menubar: true,
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
                skin: 'oxide-dark',
                content_css: 'dark'
              }}
              onEditorChange={(newContent) => setContent(newContent)}
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Yazar</label>
            <input
              type="text"
              value={author || ''}
              onChange={(e) => setAuthor(e.target.value || null)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Resim URL</label>
            <input
              type="url"
              value={image || ''}
              onChange={(e) => setImage(e.target.value || null)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 