import { supabase } from './supabase';

export interface Comment {
  id: string;
  post_id: string;
  name: string;
  content: string;
  date: string;
}

// Bir blog yazısının yorumlarını getir
export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Yorumlar alınırken hata:', error);
    return [];
  }

  return data;
}

// Yeni yorum ekle
export async function addComment(comment: Omit<Comment, 'id' | 'date'>) {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) {
    console.error('Yorum eklenirken hata:', error);
    return null;
  }

  return data;
}

// Yorum sil (admin için)
export async function deleteComment(id: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Yorum silinirken hata:', error);
    return false;
  }

  return true;
} 