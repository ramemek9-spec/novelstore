import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { UserProfile, Novel, Chapter, Anime, Episode, Product, Banner, Order, VipPurchase, Comment, SiteSettings } from '../types';
import { defaultNovels, defaultChapters, defaultAnimes, defaultEpisodes, defaultProducts, defaultBanners, defaultSettings } from '../data/initialData';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || undefined);

// User Profile Helpers
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export async function createUserProfileDoc(uid: string, email: string, displayName: string, role: 'admin' | 'user' = 'user'): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    role,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'users', uid), profile, { merge: true });
  } catch (err) {
    console.warn('Could not save profile doc in Firestore:', err);
  }

  return profile;
}

// 1-Click Database Seeding
export async function seedDefaultDataToFirestore(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Seed Settings
    await setDoc(doc(db, 'settings', 'general'), defaultSettings, { merge: true });

    // 2. Seed Banners
    for (const b of defaultBanners) {
      await setDoc(doc(db, 'banners', b.id), b, { merge: true });
    }

    // 3. Seed Novels & Chapters
    for (const n of defaultNovels) {
      await setDoc(doc(db, 'novels', n.id), n, { merge: true });
    }
    for (const c of defaultChapters) {
      await setDoc(doc(db, 'chapters', c.id), c, { merge: true });
    }

    // 4. Seed Anime & Episodes
    for (const a of defaultAnimes) {
      await setDoc(doc(db, 'animes', a.id), a, { merge: true });
    }
    for (const ep of defaultEpisodes) {
      await setDoc(doc(db, 'episodes', ep.id), ep, { merge: true });
    }

    // 5. Seed Products
    for (const p of defaultProducts) {
      await setDoc(doc(db, 'products', p.id), p, { merge: true });
    }

    return { success: true, message: 'Data awal berhasil di-seed ke Firebase Firestore!' };
  } catch (err: any) {
    console.error('Seeding error:', err);
    return { success: false, message: err?.message || 'Gagal melakukan seed data.' };
  }
}

// Dynamic Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
  } catch (e) {
    console.warn('Fallback to local default settings:', e);
  }
  return defaultSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
    return true;
  } catch (e) {
    console.error('Failed to update settings:', e);
    return false;
  }
}
