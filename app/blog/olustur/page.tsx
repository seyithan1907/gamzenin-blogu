'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { Editor } from '@tinymce/tinymce-react';
import { createBlogPost } from '@/lib/blog';

const CATEGORIES = [
  { id: 1, name: 'Sağlıklı Tarifler' },
  { id: 2, name: 'Beslenme Bilimi' },
  { id: 3, name: 'Diyet Türleri' },
  { id: 4, name: 'Hastalık ve Beslenme' },
  { id: 5, name: 'Fitness ve Sporcu Beslenmesi' },
  { id: 6, name: 'Yeme Alışkanlıkları ve Psikoloji' },
  { id: 7, name: 'Beslenme ve Çocuklar' },
  { id: 8, name: 'Yaşam Tarzı ve Beslenme' },
  { id: 9, name: 'Güncel Diyet Trendleri' },
  { id: 10, name: 'Bitkisel Beslenme ve Veganlık' },
  { id: 11, name: 'Detoks ve Arınma' },
  { id: 12, name: 'Kilo Alma ve Verme Stratejileri' },
  { id: 13, name: 'Sağlık İpuçları ve Tüyolar' },
  { id: 14, name: 'Uzman Görüşleri ve Röportajlar' },
  { id: 15, name: 'Gıda Güvenliği ve Etiket Okuma' }
];

export default function CreateBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  useEffect(() => {
    // Kullanıcı adını localStorage'dan al
    const user = localStorage.getItem('user');
    if (user) {
      setAuthor(user);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Lütfen başlık ve içerik alanlarını doldurun');
      return;
    }

    try {
      let imageUrl = image;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Görsel yüklenirken bir hata oluştu');
        }

        const data = await response.json();
        imageUrl = data.url;
      }

      const post = await createBlogPost({
        title,
        content,
        summary,
        image: imageUrl,
        category,
        date: new Date().toISOString(),
        author
      });

      if (!post) {
        throw new Error('Blog yazısı oluşturulamadı');
      }

      router.push(`/blog/${post.id}`);
    } catch (err) {
      console.error('Error:', err);
      alert('Blog yazısı oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı Oluştur</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Kategori
            </label>
            <select
              value={category.id}
              onChange={(e) => setCategory(CATEGORIES.find(c => c.id === Number(e.target.value)) || CATEGORIES[0])}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Özet
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Kapak Görseli
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-full h-48">
                  <img
                    src={imagePreview}
                    alt="Kapak görseli önizleme"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-800 file:text-white
                  hover:file:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              İçerik
            </label>
            <Editor
              apiKey={process.env.TINYMCE_API_KEY}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                branding: false,
                promotion: false,
                language: 'tr',
                skin: 'oxide-dark',
                content_css: 'dark'
              }}
              value={content}
              onEditorChange={(content) => setContent(content)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded bg-gray-800 hover:bg-gray-700"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 