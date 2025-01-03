'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { Editor } from '@tinymce/tinymce-react';
import { getBlogPost, updateBlogPost, type BlogPost } from '@/lib/blog';

const ADMIN_USERS = [
  {
    username: "seyithan1907",
    password: "hsy190778"
  },
  {
    username: "gamzeaktas",
    password: "gamze6302"
  }
];

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState({ id: 1, name: 'Genel' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories] = useState([
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
  ]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);

    if (!isAdminUser) {
      router.push('/');
      return;
    }

    const loadPost = async () => {
      try {
        const postData = await getBlogPost(params.id);
        if (postData) {
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
          setSummary(postData.summary);
          if (postData.image) {
            setImagePreview(postData.image);
          }
          setCategory(postData.category);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.id, router]);

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

      await updateBlogPost(params.id, {
        title,
        content,
        summary,
        image: imageUrl,
        category,
        date: post?.date || new Date().toISOString(),
      });

      router.push(`/blog/${params.id}`);
    } catch (err) {
      console.error('Error:', err);
      setError('Blog yazısı güncellenirken bir hata oluştu');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p className="text-red-500">{error || 'Blog yazısı bulunamadı'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Blog Yazısını Düzenle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Kategori
            </label>
            <select
              value={category.id}
              onChange={(e) => setCategory(categories.find(c => c.id === Number(e.target.value)) || categories[0])}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              {categories.map((cat) => (
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
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 