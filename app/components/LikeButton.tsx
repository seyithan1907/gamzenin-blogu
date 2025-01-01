'use client';

import { useState, useEffect } from 'react';

interface Like {
  postId: string;
  username: string;
  date: string;
}

interface LikeButtonProps {
  postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Kullanıcı giriş durumunu kontrol et
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }

    // Beğenileri yükle
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    const postLikes = likes.filter((like: Like) => like.postId === postId);
    setLikeCount(postLikes.length);

    // Kullanıcının beğeni durumunu kontrol et
    if (user) {
      const userLiked = postLikes.some((like: Like) => like.username === user);
      setIsLiked(userLiked);
    }
  }, [postId]);

  const handleLike = () => {
    if (!isLoggedIn) {
      alert('Beğenmek için giriş yapmalısınız!');
      return;
    }

    const likes = JSON.parse(localStorage.getItem('likes') || '[]');

    if (isLiked) {
      // Beğeniyi kaldır
      const updatedLikes = likes.filter(
        (like: Like) => !(like.postId === postId && like.username === currentUser)
      );
      localStorage.setItem('likes', JSON.stringify(updatedLikes));
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      // Beğeni ekle
      const newLike: Like = {
        postId,
        username: currentUser!,
        date: new Date().toISOString()
      };
      const updatedLikes = [...likes, newLike];
      localStorage.setItem('likes', JSON.stringify(updatedLikes));
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded-lg ${
          isLiked 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-gray-700 text-white hover:bg-gray-600'
        } transition-colors`}
      >
        {isLiked ? 'Beğenildi' : 'Beğen'}
      </button>
      <span className="text-gray-400">
        {likeCount} beğeni
      </span>
    </div>
  );
} 