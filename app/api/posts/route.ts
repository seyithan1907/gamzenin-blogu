import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// GET - Tüm yazıları getir
export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI mevcut mu:', !!MONGODB_URI);

    if (!MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB bağlantı bilgileri eksik' },
        { status: 500 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("blog");
    
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    await client.close();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Yazılar yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Yazılar yüklenemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}

// POST - Yeni yazı ekle
export async function POST(request: Request) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI mevcut mu:', !!MONGODB_URI);

    if (!MONGODB_URI) {
      console.error('MongoDB URI bulunamadı');
      return NextResponse.json(
        { error: 'MongoDB bağlantı bilgileri eksik' },
        { status: 500 }
      );
    }

    const data = await request.json();
    console.log('Gelen veri:', { 
      title: data.title ? 'var' : 'yok',
      content: data.content ? 'var' : 'yok',
      category: data.category ? 'var' : 'yok'
    });
    
    // Gerekli alanları kontrol et
    if (!data.title || !data.content) {
      console.error('Eksik veri:', { title: !!data.title, content: !!data.content });
      return NextResponse.json(
        { error: 'Başlık ve içerik alanları zorunludur' },
        { status: 400 }
      );
    }

    console.log('MongoDB bağlantısı kuruluyor...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('MongoDB bağlantısı kuruldu');

    const db = client.db("blog");
    
    const post = {
      ...data,
      date: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: []
    };
    
    console.log('Yazı kaydediliyor...');
    const result = await db.collection("posts").insertOne(post);
    console.log('Yazı kaydedildi, ID:', result.insertedId);

    const insertedPost = await db.collection("posts").findOne({ _id: result.insertedId });
    
    await client.close();
    console.log('MongoDB bağlantısı kapatıldı');

    if (!insertedPost) {
      console.error('Yazı eklenemedi: insertedPost null');
      return NextResponse.json(
        { error: 'Yazı eklenemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json(insertedPost);
  } catch (error) {
    console.error('Yazı eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Yazı eklenemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
} 