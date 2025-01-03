import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // MongoDB bağlantısını al
    const client = await clientPromise;
    const db = client.db("blog");
    
    // Mevcut yazıları localStorage'dan al
    const posts = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('blog_posts') || '[]') : [];
    
    if (posts.length === 0) {
      return NextResponse.json({ message: 'Aktarılacak yazı bulunamadı' });
    }

    // Her yazı için MongoDB'de _id oluştur
    const postsWithId = posts.map(post => ({
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