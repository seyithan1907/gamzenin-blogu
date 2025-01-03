import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Tüm blog yazılarını getir
export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Blog yazıları alınamadı' }, { status: 500 });
  }
}

// Yeni blog yazısı ekle
export async function POST(request: Request) {
  try {
    const post = await request.json();

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Blog yazısı eklenemedi' }, { status: 500 });
  }
} 