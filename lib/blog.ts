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

export async function getLikeStatus(postId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return !!data;
}

export async function toggleLike(postId: string, userId: string): Promise<void> {
  const isLiked = await getLikeStatus(postId, userId);

  if (isLiked) {
    // Beğeniyi kaldır
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Beğeni sayısını azalt
    await updateBlogPost(postId, {
      likes: (await getBlogPost(postId))?.likes! - 1
    });
  } else {
    // Beğeni ekle
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert([{ post_id: postId, user_id: userId }]);

    if (insertError) throw insertError;

    // Beğeni sayısını artır
    await updateBlogPost(postId, {
      likes: (await getBlogPost(postId))?.likes! + 1
    });
  }
} 