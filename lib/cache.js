import React from "react";

const isBrowser = typeof window !== "undefined";
const EMPTY_DEPENDENCIES = Object.freeze([]);



class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      value,
      expiresAt,
    });

    return value;
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  size() {
    this.cleanup();
    return this.cache.size;
  }
}

export const memCache = new MemoryCache();

export const browserCache = {
  set(key, value, ttl = 5 * 60 * 1000) {
    if (!isBrowser) {
      return value;
    }

    try {
      const item = {
        value,
        expiresAt: Date.now() + ttl,
      };

      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn("browserCache set failed:", error);
    }

    return value;
  },

  get(key) {
    if (!isBrowser) {
      return null;
    }

    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        return null;
      }

      const item = JSON.parse(raw);

      if (!item || typeof item !== "object") {
        localStorage.removeItem(key);
        return null;
      }

      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn("browserCache get failed:", error);
      return null;
    }
  },

  has(key) {
    return this.get(key) !== null;
  },

  delete(key) {
    if (!isBrowser) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("browserCache delete failed:", error);
      return false;
    }
  },

  clear() {
    if (!isBrowser) {
      return;
    }

    try {
      localStorage.clear();
    } catch (error) {
      console.warn("browserCache clear failed:", error);
    }
  },
};

export const sessionCache = {
  set(key, value, ttl = 30 * 60 * 1000) {
    if (!isBrowser) {
      return value;
    }

    try {
      const item = {
        value,
        expiresAt: Date.now() + ttl,
      };

      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn("sessionCache set failed:", error);
    }

    return value;
  },

  get(key) {
    if (!isBrowser) {
      return null;
    }

    try {
      const raw = sessionStorage.getItem(key);

      if (!raw) {
        return null;
      }

      const item = JSON.parse(raw);

      if (!item || typeof item !== "object") {
        sessionStorage.removeItem(key);
        return null;
      }

      if (Date.now() > item.expiresAt) {
        sessionStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn("sessionCache get failed:", error);
      return null;
    }
  },

  has(key) {
    return this.get(key) !== null;
  },

  delete(key) {
    if (!isBrowser) {
      return false;
    }

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("sessionCache delete failed:", error);
      return false;
    }
  },

  clear() {
    if (!isBrowser) {
      return;
    }

    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn("sessionCache clear failed:", error);
    }
  },
};

export const redisCache = {
  async set(key, value, ttl = 5 * 60) {
    return { key, value, ttl };
  },

  async get() {
    return null;
  },

  async has() {
    return false;
  },

  async delete() {
    return true;
  },

  async clear() {
    return true;
  },
};

export const cache = {
  getServer() {
    return memCache;
  },

  getClient(useSession = false) {
    return useSession ? sessionCache : browserCache;
  },

  getUniversal(useSession = false) {
    if (isBrowser) {
      return this.getClient(useSession);
    }

    return this.getServer();
  },

  set(key, value, ttl, options = {}) {
    const { useSession = false } = options;
    return this.getUniversal(useSession).set(key, value, ttl);
  },

  get(key, options = {}) {
    const { useSession = false } = options;
    return this.getUniversal(useSession).get(key);
  },

  has(key, options = {}) {
    const { useSession = false } = options;
    return this.getUniversal(useSession).has(key);
  },

  delete(key, options = {}) {
    const { useSession = false } = options;
    return this.getUniversal(useSession).delete(key);
  },

  clear(options = {}) {
    const { useSession = false } = options;
    return this.getUniversal(useSession).clear();
  },
};

export const CACHE_KEYS = {
  PORTFOLIO: "portfolio",
  PORTFOLIO_FEATURED: "portfolio:featured",
  BLOG_POSTS: "blog:posts",
  BLOG_POST: (slug) => `blog:post:${slug}`,
  CONTACT_INFO: "contact:info",
  FAQS: "faqs",
  SETTINGS: "settings",
  USER_PROFILE: (id) => `user:${id}`,
  USER_LIST: "users:list",
  MESSAGES: "messages:list",
  MESSAGE: (id) => `message:${id}`,
  STATS: "stats",
  ANALYTICS: "analytics",
};

export async function withCache(key, fetcher, options = {}) {
  const {
    ttl = 5 * 60 * 1000,
    useSession = false,
    forceRefresh = false,
  } = options;

  const cacheInstance = cache.getUniversal(useSession);

  if (!forceRefresh) {
    const cachedValue = cacheInstance.get(key);

    if (cachedValue !== null && cachedValue !== undefined) {
      return cachedValue;
    }
  }

  const result = await fetcher();
  cacheInstance.set(key, result, ttl);

  return result;
}

export function useCache(key, fetcher, options = {}) {
  const {
    ttl = 5 * 60 * 1000,
    useSession = false,
    enabled = true,
    dependencies = EMPTY_DEPENDENCIES,
    initialData = null,
  } = options;

  const [data, setData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(
    enabled && initialData === null
  );
  const [error, setError] = React.useState(null);

  const stableDependencies = Array.isArray(dependencies)
    ? dependencies
    : EMPTY_DEPENDENCIES;

  React.useEffect(() => {
    if (!enabled || !key || typeof fetcher !== 'function') {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cacheInstance = cache.getUniversal(useSession);
        const cachedData = cacheInstance.get(key);

        if (cachedData !== null && cachedData !== undefined) {
          if (!cancelled) {
            setData(cachedData);
            setLoading(false);
          }

          return;
        }

        const result = await fetcher();

        if (cancelled) {
          return;
        }

        cacheInstance.set(key, result, ttl);
        setData(result);
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [key, ttl, useSession, enabled, fetcher, stableDependencies]);

  const refetch = React.useCallback(
    async (overrideOptions = {}) => {
      if (!key || typeof fetcher !== 'function') {
        return null;
      }

      const {
        ttl: overrideTtl = ttl,
        useSession: overrideUseSession = useSession,
      } = overrideOptions;

      setLoading(true);
      setError(null);

      try {
        const cacheInstance = cache.getUniversal(overrideUseSession);
        const result = await fetcher();

        cacheInstance.set(key, result, overrideTtl);
        setData(result);

        return result;
      } catch (refetchError) {
        setError(refetchError);
        throw refetchError;
      } finally {
        setLoading(false);
      }
    },
    [key, fetcher, ttl, useSession]
  );

  const invalidate = React.useCallback(() => {
    if (!key) {
      return;
    }

    const cacheInstance = cache.getUniversal(useSession);
    cacheInstance.delete(key);
  }, [key, useSession]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
  };
}


export function cleanupCache() {
  memCache.cleanup();

  if (!isBrowser) {
    return;
  }

  const cleanupStorage = (storage) => {
    try {
      const keysToRemove = [];

      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);

        if (!key) {
          continue;
        }

        try {
          const raw = storage.getItem(key);

          if (!raw) {
            continue;
          }

          const item = JSON.parse(raw);

          if (
            item &&
            typeof item === "object" &&
            typeof item.expiresAt === "number" &&
            Date.now() > item.expiresAt
          ) {
            keysToRemove.push(key);
          }
        } catch {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        storage.removeItem(key);
      });
    } catch (error) {
      console.warn("cleanupStorage failed:", error);
    }
  };

  cleanupStorage(localStorage);
  cleanupStorage(sessionStorage);
}

if (isBrowser) {
  setInterval(cleanupCache, 10 * 60 * 1000);
}
