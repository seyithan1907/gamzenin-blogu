'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Notifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Okunmamış mesajları kontrol et
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    const unreadMessages = messages.filter((m: any) => m.status === 'unread').length;
    setUnreadCount(unreadMessages);
  }, []);

  if (unreadCount === 0) return null;

  return (
    <Link href="/mesajlar">
      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
        {unreadCount}
      </span>
    </Link>
  );
} 