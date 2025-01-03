import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!post) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Blog yazısı alınamadı' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    if (!post) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Blog yazısı güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Blog yazısı silindi' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Blog yazısı silinemedi' }, { status: 500 });
  }
} 