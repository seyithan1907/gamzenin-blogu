'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/components/Header';
import { getBlogPost, updateBlogPost, deleteBlogPost, incrementViews, getLikeStatus, toggleLike, type BlogPost } from '@/lib/blog';
import { getComments, addComment, deleteComment, type Comment } from '@/lib/comments';
import AdBanner from '@/app/components/AdBanner';
import Script from 'next/script';

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

// Schema.org verisi oluşturucu
function generateSchemaOrg(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Gamze Aktaş',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gamzenin Bloğu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gamzenin-blogu.vercel.app/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gamzenin-blogu.vercel.app/blog/${post.id}`,
    },
  };
}

function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center space-x-4 mb-8">
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
        </svg>
        <span>Paylaş</span>
      </a>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1da1f2] hover:bg-[#1a91da] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.58v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
        </svg>
        <span>Tweet</span>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25d366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>Paylaş</span>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0077b5] hover:bg-[#006399] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span>Paylaş</span>
      </a>
    </div>
  );
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);
    setUser(user);

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

    const checkLikeStatus = async () => {
      if (user) {
        const liked = await getLikeStatus(params.id, user);
        setIsLiked(liked);
      }
    };

    loadPost();
    loadComments();
    checkLikeStatus();
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
    if (!post || !user) {
      alert('Beğeni yapabilmek için giriş yapmalısınız');
      return;
    }

    try {
      await toggleLike(params.id, user);
      const updatedPost = await getBlogPost(params.id);
      if (updatedPost) {
        setPost(updatedPost);
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Beğeni işlemi sırasında bir hata oluştu');
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

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      // Yorumları yeniden yükle
      const commentsData = await getComments(params.id);
      setComments(commentsData);
    } catch (err) {
      console.error('Error:', err);
      setError('Yorum silinirken bir hata oluştu');
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
      <Script id="schema-org" type="application/ld+json">
        {JSON.stringify(generateSchemaOrg(post))}
      </Script>
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

        {/* Sosyal medya paylaşım butonları */}
        <ShareButtons 
          url={`https://gamzenin-blogu.vercel.app/blog/${post.id}`}
          title={post.title}
        />

        {post.summary && (
          <div className="text-xl text-gray-300 mb-8">
            {post.summary}
          </div>
        )}

        <AdBanner />

        <div className="prose prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        <AdBanner />

        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded ${
              isLiked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
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

          <div className="space-y-6 mt-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white">{comment.author}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-400"
                      title="Yorumu Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-gray-300 mt-2">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
} 