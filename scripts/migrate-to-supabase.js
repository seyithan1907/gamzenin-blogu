const { createClient } = require('@supabase/supabase-js');

// Supabase istemcisini oluştur
const supabase = createClient(
  'https://ijmpyqvqrjakqhpnghpj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqbXB5cXZxcmpha3FocG5naHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzM3NDAsImV4cCI6MjA1MTUwOTc0MH0.SBnQPVK7AG1LGFoDfaHwwlc5Z5jaotqnk_RJZgNlocY'
);

async function migrateBlogPosts() {
  // localStorage'dan blog yazılarını al
  const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');

  console.log(`${posts.length} blog yazısı bulundu.`);

  // Her yazı için
  for (const post of posts) {
    try {
      // Yazıyı Supabase'e ekle
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: post.title,
          content: post.content,
          summary: post.summary,
          date: post.date,
          category: post.category,
          image: post.image,
          author: post.author,
          views: post.views || 0,
          likes: post.likes || 0
        }])
        .select()
        .single();

      if (error) {
        console.error(`Hata: ${post.title} yazısı eklenirken hata oluştu:`, error);
        continue;
      }

      console.log(`Başarılı: ${post.title} yazısı eklendi.`);

      // Eğer yorumlar varsa, onları da ekle
      if (post.comments && post.comments.length > 0) {
        for (const comment of post.comments) {
          const { error: commentError } = await supabase
            .from('comments')
            .insert([{
              post_id: data.id,
              name: comment.name,
              content: comment.content,
              date: comment.date
            }]);

          if (commentError) {
            console.error(`Hata: ${post.title} yazısının yorumu eklenirken hata oluştu:`, commentError);
          }
        }
        console.log(`Başarılı: ${post.title} yazısının ${post.comments.length} yorumu eklendi.`);
      }
    } catch (error) {
      console.error(`Hata: ${post.title} yazısı işlenirken hata oluştu:`, error);
    }
  }

  console.log('Migrasyon tamamlandı!');
}

// Scripti çalıştır
migrateBlogPosts().catch(console.error); 