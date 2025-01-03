import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: Request) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      return NextResponse.json(
        { status: 'error', message: 'MongoDB bağlantı bilgileri eksik' },
        { status: 500 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("blog");
    
    // Test koleksiyonuna erişmeyi dene
    await db.command({ ping: 1 });
    
    await client.close();
    return NextResponse.json({ status: 'success', message: 'MongoDB bağlantısı başarılı!' });
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    return NextResponse.json(
      { status: 'error', message: 'MongoDB bağlantısı başarısız!' },
      { status: 500 }
    );
  }
} 