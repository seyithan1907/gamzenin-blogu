import { supabase } from './supabase';

interface Category {
  id: number;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  date: string;
  image: string | null;
  author: string | null;
  views?: number;
  likes?: number;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return posts || [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return post;
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function incrementViews(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_views', { post_id: id });
  if (error) throw error;
} 