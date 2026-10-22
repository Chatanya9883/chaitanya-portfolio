/**
 * Robust Client-Side Permanent Storage using browser IndexedDB.
 * Unlike localStorage (limited to ~5MB), IndexedDB provides hundreds of megabytes
 * of persistent storage for high-resolution images, artworks, and portfolio state.
 */

const DB_NAME = 'ChaitanyaPortfolioPermanentDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_persistent_store';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB database'));
    };
  });
}

/**
 * Save data to permanent IndexedDB storage
 */
export async function saveToIndexedDB<T = any>(key: string, value: T): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('IndexedDB write error for key:', key, request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB:', err);
  }
}

/**
 * Load data from permanent IndexedDB storage
 */
export async function loadFromIndexedDB<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve((request.result as T) ?? null);
      };

      request.onerror = () => {
        console.error('IndexedDB read error for key:', key, request.error);
        resolve(null);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (err) {
    console.warn('Could not load from IndexedDB:', err);
    return null;
  }
}

/**
 * Remove key from IndexedDB
 */
export async function removeFromIndexedDB(key: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      transaction.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('Could not remove from IndexedDB:', err);
  }
}
