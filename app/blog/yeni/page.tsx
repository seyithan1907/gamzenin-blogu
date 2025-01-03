'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function YeniBlogYazisi() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>({ id: 1, name: 'Genel' });
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Özet</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">İçerik</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori</label>
          <select
            value={category.id}
            onChange={(e) => setCategory({ id: Number(e.target.value), name: e.target.options[e.target.selectedIndex].text })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="1">Genel</option>
            <option value="2">Teknoloji</option>
            <option value="3">Yaşam</option>
            <option value="4">Seyahat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Yazar</label>
          <input
            type="text"
            value={author || ''}
            onChange={(e) => setAuthor(e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Resim URL</label>
          <input
            type="url"
            value={image || ''}
            onChange={(e) => setImage(e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 