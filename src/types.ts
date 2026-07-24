export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'suspended';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  whatsapp?: string;
}

export interface Chapter {
  id: string;
  novelId: string;
  chapterNumber: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface Novel {
  id: string;
  title: string;
  coverUrl: string;
  author: string;
  rating: number;
  genres: string[];
  synopsis: string;
  isVip: boolean;
  price: number;
  status: 'published' | 'unpublished';
  createdAt: string;
  totalChapters?: number;
}

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  createdAt: string;
}

export interface Anime {
  id: string;
  title: string;
  thumbnailUrl: string;
  synopsis: string;
  genres: string[];
  status: 'ongoing' | 'completed';
  releaseSchedule: string;
  rating: number;
  trailerUrl?: string;
  isPublished: boolean;
  createdAt: string;
  totalEpisodes?: number;
}

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  category: string;
  stock: number;
  isDigital: boolean;
  description: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
}

export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface Order {
  id: string;
  code?: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productTitle: string;
  price: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  isDigital?: boolean;
}

export type VipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VipPurchase {
  id: string;
  code?: string;
  userId: string;
  userName: string;
  userEmail: string;
  novelId: string;
  novelTitle: string;
  price: number;
  paymentMethod: string;
  status: VipStatus;
  createdAt: string;
}

export interface Comment {
  id: string;
  targetId: string; // novel or anime or product id
  targetType: 'novel' | 'anime' | 'product';
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  rating?: number;
  createdAt: string;
  likes?: number;
  parentId?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  targetId: string;
  type: 'novel' | 'anime';
  title: string;
  coverUrl: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  targetId: string;
  type: 'novel' | 'anime';
  title: string;
  coverUrl: string;
  lastReadTitle?: string;
  lastReadId?: string;
  updatedAt: string;
}

export interface CustomCode {
  id: string;
  code: string;
  type: 'VIP_NOVEL' | 'STORE_ITEM' | 'COIN_DEPOSIT' | 'ALL_ACCESS';
  targetId?: string;
  targetTitle?: string;
  coinValue?: number;
  isUsed?: boolean;
  maxUses?: number;
  usedCount?: number;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  trackName: string;
  artistName: string;
  collectionName?: string;
  previewUrl: string;
  artworkUrl100: string;
  durationMs?: number;
  primaryGenreName?: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  adminWhatsapp: string;
  adminEmail: string;
  primaryColor: string;
  footerText: string;
}
