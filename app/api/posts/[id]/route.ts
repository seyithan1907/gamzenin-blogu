import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Tekil blog yazısını getir
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('blog');
    const post = await db.collection('posts').findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 });
    }

    // Görüntülenme sayısını artır
    await db.collection('posts').updateOne(
      { _id: new ObjectId(params.id) },
      { $inc: { views: 1 } }
    );

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Yazı yüklenirken hata oluştu' }, { status: 500 });
  }
}

// Blog yazısını güncelle
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('blog');
    const updates = await request.json();

    await db.collection('posts').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Yazı güncellenirken hata oluştu' }, { status: 500 });
  }
}

// Blog yazısını sil
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('blog');
    
    await db.collection('posts').deleteOne({ _id: new ObjectId(params.id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Yazı silinirken hata oluştu' }, { status: 500 });
  }
} 