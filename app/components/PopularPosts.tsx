import Link from 'next/link';
import Image from 'next/image';
import { type BlogPost } from '@/lib/blog';

interface PopularPostsProps {
  posts: BlogPost[];
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  // En çok görüntülenen 5 yazıyı al
  const popularPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-800">
      <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        Popüler Yazılar
      </h3>
      
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <Link 
            href={`/blog/${post.id}`} 
            key={post.id}
            className="group block"
          >
            <div className="flex items-start space-x-4 p-3 rounded-lg transition-colors
              hover:bg-gray-800/50">
              {/* Sıralama ve Küçük Resim */}
              <div className="flex-shrink-0 relative">
                {post.image ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 
                    flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-400/80">
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Başlık ve İstatistikler */}
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-200 font-medium mb-1 truncate group-hover:text-blue-400 
                  transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  {post.views !== undefined && (
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{post.views}</span>
                    </span>
                  )}
                  {post.likes !== undefined && (
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 