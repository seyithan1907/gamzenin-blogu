'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Comments from '@/app/components/Comments';
import LikeButton from '@/app/components/LikeButton';
import Image from 'next/image';

// Sosyal medya ikonları için
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date?: string;
  category?: Category;
  image?: string;
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogPost({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Paylaşım URL'lerini oluşturan fonksiyonlar
  const getShareUrls = (title: string) => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      instagram: `https://www.instagram.com/` // Instagram doğrudan paylaşım URL'i sağlamıyor
    };
  };

  useEffect(() => {
    // Admin kontrolü
    const user = localStorage.getItem('user');
    if (user === 'seyithan1907') {
      setIsAdmin(true);
    }

    const fetchPost = () => {
      // Örnek yazılar
      const defaultPosts = [
        {
          id: "default_1",
          title: "Akdeniz Diyetinin Sağlığa Faydaları",
          content: `Akdeniz diyeti, sadece bir beslenme şekli değil, aynı zamanda sağlıklı bir yaşam tarzıdır. Bu diyet, Akdeniz bölgesindeki insanların geleneksel beslenme alışkanlıklarından esinlenmiştir.

Temel Bileşenler:
1. Zeytinyağı: Sağlıklı yağ asitleri açısından zengindir
2. Sebzeler ve Meyveler: Bol miktarda tüketilir
3. Tam Tahıllar: Kompleks karbonhidrat kaynağıdır
4. Baklagiller: Protein ve lif açısından zengindir
5. Balık: Haftada en az 2-3 kez tüketilir
6. Kırmızı Et: Sınırlı miktarda tüketilir

Sağlık Faydaları:
- Kalp hastalıkları riskini azaltır
- Kolesterol seviyelerini dengeler
- Tip 2 diyabet riskini düşürür
- Kilo kontrolüne yardımcı olur
- Beyin sağlığını destekler
- Yaşlanma sürecini yavaşlatır

Günlük Beslenme Önerileri:
- Kahvaltıda: Zeytinyağlı sebzeler, tam tahıllı ekmek
- Öğle: Balık veya baklagil yemeği, salata
- Akşam: Sebze ağırlıklı yemekler, az miktarda et

Bu beslenme tarzını benimsemek için ani değişiklikler yerine, adım adım geçiş yapmak önerilir. Örneğin, önce zeytinyağı kullanımını artırabilir, sonra sebze tüketimini çoğaltabilirsiniz.`,
          date: "2024-01-10T10:00:00.000Z",
          category: { id: 3, name: "Diyet Türleri" }
        },
        {
          id: "default_2",
          title: "Sporcu Beslenmesinde Protein Dengesi",
          content: `Sporcu beslenmesinde protein dengesi, performans ve kas gelişimi için kritik öneme sahiptir. Doğru miktarda ve zamanda alınan protein, antrenman sonrası toparlanmayı hızlandırır ve kas gelişimini destekler.

Optimal Protein İhtiyacı:
- Dayanıklılık sporcuları: 1.2-1.4 g/kg/gün
- Güç sporcuları: 1.4-1.8 g/kg/gün
- Vücut geliştirme: 1.6-2.0 g/kg/gün

En İyi Protein Kaynakları:
1. Hayvansal Kaynaklar:
   - Yumurta (tam protein)
   - Tavuk göğsü
   - Yağsız kırmızı et
   - Balık türleri
   - Süt ürünleri

2. Bitkisel Kaynaklar:
   - Kinoa
   - Mercimek
   - Nohut
   - Soya ürünleri
   - Badem ve diğer kuruyemişler

Protein Alım Zamanlaması:
- Antrenman öncesi: 20-30g protein
- Antrenman sonrası: 20-40g protein
- Gün içinde: Her 3-4 saatte bir protein içeren öğün

Önemli Noktalar:
1. Protein çeşitliliği sağlanmalı
2. Sindirimi kolaylaştırmak için porsiyonlar bölünmeli
3. Yeterli sıvı tüketimi ile desteklenmeli
4. Karbonhidrat ve yağ dengesi gözetilmeli

Protein Takviyelerinin Rolü:
- Whey protein: Hızlı emilim
- Kazein: Yavaş salınım
- BCAA: Antrenman sırasında
- Bitkisel protein tozları: Vegan sporcular için`,
          date: "2024-01-09T15:30:00.000Z",
          category: { id: 5, name: "Fitness ve Sporcu Beslenmesi" }
        },
        {
          id: "default_3",
          title: "Çocuklarda Sağlıklı Beslenme Alışkanlıkları",
          content: `Çocukluk döneminde kazanılan beslenme alışkanlıkları, yaşam boyu sürecek sağlıklı bir yaşamın temelini oluşturur. Bu dönemde doğru beslenme alışkanlıklarının kazandırılması, çocuğun fiziksel ve zihinsel gelişimi için kritik öneme sahiptir.

Temel Beslenme İlkeleri:
1. Düzenli Öğün Saatleri
   - Kahvaltı asla atlanmamalı
   - 3 ana öğün, 2-3 ara öğün
   - Ailece yemek yeme alışkanlığı

2. Besin Çeşitliliği
   - Her öğünde farklı besin grupları
   - Renkli sebze ve meyveler
   - Tam tahıllı ürünler
   - Kaliteli protein kaynakları

Pratik Öneriler:
- Yemekleri eğlenceli hale getirin
- Çocuğu alışveriş ve yemek hazırlamaya dahil edin
- Sağlıklı atıştırmalıklar sunun
- Su içme alışkanlığı kazandırın

Kaçınılması Gerekenler:
1. Aşırı şekerli gıdalar
2. Fast food tüketimi
3. Gazlı içecekler
4. Paketli atıştırmalıklar

Okul Çağı Beslenme Önerileri:
- Besleyici okul öğünleri hazırlayın
- Sağlıklı atıştırmalıklar paketleyin
- Su matarası bulundurun
- Öğün atlamamayı öğretin

Aktivite ve Beslenme İlişkisi:
- Düzenli fiziksel aktivite teşvik edilmeli
- Ekran başında yemek yeme önlenmeli
- Açık havada aktiviteler planlanmalı

Özel Durumlar:
1. Besin alerjileri
2. Yeme seçiciliği
3. Büyüme dönemleri
4. Spor yapan çocuklar`,
          date: "2024-01-08T09:15:00.000Z",
          category: { id: 7, name: "Beslenme ve Çocuklar" }
        },
        {
          id: "default_4",
          title: "Vegan Beslenme Rehberi",
          content: `Vegan beslenme, tüm hayvansal ürünlerden uzak durarak sadece bitkisel kaynaklı besinlerle beslenme şeklidir. Doğru planlandığında sağlıklı ve sürdürülebilir bir yaşam tarzı sunabilir.

Temel Besin Ögeleri ve Kaynakları:

1. Protein Kaynakları:
   - Baklagiller (mercimek, nohut, fasulye)
   - Kinoa
   - Tofu ve tempeh
   - Yulaf
   - Chia tohumu

2. B12 Vitamini:
   - Zenginleştirilmiş besinler
   - Takviyeler
   - Besin mayası

3. Demir Kaynakları:
   - Koyu yeşil yapraklı sebzeler
   - Kuru meyveler
   - Tam tahıllar
   - Baklagiller

4. Kalsiyum Kaynakları:
   - Badem ve susam
   - Kalsiyumla zenginleştirilmiş bitki sütleri
   - Brokoli ve lahana
   - Tofu

Örnek Günlük Menü:

Kahvaltı:
- Yulaf ezmesi
- Meyve
- Badem sütü
- Chia tohumu

Öğle:
- Mercimek çorbası
- Tam tahıllı ekmek
- Avokado salatası

Akşam:
- Nohutlu sebze yemeği
- Kinoa pilavı
- Yeşil salata

Ara Öğünler:
- Kuruyemiş
- Taze meyve
- Humus ve sebze çubukları

Geçiş Önerileri:
1. Kademeli geçiş yapın
2. Yeni tarifler deneyin
3. Besin takviyeleri konusunda uzman desteği alın
4. Etiket okumayı öğrenin`,
          date: "2024-01-07T14:20:00.000Z",
          category: { id: 10, name: "Bitkisel Beslenme ve Veganlık" }
        },
        {
          id: "default_5",
          title: "Metabolizmayı Hızlandıran Besinler",
          content: `Metabolizma, vücudumuzun besinleri enerjiye dönüştürme sürecidir. Bazı besinler metabolizma hızını artırarak kalori yakımını destekler ve kilo kontrolüne yardımcı olur.

Metabolizmayı Hızlandıran Besinler:

1. Protein Kaynakları:
   - Yumurta
   - Yağsız et
   - Balık
   - Tavuk göğsü
   - Baklagiller

2. Termojenik Besinler:
   - Yeşil çay
   - Kahve
   - Zencefil
   - Tarçın
   - Acı biber

3. Lifli Besinler:
   - Yulaf
   - Kinoa
   - Tam tahıllar
   - Sebzeler
   - Meyveler

Metabolizmayı Destekleyen Alışkanlıklar:

1. Su Tüketimi:
   - Günde en az 2-2.5 litre
   - Öğün aralarında
   - Sabah uyanınca

2. Öğün Düzeni:
   - 3 ana öğün
   - 2-3 ara öğün
   - Düzenli kahvaltı

3. Egzersiz ve Beslenme:
   - Kahvaltıdan önce hafif egzersiz
   - Protein ağırlıklı beslenme
   - Egzersiz sonrası beslenme

Örnek Günlük Plan:

Sabah:
- 1 bardak ılık su + limon
- Yeşil çay
- Proteinli kahvaltı

Ara Öğün:
- Badem + tarçınlı yoğurt
- Zencefil çayı

Öğle:
- Izgara tavuk
- Sebze salatası
- Kinoa

Ara Öğün:
- Yeşil çay
- Meyve

Akşam:
- Balık
- Buharda sebze
- Mercimek çorbası`,
          date: "2024-01-06T11:45:00.000Z",
          category: { id: 12, name: "Kilo Alma ve Verme Stratejileri" }
        },
        {
          id: "default_6",
          title: "Gıda Etiketlerini Doğru Okuma Kılavuzu",
          content: `Gıda etiketlerini doğru okumak, sağlıklı beslenme alışkanlıkları edinmek için önemli bir adımdır. Bu rehber, market alışverişlerinizde daha bilinçli seçimler yapmanıza yardımcı olacaktır.

Etiket Okuma Adımları:

1. Porsiyon Bilgisi:
   - Porsiyon büyüklüğü
   - Paketteki porsiyon sayısı
   - Bir porsiyondaki kalori

2. Besin Değerleri:
   - Toplam yağ
   - Doymuş yağ
   - Trans yağ
   - Kolesterol
   - Sodyum
   - Karbonhidrat
   - Lif
   - Şeker
   - Protein
   - Vitaminler ve mineraller

3. İçindekiler Listesi:
   - En çok kullanılandan en aza doğru sıralama
   - E kodlu katkı maddeleri
   - Gizli şeker isimleri
   - Alerjen bilgisi

Dikkat Edilmesi Gerekenler:

1. Şeker İsimleri:
   - Fruktoz
   - Glukoz
   - Maltoz
   - Dekstroz
   - Mısır şurubu

2. Sağlıksız Yağlar:
   - Hidrojenize yağlar
   - Palm yağı
   - Trans yağlar

3. Katkı Maddeleri:
   - Yapay tatlandırıcılar
   - Koruyucular
   - Renklendiriciler

Sağlıklı Alışveriş İpuçları:

1. Liste ile Alışveriş:
   - Önceden plan yapın
   - İhtiyaç listesi oluşturun
   - Tok karnına alışverişe çıkın

2. Ürün Karşılaştırma:
   - Benzer ürünleri kıyaslayın
   - Fiyat/kalite dengesi
   - Besin değeri karşılaştırması

3. Mevsimsellik:
   - Taze ürünler tercih edin
   - Mevsim sebze ve meyveleri seçin
   - Yerel üreticileri destekleyin`,
          date: "2024-01-05T16:00:00.000Z",
          category: { id: 15, name: "Gıda Güvenliği ve Etiket Okuma" }
        }
      ];

      // localStorage'dan blog yazılarını al
      const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      
      // Tüm yazıları birleştir
      const allPosts = [...defaultPosts, ...savedPosts];
      
      // ID'ye göre yazıyı bul
      const foundPost = allPosts.find(p => p.id === id);
      
      setPost(foundPost || null);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  // Yazı silme fonksiyonu
  const handleDeletePost = () => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      // localStorage'dan mevcut yazıları al
      const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      
      // Yazıyı sil
      const updatedPosts = savedPosts.filter((p: BlogPost) => p.id !== id);
      
      // localStorage'u güncelle
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
      
      // Başarı mesajı göster
      alert('Yazı başarıyla silindi!');
      
      // Ana sayfaya yönlendir
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Header />
        <div className="max-w-4xl mx-auto mt-8">
          <p>Yazı bulunamadı.</p>
        </div>
      </div>
    );
  }

  const shareUrls = getShareUrls(post.title);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Header />
      <article className="max-w-4xl mx-auto mt-8">
        <div className="bg-gray-900 p-8 rounded-lg">
          {post.image && (
            <div className="relative w-full h-96 mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover rounded"
                priority
              />
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <button
                  onClick={handleDeletePost}
                  className="flex items-center text-red-500 hover:text-red-400"
                  title="Bu yazıyı sil"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Sil
                </button>
              )}
              {post.category && (
                <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-sm">
                  {post.category.name}
                </span>
              )}
            </div>
          </div>
          
          {post.date && (
            <p className="text-gray-500 text-sm mb-6">
              {new Date(post.date).toLocaleDateString('tr-TR')}
            </p>
          )}

          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Sosyal Medya Paylaşım Butonları */}
          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Bu Yazıyı Paylaş</h3>
            <div className="flex space-x-4">
              <a
                href={shareUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                title="Facebook'ta Paylaş"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href={shareUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-sky-500 rounded-full hover:bg-sky-600 transition-colors"
                title="Twitter'da Paylaş"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href={shareUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                title="WhatsApp'ta Paylaş"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href={shareUrls.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full hover:opacity-90 transition-opacity"
                title="Instagram'da Paylaş"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-800 pt-6">
            <LikeButton postId={post.id} />
          </div>

          <Comments postId={post.id} />
        </div>
      </article>
    </div>
  );
} 