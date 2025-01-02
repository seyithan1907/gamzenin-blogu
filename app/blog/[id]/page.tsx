'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  date: string;
  category?: {
    id: number;
    name: string;
  };
  image?: string | null;
  author?: string;
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Blog yazısını yükle
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const foundPost = savedPosts.find((p: BlogPost) => p.id === params.id);
    
    if (!foundPost) {
      router.push('/');
      return;
    }

    setPost(foundPost);

    // Admin kontrolü
    const user = localStorage.getItem('user');
    const isAdminUser = user === 'seyithan1907' || user === 'gamzeaktas';
    setIsAdmin(isAdminUser);
  }, [params.id, router]);

  const handleDelete = () => {
    if (!isAdmin || !post) return;

    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      const updatedPosts = savedPosts.filter((p: BlogPost) => p.id !== post.id);
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
      router.push('/');
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Üst Başlık ve Kontroller */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              ← Ana Sayfaya Dön
            </Link>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-400"
              >
                Yazıyı Sil
              </button>
            )}
          </div>

          {/* Kapak Resmi */}
          {post.image && (
            <div className="relative w-full h-96 mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          {/* Başlık ve Meta Bilgiler */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              {post.category && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded">
                  {post.category.name}
                </span>
              )}
              {post.author && <span>Yazar: {post.author}</span>}
              <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
            </div>
          </header>

          {/* İçerik */}
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
} 