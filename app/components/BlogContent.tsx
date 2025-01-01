'use client';

import { useEffect, useState } from 'react';
import LikeButton from './LikeButton';
import LikesList from './LikesList';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date?: string;
}

interface BlogContentProps {
  postId: string;
  defaultPost?: BlogPost;
}

export default function BlogContent({ postId, defaultPost }: BlogContentProps) {
  const [post, setPost] = useState<BlogPost | null>(defaultPost || null);

  useEffect(() => {
    // localStorage'dan blog yazılarını al
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    
    // ID'ye göre yazıyı bul
    const savedPost = savedPosts.find((p: BlogPost) => p.id === postId);
    
    // Eğer localStorage'da varsa onu kullan
    if (savedPost) {
      setPost(savedPost);
    }
  }, [postId]);

  if (!post) {
    return (
      <div className="text-red-400">
        Yazı bulunamadı!
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-white">
        {post.title}
      </h1>
      {post.date && (
        <p className="text-gray-500 mb-8">
          {new Date(post.date).toLocaleDateString('tr-TR')}
        </p>
      )}
      <div 
        className="prose prose-invert max-w-none prose-p:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="mt-8 border-t border-gray-800 pt-6">
        <LikeButton postId={post.id} />
        <LikesList postId={post.id} />
      </div>
    </>
  );
} 