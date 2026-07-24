import { Novel, Chapter, Anime, Episode, Product, Banner, SiteSettings } from '../types';

export const defaultSettings: SiteSettings = {
  siteName: 'WZ PROJECT',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  adminWhatsapp: '6281234567890',
  adminEmail: 'admin@wzproject.com',
  primaryColor: 'gold',
  footerText: '© 2026 WZ PROJECT. All Rights Reserved. Premium Anime, VIP Novel & Digital Store.'
};

export const defaultBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'WZ PROJECT VIP Novel Pass',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    linkUrl: '#novel',
    order: 1,
    isActive: true
  },
  {
    id: 'banner-2',
    title: 'Solo Leveling Season 2 Streaming HD',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    linkUrl: '#anime',
    order: 2,
    isActive: true
  },
  {
    id: 'banner-3',
    title: 'Diskon 50% Diamond & Akses Premium Store',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    linkUrl: '#store',
    order: 3,
    isActive: true
  }
];

export const defaultNovels: Novel[] = [
  {
    id: 'novel-1',
    title: 'The Shadow Monarch Awakens',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    author: 'Jin-Woo Author',
    rating: 4.9,
    genres: ['Action', 'Fantasy', 'System', 'Adventure'],
    synopsis: 'Seorang hunter kelas E terlemah secara misterius mendapatkan akses ke System tak terbatas yang memungkinkannya naik level tanpa batas.',
    isVip: true,
    price: 25000,
    status: 'published',
    createdAt: new Date().toISOString(),
    totalChapters: 120
  },
  {
    id: 'novel-2',
    title: 'Supreme Alchemist in Modern Era',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    author: 'Xiao Yan',
    rating: 4.8,
    genres: ['Cultivation', 'Urban', 'Fantasy', 'Overpowered'],
    synopsis: 'Raja Ramuan Tak Tertandingi bertransmigrasi ke tubuh seorang pemuda biasa di kota modern dan mendominasi dunia medis serta beladiri.',
    isVip: false,
    price: 0,
    status: 'published',
    createdAt: new Date().toISOString(),
    totalChapters: 85
  },
  {
    id: 'novel-3',
    title: 'Immortal Sword Emperor',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    author: 'Ling Tian',
    rating: 4.7,
    genres: ['Cultivation', 'Action', 'Martial Arts'],
    synopsis: 'MenguasaiSembilan Kitab Pedang Suci, sang legenda bangkit kembali dari pengkhianatan sahabat terdekatnya.',
    isVip: true,
    price: 35000,
    status: 'published',
    createdAt: new Date().toISOString(),
    totalChapters: 210
  },
  {
    id: 'novel-4',
    title: 'Cyberpunk Necromancer 2099',
    coverUrl: 'https://images.unsplash.com/photo-1509021436468-8977c806e618?w=600&auto=format&fit=crop&q=80',
    author: 'Neo Matrix',
    rating: 4.6,
    genres: ['Sci-Fi', 'Cyberpunk', 'Magic', 'Revenge'],
    synopsis: 'Di dunia neo-metropolis bertabur lampu neon dan implan sibernetik, sihir kematian yang terlupakan dibangkitkan kembali oleh seorang hacker jenius.',
    isVip: false,
    price: 0,
    status: 'published',
    createdAt: new Date().toISOString(),
    totalChapters: 45
  }
];

export const defaultChapters: Chapter[] = [
  {
    id: 'chap-1-1',
    novelId: 'novel-1',
    chapterNumber: 1,
    title: 'Bab 1: Kuil Ganda Mencekam',
    content: `Udara di dalam ruang bawah tanah terasa sangat dingin dan menyesakkan. Jin-Woo memegang pisau belatinya dengan tangan bergetar.

"Apakah ini akhir dari segalanya?" bisiknya dalam hati. Di hadapannya, patung-patung batu raksasa berdiri dalam kegelapan dengan mata menyala merah keemasan.

Tiba-tiba, suara dentungan keras terdengar dari pintu raksasa yang tertutup rapat. Sebuah jendela sistem tembus pandang berwarna biru bercahaya muncul di depan pandangannya:

[Selamat! Anda telah menyelesaikan syarat rahasia "Keberanian Sang Lemah". Log in Sistem Kebangkitan dimulai...]

Cahaya emas membungkus tubuhnya, mengalirkan energi tak terbatas ke seluruh pembuluh darahnya.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'chap-1-2',
    novelId: 'novel-1',
    chapterNumber: 2,
    title: 'Bab 2: Kebangkitan Sang Raja',
    content: `Jin-Woo terbangun di atas tempat tidur rumah sakit. Rasa sakit akibat luka mematikan di Kuil Ganda telah lenyap tanpa bekas.

Di matanya, dunia kini tampak berbeda. Sebuah layar melayang hanya dapat dilihat olehnya:

[Status Player: Sung Jin-Woo]
- Level: 1
- Job: None
- HP: 100/100
- MP: 10/10

[Misi Harian: Kebugaran Sang Monarki]
- Push-up: 0/100
- Sit-up: 0/100
- Lari 10KM: 0/10

"Ini bukan mimpi..." gumam Jin-Woo dengan tatapan tajam yang baru pertama kali terpancar dari matanya.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'chap-2-1',
    novelId: 'novel-2',
    chapterNumber: 1,
    title: 'Bab 1: Kembali ke Dunia Fana',
    content: `Di dalam kamar apartemen sempit di kota Jiangzhou, Xiao Yan membuka matanya. Kenangan ribuan tahun kultivasi di Benua Ramuan Suci berbenturan dengan ingatan pemilik asli tubuh ini—seorang mahasiswa miskin yang dihina rekannya.

"Ramuan Pembersih Sumsum di dunia modern ini hanya membutuhkan tanaman obat biasa seperti Ginseng dan Teratai Biru," senyum Xiao Yan sinis.

Dia menyilangkan kakinya dan menghembuskan napas keruh. Energi Qi spiritual bumi yang tipis mulai mengalir ke dantiannya.`,
    createdAt: new Date().toISOString()
  }
];

export const defaultAnimes: Anime[] = [
  {
    id: 'anime-1',
    title: 'Demon Slayer: Hashira Training Arc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Tanjiro dan para pembasmi iblis menjalani pelatihan intensif di bawah bimbingan para Hashira untuk bersiap menghadapi pertempuran akhir melawan Muzan Kibutsuji.',
    genres: ['Action', 'Demons', 'Supernatural', 'Shounen'],
    status: 'ongoing',
    releaseSchedule: 'Setiap Minggu, 22:00 WIB',
    rating: 4.9,
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isPublished: true,
    createdAt: new Date().toISOString(),
    totalEpisodes: 8
  },
  {
    id: 'anime-2',
    title: 'Jujutsu Kaisen Season 2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Kisah masa muda Satoru Gojo dan Suguru Geto selama masa sekolah jujutsu mereka, serta peristiwa tragis Insiden Shibuya.',
    genres: ['Action', 'Fantasy', 'School', 'Shounen'],
    status: 'completed',
    releaseSchedule: 'Selesai Tayang',
    rating: 4.9,
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isPublished: true,
    createdAt: new Date().toISOString(),
    totalEpisodes: 23
  },
  {
    id: 'anime-3',
    title: 'Chainsaw Man',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Denji hidup dalam kemiskinan ekstrem sebelum membuat perjanjian dengan Iblis Gergaji Pochita dan berburu iblis untuk Keselamatan Publik.',
    genres: ['Action', 'Gore', 'Supernatural'],
    status: 'completed',
    releaseSchedule: 'Selesai Tayang',
    rating: 4.8,
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isPublished: true,
    createdAt: new Date().toISOString(),
    totalEpisodes: 12
  }
];

export const defaultEpisodes: Episode[] = [
  {
    id: 'ep-1-1',
    animeId: 'anime-1',
    episodeNumber: 1,
    title: 'Episode 1: Demi Mengalahkan Muzan Kibutsuji',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ep-1-2',
    animeId: 'anime-1',
    episodeNumber: 2,
    title: 'Episode 2: Rasa Sakit Hashira Air Giyu Tomioka',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ep-2-1',
    animeId: 'anime-2',
    episodeNumber: 1,
    title: 'Episode 1: Kaibutsu - Masa Muda yang Hilang',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: new Date().toISOString()
  }
];

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Akses VIP Lifetime Novel & Anime WZ PROJECT',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    price: 99000,
    category: 'VIP Access',
    stock: 999,
    isDigital: true,
    description: 'Bebas baca semua novel VIP dan tonton anime tanpa batas selamanya di seluruh perangkat!',
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'Voucher Google Play Rp 100.000',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    price: 105000,
    category: 'Voucher Game',
    stock: 50,
    isDigital: true,
    description: 'Kode voucher resmi Google Play Indonesia untuk pembelian game dan aplikasi.',
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'Kaos Exclusif WZ PROJECT Shadow Edition (Black)',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    price: 149000,
    category: 'Merchandise',
    stock: 25,
    isDigital: false,
    description: 'Bahan Cotton Combed 30s Premium dengan sablon DTF Gold Glossy eksklusif WZ PROJECT.',
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];
