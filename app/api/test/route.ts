import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
    
    // Test koleksiyonuna erişmeyi dene
    await db.command({ ping: 1 });
    
    return NextResponse.json({ status: 'success', message: 'MongoDB bağlantısı başarılı!' });
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    return NextResponse.json(
      { status: 'error', message: 'MongoDB bağlantısı başarısız!' },
      { status: 500 }
    );
  }
} 