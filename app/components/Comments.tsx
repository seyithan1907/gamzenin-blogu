'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  postId: string;
  username: string;
  content: string;
  date: string;
  parentId?: string; // Yanıt verilen yorumun ID'si
  replies?: Comment[]; // Alt yorumlar
}

interface CommentsProps {
  postId: string;
}

const ADMIN_USER = "seyithan1907";

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Kullanıcı giriş durumunu kontrol et
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setIsAdmin(user === ADMIN_USER);
    }

    // Yorumları yükle ve hiyerarşik yapıya dönüştür
    const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const postComments = savedComments.filter((comment: Comment) => comment.postId === postId);
    
    // Ana yorumları ve yanıtları düzenle
    const organizedComments = postComments.reduce((acc: Comment[], comment: Comment) => {
      if (!comment.parentId) {
        // Ana yorum
        const replies = postComments.filter(c => c.parentId === comment.id);
        return [...acc, { ...comment, replies }];
      }
      return acc;
    }, []);

    setComments(organizedComments);
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Lütfen bir yorum yazın');
      return;
    }

    // Yeni yorum oluştur
    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      username: currentUser!,
      content: newComment,
      date: new Date().toISOString(),
      parentId: replyTo?.id,
      replies: []
    };

    // Tüm yorumları al
    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    
    // Yeni yorumu ekle
    const updatedComments = [...allComments, comment];
    
    // LocalStorage'ı güncelle
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    
    // State'i güncelle
    if (replyTo) {
      // Yanıt ise, ana yorumun replies dizisine ekle
      setComments(prevComments => 
        prevComments.map(c => 
          c.id === replyTo.id 
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
    } else {
      // Ana yorum ise, direkt listeye ekle
      setComments(prev => [...prev, { ...comment, replies: [] }]);
    }
    
    // Formu temizle
    setNewComment('');
    setReplyTo(null);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={`bg-gray-800 p-4 rounded ${isReply ? 'ml-8 mt-2' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-blue-400">{comment.username}</span>
        <span className="text-gray-500 text-sm">
          {new Date(comment.date).toLocaleDateString('tr-TR')}
        </span>
      </div>
      <p className="text-gray-300 mb-2">{comment.content}</p>
      
      {/* Admin için yanıtlama butonu */}
      {isAdmin && !isReply && (
        <button
          onClick={() => setReplyTo(replyTo?.id === comment.id ? null : comment)}
          className="text-blue-400 text-sm hover:text-blue-300"
        >
          {replyTo?.id === comment.id ? 'Vazgeç' : 'Yanıtla'}
        </button>
      )}

      {/* Alt yorumlar */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>

      {/* Yorum Formu */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-2">
            {replyTo && (
              <div className="text-sm text-gray-400 mb-2">
                <span>{replyTo.username} kullanıcısına yanıt yazıyorsunuz</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-blue-400 hover:text-blue-300"
                >
                  Vazgeç
                </button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Yanıtınızı yazın..." : "Yorumunuzu yazın..."}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 min-h-[100px]"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {replyTo ? 'Yanıtla' : 'Yorum Yap'}
          </button>
        </form>
      )}

      {!isLoggedIn && (
        <p className="text-gray-400 mb-6">
          Yorum yapmak için lütfen <a href="/" className="text-blue-400 hover:text-blue-300">giriş yapın</a>.
        </p>
      )}

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">Henüz yorum yapılmamış.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
} 