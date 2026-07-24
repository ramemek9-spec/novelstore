import React, { createContext, useContext, useEffect, useState } from 'react';
import { Novel, Anime, Product, Banner, SiteSettings, Bookmark, HistoryItem, VipPurchase, Order, CustomCode } from '../types';
import { defaultNovels, defaultAnimes, defaultProducts, defaultBanners, defaultSettings, defaultChapters, defaultEpisodes } from '../data/initialData';
import { db, getSiteSettings, updateSiteSettings } from '../lib/firebase';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

export type ActiveTab = 'dashboard' | 'novel' | 'music' | 'store' | 'profile' | 'admin';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // User Coins Balance
  userCoins: number;
  topupCoinsManually: (amount: number, reason?: string) => void;
  buyItemWithCoins: (item: { id: string; title: string; price: number; type: 'novel' | 'product' }) => Promise<{ success: boolean; message: string }>;

  // Custom Redeem Codes
  customCodes: CustomCode[];
  createCustomCode: (codeData: Omit<CustomCode, 'id' | 'createdAt'>) => Promise<CustomCode>;
  deleteCustomCode: (id: string) => Promise<boolean>;
  redeemCustomCode: (codeString: string) => Promise<{ success: boolean; message: string; type?: string; value?: number; targetTitle?: string }>;

  // Catalogs & Management
  novels: Novel[];
  saveNovel: (novel: Novel) => Promise<boolean>;
  deleteNovel: (id: string) => Promise<boolean>;

  animes: Anime[];
  products: Product[];
  saveProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;

  banners: Banner[];
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  
  // Realtime Firestore Collections
  vipPurchases: VipPurchase[];
  orders: Order[];
  
  // Modals & Active Viewers
  selectedNovel: Novel | null;
  setSelectedNovel: (novel: Novel | null) => void;
  selectedAnime: Anime | null;
  setSelectedAnime: (anime: Anime | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // Reader & Player
  readingNovel: { novel: Novel; chapterId?: string } | null;
  setReadingNovel: (data: { novel: Novel; chapterId?: string } | null) => void;
  streamingAnime: { anime: Anime; episodeId?: string } | null;
  setStreamingAnime: (data: { anime: Anime; episodeId?: string } | null) => void;
  
  // VIP Purchase Modal
  purchasingVipNovel: Novel | null;
  setPurchasingVipNovel: (novel: Novel | null) => void;
  
  // User Bookmarks & History
  bookmarks: Bookmark[];
  toggleBookmark: (item: { targetId: string; type: 'novel' | 'anime'; title: string; coverUrl: string }) => void;
  isBookmarked: (targetId: string) => boolean;
  
  history: HistoryItem[];
  addHistory: (item: { targetId: string; type: 'novel' | 'anime'; title: string; coverUrl: string; lastReadTitle?: string; lastReadId?: string }) => void;

  // Search & Filter Trigger
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Notification Drawer
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  notifications: Array<{ id: string; title: string; message: string; date: string; type: 'system' | 'vip' | 'order' }>;
  
  // Quick Actions
  unlockedCodes: string[];
  saveUnlockedCode: (code: string) => void;
  isItemApproved: (itemId: string, userCodeOrName?: string) => { approved: boolean; status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'NOT_FOUND'; matchedRecord?: VipPurchase | Order };
  saveSettingsToFirebase: (newSettings: SiteSettings) => Promise<boolean>;
  submitVipPurchase: (data: { novel: Novel; name: string; paymentMethod: string }) => Promise<string>;
  submitStoreOrder: (data: { product: Product; name: string; paymentMethod: string }) => Promise<string>;
  updateVipStatus: (id: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
  updateOrderStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'COMPLETED') => Promise<void>;
  deleteVipPurchase: (id: string) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [novels, setNovels] = useState<Novel[]>(defaultNovels);
  const [animes, setAnimes] = useState<Anime[]>(defaultAnimes);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  
  const [vipPurchases, setVipPurchases] = useState<VipPurchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customCodes, setCustomCodes] = useState<CustomCode[]>([]);

  // User WZ Coins balance
  const [userCoins, setUserCoins] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('wz_user_coins');
      return stored ? parseInt(stored, 10) : 50000;
    } catch {
      return 50000;
    }
  });

  const saveCoins = (amount: number) => {
    setUserCoins(amount);
    try {
      localStorage.setItem('wz_user_coins', amount.toString());
      setDoc(doc(db, 'user_coins', 'default_user'), { amount, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {
      console.warn('Failed to persist coins locally', e);
    }
  };

  const topupCoinsManually = (amount: number, reason?: string) => {
    const newBal = userCoins + amount;
    saveCoins(newBal);
  };

  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [readingNovel, setReadingNovel] = useState<{ novel: Novel; chapterId?: string } | null>(null);
  const [streamingAnime, setStreamingAnime] = useState<{ anime: Anime; episodeId?: string } | null>(null);
  const [purchasingVipNovel, setPurchasingVipNovel] = useState<Novel | null>(null);
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; date: string; type: 'system' | 'vip' | 'order' }>>([
    {
      id: 'notif-1',
      title: 'Selamat Datang di WZ PROJECT!',
      message: 'Nikmati novel VIP, store produk digital, dan musik OST favorit kamu.',
      date: 'Baru saja',
      type: 'system'
    },
    {
      id: 'notif-2',
      title: 'Sistem Coin WZ Project',
      message: 'Kamu bisa beli novel VIP & produk store langsung menggunakan WZ Coins!',
      date: '1 jam lalu',
      type: 'vip'
    }
  ]);

  // Load Settings & Realtime Listeners
  useEffect(() => {
    getSiteSettings().then(s => setSettings(s));

    try {
      // Listen to Novels
      const unsubN = onSnapshot(query(collection(db, 'novels')), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Novel));
          setNovels(loaded);
        }
      }, () => {});

      // Listen to Products
      const unsubP = onSnapshot(query(collection(db, 'products')), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          setProducts(loaded);
        }
      }, () => {});

      // Listen to Banners
      const unsubB = onSnapshot(query(collection(db, 'banners')), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
          setBanners(loaded);
        }
      }, () => {});

      // Listen to VIP Purchases
      const unsubVip = onSnapshot(query(collection(db, 'vip_purchases')), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as VipPurchase));
          setVipPurchases(loaded);
        }
      }, () => {});

      // Listen to Orders
      const unsubOrd = onSnapshot(query(collection(db, 'orders')), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
          setOrders(loaded);
        }
      }, () => {});

      // Listen to Custom Codes
      const unsubCode = onSnapshot(query(collection(db, 'custom_codes')), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomCode));
          setCustomCodes(loaded);
        }
      }, () => {});

      return () => {
        unsubN(); unsubP(); unsubB(); unsubVip(); unsubOrd(); unsubCode();
      };
    } catch (e) {
      console.warn('Firestore real-time subscription warning:', e);
    }
  }, []);

  const saveSettingsToFirebase = async (newSettings: SiteSettings): Promise<boolean> => {
    setSettings(newSettings);
    return await updateSiteSettings(newSettings);
  };

  // Product CRUD
  const saveProduct = async (product: Product): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'products', product.id), product, { merge: true });
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === product.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = product;
          return copy;
        }
        return [product, ...prev];
      });
      return true;
    } catch (e) {
      console.error('Failed to save product:', e);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (e) {
      console.error('Failed to delete product:', e);
      return false;
    }
  };

  // Novel CRUD
  const saveNovel = async (novel: Novel): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'novels', novel.id), novel, { merge: true });
      setNovels(prev => {
        const idx = prev.findIndex(n => n.id === novel.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = novel;
          return copy;
        }
        return [novel, ...prev];
      });
      return true;
    } catch (e) {
      console.error('Failed to save novel:', e);
      return false;
    }
  };

  const deleteNovel = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'novels', id));
      setNovels(prev => prev.filter(n => n.id !== id));
      return true;
    } catch (e) {
      console.error('Failed to delete novel:', e);
      return false;
    }
  };

  // Custom Codes Admin Generator
  const createCustomCode = async (codeData: Omit<CustomCode, 'id' | 'createdAt'>): Promise<CustomCode> => {
    const id = 'code-' + Date.now();
    const newCode: CustomCode = {
      ...codeData,
      id,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'custom_codes', id), newCode);
    } catch (e) {
      console.warn('Saved custom code locally fallback:', e);
    }
    setCustomCodes(prev => [newCode, ...prev]);
    return newCode;
  };

  // Redeem Code System
  const redeemCustomCode = async (codeString: string): Promise<{ success: boolean; message: string; type?: string; value?: number; targetTitle?: string }> => {
    const cleanCode = codeString.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Harap masukkan kode promo / akses.' };
    }

    // Check custom codes collection first
    const matched = customCodes.find(c => c.code.toUpperCase() === cleanCode);
    if (matched) {
      if (matched.isUsed) {
        return { success: false, message: 'Kode ini sudah pernah digunakan!' };
      }

      // Process code type
      if (matched.type === 'COIN_DEPOSIT') {
        const val = matched.coinValue || 10000;
        saveCoins(userCoins + val);
        // Mark code used
        try {
          await setDoc(doc(db, 'custom_codes', matched.id), { isUsed: true }, { merge: true });
        } catch {}
        return {
          success: true,
          message: `Selamat! Berhasil klaim Deposit Coin sebesar ${val.toLocaleString('id-ID')} WZ Coins!`,
          type: 'COIN_DEPOSIT',
          value: val
        };
      }

      if (matched.type === 'VIP_NOVEL' && matched.targetId) {
        // Unlock novel by creating an APPROVED VIP purchase
        const recordId = 'vip-' + Date.now();
        const autoVip: VipPurchase = {
          id: recordId,
          code: cleanCode,
          userId: cleanCode,
          userName: 'Redeemed User',
          userEmail: 'user@wz.com',
          novelId: matched.targetId,
          novelTitle: matched.targetTitle || 'VIP Novel',
          price: 0,
          paymentMethod: 'REDEEM_CODE',
          status: 'APPROVED',
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, 'vip_purchases', recordId), autoVip);
          await setDoc(doc(db, 'custom_codes', matched.id), { isUsed: true }, { merge: true });
        } catch {}
        saveUnlockedCode(cleanCode);
        setVipPurchases(prev => [autoVip, ...prev]);
        return {
          success: true,
          message: `Sukses! Akses VIP Novel "${matched.targetTitle || 'Novel VIP'}" telah terbuka penuh!`,
          type: 'VIP_NOVEL',
          targetTitle: matched.targetTitle
        };
      }

      if (matched.type === 'STORE_ITEM' && matched.targetId) {
        const recordId = 'ord-' + Date.now();
        const autoOrd: Order = {
          id: recordId,
          code: cleanCode,
          userId: cleanCode,
          userName: 'Redeemed User',
          userEmail: 'user@wz.com',
          productId: matched.targetId,
          productTitle: matched.targetTitle || 'Store Item',
          price: 0,
          paymentMethod: 'REDEEM_CODE',
          status: 'APPROVED',
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, 'orders', recordId), autoOrd);
          await setDoc(doc(db, 'custom_codes', matched.id), { isUsed: true }, { merge: true });
        } catch {}
        saveUnlockedCode(cleanCode);
        setOrders(prev => [autoOrd, ...prev]);
        return {
          success: true,
          message: `Sukses! Produk "${matched.targetTitle || 'Store Item'}" telah di-ACC & terbuka!`,
          type: 'STORE_ITEM',
          targetTitle: matched.targetTitle
        };
      }
    }

    // Check if code matches an existing approved order or VIP purchase in Firestore
    const vipMatch = vipPurchases.find(v => v.code?.toUpperCase() === cleanCode || v.id.toUpperCase() === cleanCode);
    if (vipMatch) {
      saveUnlockedCode(cleanCode);
      return {
        success: true,
        message: `Kode ${cleanCode} ditemukan! Status: ${vipMatch.status}. ${vipMatch.status === 'APPROVED' ? 'Akses Terbuka!' : 'Menunggu ACC Admin.'}`,
        type: 'VIP_NOVEL',
        targetTitle: vipMatch.novelTitle
      };
    }

    const ordMatch = orders.find(o => o.code?.toUpperCase() === cleanCode || o.id.toUpperCase() === cleanCode);
    if (ordMatch) {
      saveUnlockedCode(cleanCode);
      return {
        success: true,
        message: `Kode ${cleanCode} ditemukan! Status: ${ordMatch.status}. ${ordMatch.status === 'APPROVED' ? 'Pesanan Terbuka!' : 'Menunggu ACC Admin.'}`,
        type: 'STORE_ITEM',
        targetTitle: ordMatch.productTitle
      };
    }

    // Otherwise unlock code directly
    saveUnlockedCode(cleanCode);
    return {
      success: true,
      message: `Kode "${cleanCode}" tersimpan di perangkat kamu! Akses item akan dibuka setelah Admin memberikan ACC.`,
      type: 'CUSTOM'
    };
  };

  // Buy item directly using WZ Coins
  const buyItemWithCoins = async (item: { id: string; title: string; price: number; type: 'novel' | 'product' }): Promise<{ success: boolean; message: string }> => {
    if (userCoins < item.price) {
      return {
        success: false,
        message: `Saldo WZ Coin kamu tidak cukup! Kamu butuh ${item.price.toLocaleString('id-ID')} WZ Coins. Saldo kamu: ${userCoins.toLocaleString('id-ID')} WZ Coins.`
      };
    }

    // Deduct coins
    const newBal = userCoins - item.price;
    saveCoins(newBal);

    const autoCode = 'WZ-COIN-' + Math.floor(10000 + Math.random() * 90000);

    if (item.type === 'novel') {
      const recordId = 'vip-' + Date.now();
      const autoVip: VipPurchase = {
        id: recordId,
        code: autoCode,
        userId: autoCode,
        userName: 'Pembeli WZ Coins',
        userEmail: 'coin_user@wz.com',
        novelId: item.id,
        novelTitle: item.title,
        price: item.price,
        paymentMethod: 'WZ COINS',
        status: 'APPROVED',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'vip_purchases', recordId), autoVip);
      } catch {}
      saveUnlockedCode(autoCode);
      setVipPurchases(prev => [autoVip, ...prev]);
      return {
        success: true,
        message: `Pembelian Berhasil! Saldo terpotong ${item.price.toLocaleString('id-ID')} WZ Coins. Akses novel "${item.title}" LANGSUNG TERBUKA (ACC OTO)!`
      };
    } else {
      const recordId = 'ord-' + Date.now();
      const autoOrd: Order = {
        id: recordId,
        code: autoCode,
        userId: autoCode,
        userName: 'Pembeli WZ Coins',
        userEmail: 'coin_user@wz.com',
        productId: item.id,
        productTitle: item.title,
        price: item.price,
        paymentMethod: 'WZ COINS',
        status: 'APPROVED',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'orders', recordId), autoOrd);
      } catch {}
      saveUnlockedCode(autoCode);
      setOrders(prev => [autoOrd, ...prev]);
      return {
        success: true,
        message: `Pembelian Berhasil! Saldo terpotong ${item.price.toLocaleString('id-ID')} WZ Coins. Produk "${item.title}" LANGSUNG DI-ACC!`
      };
    }
  };

  const toggleBookmark = (item: { targetId: string; type: 'novel' | 'anime'; title: string; coverUrl: string }) => {
    const existingIndex = bookmarks.findIndex(b => b.targetId === item.targetId);
    if (existingIndex >= 0) {
      setBookmarks(prev => prev.filter(b => b.targetId !== item.targetId));
    } else {
      const newBm: Bookmark = {
        id: 'bm-' + Date.now(),
        userId: 'current-user',
        targetId: item.targetId,
        type: item.type,
        title: item.title,
        coverUrl: item.coverUrl,
        createdAt: new Date().toISOString()
      };
      setBookmarks(prev => [newBm, ...prev]);
    }
  };

  const isBookmarked = (targetId: string) => {
    return bookmarks.some(b => b.targetId === targetId);
  };

  const addHistory = (item: { targetId: string; type: 'novel' | 'anime'; title: string; coverUrl: string; lastReadTitle?: string; lastReadId?: string }) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.targetId !== item.targetId);
      const newItem: HistoryItem = {
        id: 'hist-' + Date.now(),
        userId: 'current-user',
        targetId: item.targetId,
        type: item.type,
        title: item.title,
        coverUrl: item.coverUrl,
        lastReadTitle: item.lastReadTitle,
        lastReadId: item.lastReadId,
        updatedAt: new Date().toISOString()
      };
      return [newItem, ...filtered];
    });
  };

  // Saved Unlocked Codes in Local Storage
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('wz_unlocked_codes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveUnlockedCode = (code: string) => {
    if (!unlockedCodes.includes(code)) {
      const updated = [...unlockedCodes, code];
      setUnlockedCodes(updated);
      localStorage.setItem('wz_unlocked_codes', JSON.stringify(updated));
    }
  };

  const submitVipPurchase = async (data: { novel: Novel; name: string; paymentMethod: string }): Promise<string> => {
    const randomCode = 'WZ-VIP-' + Math.floor(10000 + Math.random() * 90000);
    const newPurchase: VipPurchase = {
      id: 'vip-' + Date.now(),
      code: randomCode,
      userId: randomCode,
      userName: data.name,
      userEmail: `${data.name.toLowerCase().replace(/\s+/g, '')}@wz.com`,
      novelId: data.novel.id,
      novelTitle: data.novel.title,
      price: data.novel.price,
      paymentMethod: data.paymentMethod,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'vip_purchases', newPurchase.id), newPurchase);
    } catch (e) {
      console.warn('Saved VIP purchase locally:', e);
    }

    setVipPurchases(prev => [newPurchase, ...prev]);
    saveUnlockedCode(randomCode);

    // Construct WhatsApp message
    const waNumber = settings.adminWhatsapp.replace(/[^0-9]/g, '') || '6281234567890';
    const message = `Halo Admin ${settings.siteName},

Saya ingin membeli Akses Novel VIP:

• Nama Pemesan: ${data.name}
• KODE AKSES / TRANSAKSI: ${randomCode}
• Judul Novel: ${data.novel.title}
• Total Harga: Rp ${data.novel.price.toLocaleString('id-ID')}
• Metode Pembayaran: ${data.paymentMethod}

Mohon dilakukan ACC/Konfirmasi agar akses novel saya segera terbuka. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
    return randomCode;
  };

  const submitStoreOrder = async (data: { product: Product; name: string; paymentMethod: string }): Promise<string> => {
    const randomCode = 'WZ-ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      code: randomCode,
      userId: randomCode,
      userName: data.name,
      userEmail: `${data.name.toLowerCase().replace(/\s+/g, '')}@wz.com`,
      productId: data.product.id,
      productTitle: data.product.title,
      price: data.product.price,
      paymentMethod: data.paymentMethod,
      status: 'PENDING',
      isDigital: data.product.isDigital,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.warn('Saved Order locally:', e);
    }

    setOrders(prev => [newOrder, ...prev]);
    saveUnlockedCode(randomCode);

    // Open WhatsApp
    const waNumber = settings.adminWhatsapp.replace(/[^0-9]/g, '') || '6281234567890';
    const message = `Halo Admin ${settings.siteName},

Saya memesan Produk Store:

• Nama Pemesan: ${data.name}
• KODE PESANAN: ${randomCode}
• Produk: ${data.product.title}
• Total Harga: Rp ${data.product.price.toLocaleString('id-ID')}
• Metode Pembayaran: ${data.paymentMethod}

Mohon dilakukan ACC/Proses pesanan saya. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
    return randomCode;
  };

  const isItemApproved = (itemId: string, userCodeOrName?: string) => {
    const queryTerm = (userCodeOrName || '').trim().toLowerCase();

    // Check VIP Purchases
    const vipMatch = vipPurchases.find(v => {
      const matchItem = v.novelId === itemId || v.id === itemId;
      if (!matchItem) return false;
      if (!queryTerm) {
        return (v.code && unlockedCodes.includes(v.code)) || unlockedCodes.includes(v.id);
      }
      return (
        (v.code && v.code.toLowerCase() === queryTerm) ||
        (v.userName && v.userName.toLowerCase() === queryTerm) ||
        (v.id && v.id.toLowerCase() === queryTerm)
      );
    });

    if (vipMatch) {
      return {
        approved: vipMatch.status === 'APPROVED',
        status: vipMatch.status,
        matchedRecord: vipMatch
      };
    }

    // Check Store Orders
    const ordMatch = orders.find(o => {
      const matchItem = o.productId === itemId || o.id === itemId;
      if (!matchItem) return false;
      if (!queryTerm) {
        return (o.code && unlockedCodes.includes(o.code)) || unlockedCodes.includes(o.id);
      }
      return (
        (o.code && o.code.toLowerCase() === queryTerm) ||
        (o.userName && o.userName.toLowerCase() === queryTerm) ||
        (o.id && o.id.toLowerCase() === queryTerm)
      );
    });

    if (ordMatch) {
      const isApproved = ordMatch.status === 'APPROVED' || ordMatch.status === 'COMPLETED';
      return {
        approved: isApproved,
        status: isApproved ? 'APPROVED' as const : ordMatch.status as 'APPROVED' | 'PENDING' | 'REJECTED',
        matchedRecord: ordMatch
      };
    }

    if (queryTerm) {
      const directVipByCode = vipPurchases.find(v => (v.code && v.code.toLowerCase() === queryTerm) || (v.userName && v.userName.toLowerCase() === queryTerm));
      if (directVipByCode && directVipByCode.novelId === itemId) {
        return {
          approved: directVipByCode.status === 'APPROVED',
          status: directVipByCode.status,
          matchedRecord: directVipByCode
        };
      }
      const directOrdByCode = orders.find(o => (o.code && o.code.toLowerCase() === queryTerm) || (o.userName && o.userName.toLowerCase() === queryTerm));
      if (directOrdByCode && directOrdByCode.productId === itemId) {
        const isApproved = directOrdByCode.status === 'APPROVED' || directOrdByCode.status === 'COMPLETED';
        return {
          approved: isApproved,
          status: isApproved ? 'APPROVED' as const : directOrdByCode.status as 'APPROVED' | 'PENDING' | 'REJECTED',
          matchedRecord: directOrdByCode
        };
      }
    }

    return { approved: false, status: 'NOT_FOUND' as const };
  };

  const updateVipStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setVipPurchases(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    try {
      await setDoc(doc(db, 'vip_purchases', id), { status }, { merge: true });
    } catch (e) {
      console.warn('Updated VIP status locally:', e);
    }
  };

  const deleteCustomCode = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'custom_codes', id));
      setCustomCodes(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (e) {
      console.error('Failed to delete custom code:', e);
      setCustomCodes(prev => prev.filter(c => c.id !== id));
      return true;
    }
  };

  const deleteVipPurchase = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'vip_purchases', id));
      setVipPurchases(prev => prev.filter(v => v.id !== id));
      return true;
    } catch (e) {
      console.error('Failed to delete vip purchase:', e);
      setVipPurchases(prev => prev.filter(v => v.id !== id));
      return true;
    }
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders(prev => prev.filter(o => o.id !== id));
      return true;
    } catch (e) {
      console.error('Failed to delete order:', e);
      setOrders(prev => prev.filter(o => o.id !== id));
      return true;
    }
  };

  const updateOrderStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'COMPLETED') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try {
      await setDoc(doc(db, 'orders', id), { status }, { merge: true });
    } catch (e) {
      console.warn('Updated Order status locally:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        userCoins,
        topupCoinsManually,
        buyItemWithCoins,
        customCodes,
        createCustomCode,
        redeemCustomCode,
        novels,
        saveNovel,
        deleteNovel,
        animes,
        products,
        saveProduct,
        deleteProduct,
        banners,
        settings,
        setSettings,
        vipPurchases,
        orders,
        selectedNovel,
        setSelectedNovel,
        selectedAnime,
        setSelectedAnime,
        selectedProduct,
        setSelectedProduct,
        readingNovel,
        setReadingNovel,
        streamingAnime,
        setStreamingAnime,
        purchasingVipNovel,
        setPurchasingVipNovel,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        history,
        addHistory,
        selectedCategory,
        setSelectedCategory,
        isNotificationOpen,
        setIsNotificationOpen,
        notifications,
        unlockedCodes,
        saveUnlockedCode,
        isItemApproved,
        saveSettingsToFirebase,
        submitVipPurchase,
        submitStoreOrder,
        updateVipStatus,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
