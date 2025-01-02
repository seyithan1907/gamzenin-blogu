'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Comments from '@/app/components/Comments';

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

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: any[];
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);

    // Blog yazısını yükle
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const currentPost = posts.find((p: BlogPost) => p.id === params.id);
    
    if (!currentPost) {
      router.push('/');
      return;
    }

    setPost(currentPost);
  }, [params.id, router]);

  const handleDelete = () => {
    if (!isAdmin) return;

    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const updatedPosts = posts.filter((p: BlogPost) => p.id !== params.id);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      router.push('/');
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Üst Başlık */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              ← Ana Sayfaya Dön
            </Link>
            {isAdmin && (
              <div className="space-x-4">
                <Link
                  href={`/blog/${params.id}/duzenle`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Düzenle
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-400"
                >
                  Sil
                </button>
              </div>
            )}
          </div>

          {/* Blog İçeriği */}
          <article className="bg-gray-900 rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-400 mb-8">
              {new Date(post.date).toLocaleDateString('tr-TR')}
            </div>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Yorumlar */}
          <div className="mt-12">
            <Comments postId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 