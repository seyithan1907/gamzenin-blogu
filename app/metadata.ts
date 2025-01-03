import { Metadata } from 'next';

// Ana sayfa metadata
export const homeMetadata: Metadata = {
  title: 'Gamzenin Bloğu | Beslenme ve Sağlıklı Yaşam',
  description: 'Sağlıklı beslenme, diyet, fitness ve yaşam tarzı hakkında güncel bilgiler ve öneriler.',
  openGraph: {
    title: 'Gamzenin Bloğu | Beslenme ve Sağlıklı Yaşam',
    description: 'Sağlıklı beslenme, diyet, fitness ve yaşam tarzı hakkında güncel bilgiler ve öneriler.',
    url: 'https://gamzenin-blogu.vercel.app',
    siteName: 'Gamzenin Bloğu',
    images: [
      {
        url: 'https://gamzenin-blogu.vercel.app/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gamzenin Bloğu | Beslenme ve Sağlıklı Yaşam',
    description: 'Sağlıklı beslenme, diyet, fitness ve yaşam tarzı hakkında güncel bilgiler ve öneriler.',
    images: ['https://gamzenin-blogu.vercel.app/logo.png'],
  },
};

// Blog yazısı düzenleme sayfası metadata
export const editPostMetadata: Metadata = {
  title: 'Blog Yazısını Düzenle | Gamzenin Bloğu',
  description: 'Blog yazısını düzenleyin.',
  robots: {
    index: false,
    follow: false,
  },
};

// Blog yazısı oluşturma sayfası metadata
export const createPostMetadata: Metadata = {
  title: 'Blog Yazısı Oluştur | Gamzenin Bloğu',
  description: 'Yeni bir blog yazısı oluşturun.',
  robots: {
    index: false,
    follow: false,
  },
}; 