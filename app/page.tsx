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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Ana İçerik - Sol Taraf */}
      <div className="md:col-span-3">
        {/* Blog Başlığı */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gamzenin Bloğu</h1>
          <p className="text-gray-400">Beslenme ve diyetetik adına her şey</p>
        </div>

        {/* Blog Yazıları */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Henüz blog yazısı bulunmuyor.</p>
            {isAdmin && (
              <Link
                href="/blog/yeni"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                İlk Yazıyı Ekle
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
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
