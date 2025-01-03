import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  date: string;
  category?: {
    id: number;
    name: string;
  };
  image?: string | null;
  author?: string;
  views?: number;
  likes?: number;
  comments?: Array<{
    id: string;
    name: string;
    content: string;
    date: string;
  }>;
}

// Blog yazılarını getir
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Blog yazıları alınırken hata:', error);
    return [];
  }

  return data;
}

// Tekil blog yazısı getir
export async function getBlogPost(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Blog yazısı alınırken hata:', error);
    return null;
  }

  return data;
}

// Yeni blog yazısı ekle
export async function createBlogPost(post: Omit<BlogPost, 'id'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Blog yazısı eklenirken hata:', error);
    return null;
  }

  return data;
}

// Blog yazısını güncelle
export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Blog yazısı güncellenirken hata:', error);
    return null;
  }

  return data;
}

// Blog yazısını sil
export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Blog yazısı silinirken hata:', error);
    return false;
  }

  return true;
}

// Görüntülenme sayısını artır
export async function incrementViews(id: string) {
  const { data, error } = await supabase.rpc('increment_views', { post_id: id });

  if (error) {
    console.error('Görüntülenme sayısı artırılırken hata:', error);
    return false;
  }

  return true;
}

// Beğeni sayısını güncelle
export async function updateLikes(id: string, increment: boolean) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ 
      likes: increment ? supabase.raw('likes + 1') : supabase.raw('likes - 1') 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Beğeni sayısı güncellenirken hata:', error);
    return null;
  }

  return data;
} 