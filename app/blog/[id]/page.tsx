'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/components/Header';
import { getBlogPost, updateBlogPost, deleteBlogPost, incrementViews, type BlogPost } from '@/lib/blog';
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
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);

    const loadPost = async () => {
      try {
        const postData = await getBlogPost(params.id);
        if (postData) {
          setPost(postData);
          await incrementViews(params.id);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    const loadComments = async () => {
      try {
        const commentsData = await getComments(params.id);
        setComments(commentsData);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    loadPost();
    loadComments();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteBlogPost(params.id);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      setError('Blog yazısı silinirken bir hata oluştu');
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const updatedPost = await updateBlogPost(params.id, {
        likes: (post.likes || 0) + 1
      });

      if (updatedPost) {
        setPost(updatedPost);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Beğeni eklenirken bir hata oluştu');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !commentAuthor.trim()) {
      alert('Lütfen yorum ve isim alanlarını doldurun');
      return;
    }

    try {
      await addComment({
        post_id: params.id,
        author: commentAuthor,
        content: newComment,
        created_at: new Date().toISOString()
      });

      // Yorumları yeniden yükle
      const commentsData = await getComments(params.id);
      setComments(commentsData);

      // Formu temizle
      setNewComment('');
      setCommentAuthor('');
    } catch (err) {
      console.error('Error:', err);
      setError('Yorum eklenirken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p className="text-red-500">{error || 'Blog yazısı bulunamadı'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto p-8">
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

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-400 mb-8">
          <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
          <span className="mx-2">•</span>
          <span>{post.category.name}</span>
          {post.author && (
            <>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </>
          )}
          <span className="mx-2">•</span>
          <span>{post.views || 0} görüntülenme</span>
        </div>

        {post.summary && (
          <div className="text-xl text-gray-300 mb-8">
            {post.summary}
          </div>
        )}

        <div className="prose prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
          >
            <span>👍</span>
            <span>{post.likes || 0} beğeni</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => router.push(`/blog/duzenle/${params.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Düzenle
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sil
              </button>
            </>
          )}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-4">Yorumlar ({comments.length})</h2>
          
          <form onSubmit={handleComment} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                İsminiz
              </label>
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Yorumunuz
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
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

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-800 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
} 