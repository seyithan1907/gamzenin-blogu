'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import { getBlogPost, updateBlogPost, deleteBlogPost, incrementViews, updateLikes, type BlogPost } from '@/lib/blog';
import { getComments, addComment, type Comment } from '@/lib/comments';

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

export default function BlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comment, setComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Blog yazısını yükle
        const postData = await getBlogPost(params.id);
        if (!postData) {
          router.push('/');
          return;
        }
        setPost(postData);
        
        // Yorumları yükle
        const commentsData = await getComments(params.id);
        setComments(commentsData);
        
        // Görüntülenme sayısını artır
        await incrementViews(params.id);
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    // Admin kontrolü
    const user = localStorage.getItem('user');
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);

    // Beğeni kontrolü
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    setIsLiked(likedPosts.includes(params.id));

    loadData();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!isAdmin || !post) return;

    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      const success = await deleteBlogPost(post.id);
      if (success) {
        router.push('/');
      } else {
        alert('Yazı silinirken bir hata oluştu.');
      }
    }
  };

  const handleLike = async () => {
    if (!post) return;

    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    const newIsLiked = !isLiked;
    
    try {
      const updatedPost = await updateLikes(post.id, newIsLiked);
      if (updatedPost) {
        // Beğeni durumunu güncelle
        if (newIsLiked) {
          likedPosts.push(post.id);
        } else {
          const index = likedPosts.indexOf(post.id);
          if (index > -1) {
            likedPosts.splice(index, 1);
          }
        }
        
        localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
        setIsLiked(newIsLiked);
        setPost(updatedPost);
      }
    } catch (error) {
      console.error('Beğeni güncellenirken hata:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !comment.trim() || !commentName.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await addComment({
        post_id: post.id,
        name: commentName,
        content: comment
      });

      if (newComment) {
        setComments([...comments, newComment]);
        setComment('');
        setCommentName('');
      }
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
      alert('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold mb-6">Yorumlar ({comments.length})</h2>
            
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
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
              </button>
            </form>

            {/* Yorum Listesi */}
            <div className="space-y-6">
              {comments.map((comment) => (
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

          {/* İstatistikler ve Beğeni Butonu */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views || 0} görüntülenme</span>
              </span>
              <button 
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes || 0} beğeni</span>
              </button>
            </div>

            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Ana Sayfaya Dön</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
} 