interface NCMContext {
  chapters: Map<string, string>;
  positions: Map<string, string>;
}

interface StoredContext {
  chapters: Record<string, string>;
  positions: Record<string, string>;
  version: string;
  lastUpdated: number;
}

const DB_NAME = 'NCMContextDB';
const DB_VERSION = 1;
const STORE_NAME = 'context';
const CONTEXT_VERSION = '1.0.0';

export function useNCMStorage() {
  let db: IDBDatabase | null = null;

  async function openDB(): Promise<IDBDatabase> {
    if (db) return db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async function saveContext(context: NCMContext): Promise<void> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const storedContext: StoredContext = {
        chapters: Object.fromEntries(context.chapters),
        positions: Object.fromEntries(context.positions),
        version: CONTEXT_VERSION,
        lastUpdated: Date.now(),
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put({ id: 'ncm-context', ...storedContext });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {}
  }

  async function loadContext(): Promise<NCMContext | null> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const storedContext = await new Promise<StoredContext | null>(
        (resolve, reject) => {
          const request = store.get('ncm-context');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }
      );

      if (!storedContext) return null;

      const isExpired =
        Date.now() - storedContext.lastUpdated > 7 * 24 * 60 * 60 * 1000;
      if (isExpired || storedContext.version !== CONTEXT_VERSION) {
        return null;
      }

      return {
        chapters: new Map(Object.entries(storedContext.chapters)),
        positions: new Map(Object.entries(storedContext.positions)),
      };
    } catch (error) {
      return null;
    }
  }

  async function clearStoredContext(): Promise<void> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete('ncm-context');
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {}
  }

  async function getStorageInfo(): Promise<{
    size: number;
    lastUpdated: number | null;
  }> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const storedContext = await new Promise<StoredContext | null>(
        (resolve, reject) => {
          const request = store.get('ncm-context');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }
      );

      if (!storedContext) {
        return { size: 0, lastUpdated: null };
      }

      const size = JSON.stringify(storedContext).length;
      return { size, lastUpdated: storedContext.lastUpdated };
    } catch (error) {
      return { size: 0, lastUpdated: null };
    }
  }

  return {
    saveContext,
    loadContext,
    clearStoredContext,
    getStorageInfo,
  };
}
