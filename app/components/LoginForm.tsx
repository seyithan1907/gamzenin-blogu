'use client';

import { useState, useEffect } from 'react';

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

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = ADMIN_USERS.find(
      user => user.username === username && user.password === password
    );

    if (user) {
      localStorage.setItem('user', user.username);
      setIsLoggedIn(true);
      setCurrentUser(user.username);
      setUsername('');
      setPassword('');
    } else {
      alert('Kullanıcı adı veya şifre hatalı');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (isLoggedIn) {
    return (
      <div className="space-y-4">
        <p className="text-gray-300">
          Hoş geldin, <span className="font-medium">{currentUser}</span>
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Çıkış Yap
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Kullanıcı Adı
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Şifre
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Giriş Yap
      </button>
    </form>
  );
} 