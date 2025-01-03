"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AuthForm from "./components/AuthForm";
import Image from "next/image";
import PopularPosts from "./components/PopularPosts";
import { getBlogPosts, type BlogPost } from "@/lib/blog";

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

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // HTML entities'leri decode etmek için yardımcı fonksiyon
  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  // İçeriği temizleyen yardımcı fonksiyon
  const cleanContent = (content: string) => {
    return decodeHTMLEntities(
      content
        .replace(/!\[.*?\]\(.*?\)/g, '') // Markdown resim linklerini kaldır
        .replace(/<img[^>]*>/g, '') // HTML resim taglerini kaldır
        .replace(/https?:\/\/\S+\.(jpg|jpeg|png|gif|webp)/gi, '') // Resim URL'lerini kaldır
        .replace(/&nbsp;/g, ' ') // HTML boşlukları düzelt
        .replace(/<\/?p>/g, ' ') // Paragraf etiketlerini boşlukla değiştir
        .replace(/\s+/g, ' ') // Birden fazla boşluğu tek boşluğa indir
        .trim() // Baştaki ve sondaki boşlukları temizle
    );
  };

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem("user");
    const isAdminUser = ADMIN_USERS.some(admin => admin.username === user);
    setIsAdmin(isAdminUser);

    // Blog yazılarını yükle
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filtrelenmiş yazıları hesapla
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = selectedCategory ? post.category?.id === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Ana İçerik - Sol Taraf */}
        <div className="lg:col-span-3 space-y-8">
          {/* Blog Başlığı */}
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 p-12 rounded-lg shadow-2xl 
            transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            {/* Animasyonlu arka plan efekti */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/40" />
            
            {/* Logo ve Başlık Container */}
            <div className="relative flex items-center space-x-6 mb-6">
              {/* Logo */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 
                flex items-center justify-center shadow-xl ring-4 ring-white/10 animate-pulse">
                <span className="text-3xl font-bold text-white">G</span>
              </div>
              
              {/* Başlık ve Alt Başlık */}
              <div>
                <h1 className="text-6xl font-bold text-transparent bg-clip-text 
                  bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                  animate-gradient-x mb-3">
                  Gamzenin Bloğu
                </h1>
                <p className="text-gray-300 text-xl font-light tracking-wide">
                  Beslenme ve diyetetik adına her şey
                </p>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="flex space-x-8 text-gray-300/80 relative mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>{posts.length} Yazı</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{CATEGORIES.length} Kategori</span>
              </div>
            </div>
          </div>
            
          {/* Arama ve Filtreleme */}
          <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arama */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                  Yazılarda Ara
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Aranacak kelimeyi yazın..."
                  className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white 
                    placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300"
                />
              </div>

              {/* Kategori Filtresi */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors">
                  Kategori Seç
                </label>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
            <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-800 text-center">
              {posts.length === 0 ? (
                <>
                  <p className="text-gray-300 text-xl mb-6">Henüz blog yazısı bulunmuyor.</p>
                  {isAdmin && (
                    <Link
                      href="/blog/yeni"
                      className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg
                        hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300
                        font-medium shadow-lg hover:shadow-blue-500/25"
                    >
                      İlk Yazıyı Ekle
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-gray-300 text-xl">
                  Arama kriterlerinize uygun yazı bulunamadı.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-800
                    hover:bg-gray-800/90 transition-all duration-300 transform hover:scale-[1.01]"
                >
                  {post.image && (
                    <div className="relative w-full h-72 mb-6 rounded-lg overflow-hidden group">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <Link href={`/blog/${post.id}`}>
                    <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r 
                      from-white to-gray-300 hover:from-blue-400 hover:to-purple-400 transition-all duration-300">
                      {post.title}
                    </h2>
                  </Link>
                  {post.category && (
                    <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                      text-sm px-4 py-1.5 rounded-full mb-4 font-medium shadow-lg">
                      {post.category.name}
                    </span>
                  )}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {post.summary || (post.content.length > 200
                      ? cleanContent(post.content).substring(0, 200) + "..."
                      : cleanContent(post.content)
                    )}
                  </p>
                  <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-4">
                    <div className="text-gray-400">
                      {post.author && <span className="text-blue-400">{post.author} | </span>}
                      <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-blue-400 hover:text-blue-300 flex items-center group"
                      >
                        Devamını Oku 
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Yeni Yazı Ekle Butonu */}
          {isAdmin && posts.length > 0 && (
            <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-800 text-center">
              <Link
                href="/blog/yeni"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 
                  rounded-lg hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 
                  transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25"
              >
                Yeni Yazı Ekle
              </Link>
            </div>
          )}
        </div>

        {/* Sağ Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-8 max-h-screen overflow-y-auto scrollbar-hide">
            <AuthForm />
            <PopularPosts />
          </div>
        </div>
      </div>
    </div>
  );
}
