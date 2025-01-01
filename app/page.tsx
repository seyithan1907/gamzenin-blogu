'use client';

import Link from "next/link";
import { useEffect, useState, lazy, Suspense } from "react";
import Image from 'next/image';

// Lazy loading ile bileşenleri yükleme
const AuthForm = lazy(() => import("./components/AuthForm"));
const GoogleAds = lazy(() => import('./components/GoogleAds'));

// Loading bileşeni
const LoadingFallback = () => (
  <div className="animate-pulse bg-gray-800 rounded-lg p-6">
    <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
  </div>
);

interface Category {
  id: number;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  summary?: string;
  content: string;
  date?: string;
  category: Category;
  image?: string;
}

// Kategoriler
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

// HTML karakterlerini düzeltme fonksiyonu
function decodeHTMLEntities(text: string) {
  if (!text) return '';
  
  const entities: { [key: string]: string } = {
    '&uuml;': 'ü',
    '&Uuml;': 'Ü',
    '&ouml;': 'ö',
    '&Ouml;': 'Ö',
    '&ccedil;': 'ç',
    '&Ccedil;': 'Ç',
    '&yacute;': 'ý',
    '&Yacute;': 'Ý',
    '&eth;': 'ğ',
    '&ETH;': 'Ğ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&#304;': 'İ',
    '&#305;': 'ı',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&sbquo;': "‚",
    '&bdquo;': "„",
    '&hellip;': "...",
    '&trade;': "™",
    '&copy;': "©",
    '&reg;': "®",
    '&sect;': "§",
    '&deg;': "°"
  };

  // Önce özel Türkçe karakterleri değiştir
  Object.keys(entities).forEach(entity => {
    text = text.replace(new RegExp(entity, 'g'), entities[entity]);
  });

  // Sonra kalan HTML entityleri temizle
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// İçerikteki resim URL'lerini ve HTML etiketlerini temizleme fonksiyonu
function cleanContent(content: string) {
  if (!content) return '';

  // Önce HTML karakterlerini düzelt
  content = decodeHTMLEntities(content);
  
  // Resim etiketlerini [Görüntü] ile değiştir
  content = content.replace(/<img[^>]+>/g, '[Görüntü]');
  
  // Diğer HTML etiketlerini temizle
  content = content.replace(/<[^>]+>/g, '');
  
  // Fazla boşlukları temizle
  content = content.replace(/\s+/g, ' ').trim();
  
  return content;
}

// Örnek yazılar
const defaultPosts: BlogPost[] = [
  {
    id: "default_1",
    title: "Akdeniz Diyetinin Sağlığa Faydaları",
    summary: "Akdeniz diyetinin kalp sağlığı, kilo kontrolü ve genel sağlık üzerindeki olumlu etkileri hakkında detaylı bir inceleme.",
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
    summary: "Sporcular için optimal protein alımı, zamanlaması ve en iyi protein kaynakları hakkında kapsamlı rehber.",
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
    summary: "Çocuklarda doğru beslenme alışkanlıklarının geliştirilmesi ve sürdürülmesi için pratik öneriler.",
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
    summary: "Vegan beslenmeye geçiş yapanlar için temel bilgiler, besin kaynakları ve örnek menüler.",
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
    summary: "Metabolizma hızını artıran besinler ve bu besinlerin günlük beslenme rutinine nasıl dahil edileceği.",
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
    summary: "Market alışverişlerinde gıda etiketlerini doğru anlama ve sağlıklı seçimler yapma rehberi.",
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

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const postsPerPage = 5;

  useEffect(() => {
    // Admin kontrolü
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser === 'seyithan1907') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    // localStorage'dan blog yazılarını al
    const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    
    // Yeni yazıları örnek yazılarla birleştir
    const allPosts = [...defaultPosts, ...savedPosts].map(post => {
      const cleanedContent = cleanContent(post.content);
      
      // Eğer kategori yoksa varsayılan kategori ata
      if (!post.category) {
        post.category = { id: 13, name: "Sağlık İpuçları ve Tüyolar" };
      }
      
      return {
        ...post,
        title: decodeHTMLEntities(post.title),
        summary: post.summary ? decodeHTMLEntities(post.summary) : cleanedContent.slice(0, 150) + '...',
        category: post.category
      };
    });

    // Yazıları tarihe göre sırala (yeniden eskiye)
    allPosts.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setBlogPosts(allPosts);
  }, []);

  // Yazı silme fonksiyonu
  const handleDeletePost = (postId: string) => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      // localStorage'dan mevcut yazıları al
      const savedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      
      // Yazıyı sil
      const updatedPosts = savedPosts.filter((post: BlogPost) => post.id !== postId);
      
      // localStorage'u güncelle
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
      
      // State'i güncelle
      const newPosts = blogPosts.filter(post => post.id !== postId);
      setBlogPosts(newPosts);

      // Başarı mesajı göster
      alert('Yazı başarıyla silindi!');
    }
  };

  // Filtreleme fonksiyonu
  const getFilteredPosts = () => {
    return blogPosts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || post.category.id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredPosts = getFilteredPosts();
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Kategori veya arama değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Ana İçerik - Sol Taraf */}
          <div className="md:col-span-3">
            {/* Blog Başlığı */}
            <div className="bg-gray-900 p-6 rounded-lg mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Gamzenin Bloğu</h1>
              <p className="text-gray-400">Beslenme ve diyetetik adına her şey</p>
            </div>
            
            {/* Arama ve Filtreleme */}
            <div className="space-y-4 mb-8">
              {/* Arama Kutusu */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                />
              </div>

              {/* Kategori Seçimi */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                >
                  <option value="">Tüm Kategoriler</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
        </div>

            {/* Blog Yazıları */}
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors relative"
                >
                  {post.image && (
                    <div className="relative w-full h-64 mb-6">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover rounded"
                        priority
                      />
                    </div>
                  )}
                  <Link href={`/blog/${post.id}`}>
                    <h2 className="text-2xl font-semibold text-white mb-3 hover:text-blue-400">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-400 mb-8">{post.summary}</p>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Devamını Oku →
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex items-center text-red-500 hover:text-red-400 ml-4"
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
                    </div>
                    <div className="flex items-center space-x-4">
                      {post.date && (
                        <p className="text-gray-500 text-sm">
                          {new Date(post.date).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                      <span className="text-sm px-2 py-1 bg-gray-800 text-gray-400 rounded">
                        {post.category.name}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Sayfalama */}
            <div className="mt-8 flex justify-center space-x-4">
              {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Sağ Sidebar */}
          <div className="space-y-6">
            <Suspense fallback={<LoadingFallback />}>
              <AuthForm />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <GoogleAds />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
