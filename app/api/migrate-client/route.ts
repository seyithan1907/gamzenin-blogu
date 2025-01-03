import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  date: string;
  category?: {
    id: number;
    name: string;
  };
  image?: string | null;
  author?: string;
  views?: number;
  likes?: number;
  comments?: Array<{
    id: string;
    name: string;
    content: string;
    date: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const posts = await request.json();
    
    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'Geçerli veri gönderilmedi' },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını al
    const client = await clientPromise;
    const db = client.db("blog");
    
    // Her yazı için MongoDB'de _id oluştur
    const postsWithId = posts.map((post: BlogPost) => ({
      ...post,
      views: post.views || 0,
      likes: post.likes || 0,
      comments: post.comments || []
    }));

    // Yazıları MongoDB'ye aktar
    const result = await db.collection("posts").insertMany(postsWithId);

    return NextResponse.json({
      message: `${result.insertedCount} yazı başarıyla aktarıldı`,
      insertedIds: result.insertedIds
    });
  } catch (error) {
    console.error('Yazılar aktarılırken hata:', error);
    return NextResponse.json(
      { error: 'Yazılar aktarılamadı' },
      { status: 500 }
    );
  }
} 