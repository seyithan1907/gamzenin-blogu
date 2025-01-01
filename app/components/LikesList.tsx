'use client';

import { useState, useEffect } from 'react';

interface LikesListProps {
  postId: string;
}

export default function LikesList({ postId }: LikesListProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);

  useEffect(() => {
    // Admin kontrolü
    const currentUser = localStorage.getItem('user');
    setIsAdmin(currentUser === 'seyithan1907');

    // Beğenileri al
    const likeData = JSON.parse(localStorage.getItem(`likes_${postId}`) || '{"count": 0, "users": []}');
    setLikes(likeData.users);
  }, [postId]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
      <h3 className="text-white font-semibold mb-2">Bu Yazıyı Beğenenler:</h3>
      {likes.length > 0 ? (
        <ul className="space-y-1">
          {likes.map((user, index) => (
            <li key={index} className="text-gray-400">
              {user}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Henüz beğeni yok</p>
      )}
    </div>
  );
} 