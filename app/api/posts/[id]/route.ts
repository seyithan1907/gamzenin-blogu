import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Tekil yazıyı getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
    
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(params.id) });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    // Görüntülenme sayısını artır
    await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      { $inc: { views: 1 } }
    );
    
    return NextResponse.json({ ...post, views: post.views + 1 });
  } catch (error) {
    console.error('Yazı yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Yazı yüklenemedi' },
      { status: 500 }
    );
  }
}

// PUT - Yazıyı güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
    const data = await request.json();
    
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: data }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }
    
    const updatedPost = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(params.id) });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Yazı güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Yazı güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Yazıyı sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");
    
    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(params.id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Yazı silinirken hata:', error);
    return NextResponse.json(
      { error: 'Yazı silinemedi' },
      { status: 500 }
    );
  }
} 