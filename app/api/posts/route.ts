import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Tüm blog yazılarını getir
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('blog');
    const posts = await db.collection('posts').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Yazılar yüklenirken hata oluştu' }, { status: 500 });
  }
}

// Yeni blog yazısı ekle
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('blog');
    const post = await request.json();
    
    const result = await db.collection('posts').insertOne({
      ...post,
      date: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: []
    });

    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Yazı eklenirken hata oluştu' }, { status: 500 });
  }
} 