'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogPosts, type BlogPost } from '@/lib/blog';

export default function PopularPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getBlogPosts();
        // En çok görüntülenen 5 yazıyı al
        const popularPosts = allPosts
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        setPosts(popularPosts);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => router.push(`/blog/${post.id}`)}
          className="w-full text-left p-3 rounded bg-gray-800 hover:bg-gray-700"
        >
          <h3 className="font-medium mb-1 line-clamp-2">{post.title}</h3>
          <div className="text-sm text-gray-400 flex items-center space-x-3">
            <span>{post.views || 0} görüntülenme</span>
            <span>•</span>
            <span>{post.likes || 0} beğeni</span>
          </div>
        </button>
      ))}
    </div>
  );
} 