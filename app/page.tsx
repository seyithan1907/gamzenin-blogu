"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: any[];
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem("user");
    setIsAdmin(user === "seyithan1907");

    // Blog postlarını yükle
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setPosts(savedPosts);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    }
  };

  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gamzenin Blogu</h1>
          {isAdmin && (
            <Link
              href="/blog/yeni"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Yeni Yazı Ekle
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Henüz blog yazısı bulunmuyor.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <article 
                  key={post.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">
                    <Link
                      href={`/blog/${post.id}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                    </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    {new Date(post.date).toLocaleDateString("tr-TR")}
                  </p>
                  <div className="prose prose-invert max-w-none">
                    {post.content.length > 150
                      ? post.content.substring(0, 150) + "..."
                      : post.content}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
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
      </div>
    </main>
  );
}
