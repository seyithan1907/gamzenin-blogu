import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Tüm yazıları getir
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
    
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Yazılar yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Yazılar yüklenemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni yazı ekle
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
    
    const data = await request.json();
    const post = {
      ...data,
      date: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: []
    };
    
    const result = await db.collection("posts").insertOne(post);
    const insertedPost = await db.collection("posts").findOne({ _id: result.insertedId });
    
    return NextResponse.json(insertedPost);
  } catch (error) {
    console.error('Yazı eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Yazı eklenemedi' },
      { status: 500 }
    );
  }
} 