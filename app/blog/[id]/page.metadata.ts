import { getBlogPost } from '@/lib/blog';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id);
  
  if (!post) {
    return {
      title: 'Yazı Bulunamadı | Gamzenin Bloğu',
      description: 'Aradığınız blog yazısı bulunamadı.',
    };
  }

  return {
    title: `${post.title} | Gamzenin Bloğu`,
    description: post.summary || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.summary || post.content.substring(0, 160),
      url: `https://gamzenin-blogu.vercel.app/blog/${post.id}`,
      siteName: 'Gamzenin Bloğu',
      images: post.image ? [{ url: post.image }] : [],
      locale: 'tr_TR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || post.content.substring(0, 160),
      images: post.image ? [post.image] : [],
    },
  };
} 