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
  likes?: number;
  comments?: Array<{
    id: string;
    name: string;
    content: string;
    date: string;
  }>;
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comment, setComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Blog yazısını yükle
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const foundPost = savedPosts.find((p: BlogPost) => p.id === params.id);
    
    if (!foundPost) {
      router.push('/');
      return;
    }

    // Eğer likes ve comments yoksa ekle
    if (!foundPost.likes) foundPost.likes = 0;
    if (!foundPost.comments) foundPost.comments = [];

    setPost(foundPost);

    // Admin kontrolü
    const user = localStorage.getItem('user');
    const isAdminUser = user === 'seyithan1907' || user === 'gamzeaktas';
    setIsAdmin(isAdminUser);

    // Beğeni kontrolü
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    setIsLiked(likedPosts.includes(params.id));
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

  const handleLike = () => {
    if (!post) return;

    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    const newIsLiked = !isLiked;
    
    // Beğeni durumunu güncelle
    if (newIsLiked) {
      likedPosts.push(post.id);
      post.likes! += 1;
    } else {
      const index = likedPosts.indexOf(post.id);
      if (index > -1) {
        likedPosts.splice(index, 1);
        post.likes! -= 1;
      }
    }

    // Değişiklikleri kaydet
    localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
    setIsLiked(newIsLiked);

    // Blog yazısını güncelle
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const updatedPosts = savedPosts.map((p: BlogPost) => 
      p.id === post.id ? post : p
    );
    localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
    setPost({ ...post });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !comment.trim() || !commentName.trim()) return;

    // Yeni yorum ekle
    const newComment = {
      id: Date.now().toString(),
      name: commentName,
      content: comment,
      date: new Date().toISOString()
    };

    post.comments!.push(newComment);

    // Blog yazısını güncelle
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const updatedPosts = savedPosts.map((p: BlogPost) => 
      p.id === post.id ? post : p
    );
    localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
    
    // Formu temizle
    setComment('');
    setCommentName('');
    setPost({ ...post });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${post?.title} - Gamzenin Bloğu`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
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
            className="prose prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Beğeni ve Paylaşım */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    isLiked ? 'bg-pink-600' : 'bg-gray-800'
                  }`}
                >
                  {isLiked ? '❤️' : '🤍'} {post.likes} Beğeni
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleShare('twitter')}
                  className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded"
                >
                  Twitter'da Paylaş
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Facebook'ta Paylaş
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  WhatsApp'ta Paylaş
                </button>
              </div>
            </div>
          </div>

          {/* Yorumlar */}
          <div className="border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold mb-6">Yorumlar ({post.comments?.length || 0})</h2>
            
            {/* Yorum Formu */}
            <form onSubmit={handleComment} className="mb-8">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Adınız
                </label>
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full p-2 bg-gray-800 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Yorumunuz
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 bg-gray-800 rounded"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Yorum Yap
              </button>
            </form>

            {/* Yorum Listesi */}
            <div className="space-y-6">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-900 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{comment.name}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(comment.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
} 