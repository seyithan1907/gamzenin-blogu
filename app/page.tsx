"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AuthForm from "./components/AuthForm";
import Image from "next/image";

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

interface BlogPost {
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
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem("user");
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);

    // Blog postlarını yükle
    const savedPosts = JSON.parse(localStorage.getItem("blog_posts") || "[]");
    setPosts(savedPosts);
  }, []);

  const handleDelete = (id: string) => {
    if (!isAdmin) return;

    if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));
    }
  };

  // Filtrelenmiş yazıları hesapla
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = selectedCategory ? post.category?.id === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Ana İçerik - Sol Taraf */}
      <div className="md:col-span-3">
        {/* Blog Başlığı */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gamzenin Bloğu</h1>
          <p className="text-gray-400">Beslenme ve diyetetik adına her şey</p>
        </div>

        {/* Arama ve Filtreleme */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arama */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Yazılarda Ara
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Aranacak kelimeyi yazın..."
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>

            {/* Kategori Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Kategori Seç
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">Tüm Kategoriler</option>
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Yazıları */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            {posts.length === 0 ? (
              <>
                <p className="text-gray-400 text-lg mb-4">Henüz blog yazısı bulunmuyor.</p>
                {isAdmin && (
                  <Link
                    href="/blog/yeni"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    İlk Yazıyı Ekle
                  </Link>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-lg">
                Arama kriterlerinize uygun yazı bulunamadı.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {post.image && (
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <Link href={`/blog/${post.id}`}>
                  <h2 className="text-2xl font-bold mb-4 hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                {post.category && (
                  <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded mb-4">
                    {post.category.name}
                  </span>
                )}
                <p className="text-gray-400 mb-4">
                  {post.summary || (post.content.length > 200
                    ? post.content.substring(0, 200) + "..."
                    : post.content)}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    {post.author && <span>Yazar: {post.author} | </span>}
                    <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Devamını Oku →
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Yeni Yazı Ekle Butonu */}
        {isAdmin && posts.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/blog/yeni"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Yeni Yazı Ekle
            </Link>
          </div>
        )}
      </div>

      {/* Sağ Sidebar */}
      <div className="space-y-6">
        <AuthForm />
      </div>
    </div>
  );
}
