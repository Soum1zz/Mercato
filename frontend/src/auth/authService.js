import { jwtDecode } from "jwt-decode";
import { getMe } from "../api/authApi";
import { getSellerDetails } from "../api/sellerApi";

const TOKEN_KEY = "token";

// In-memory cache for parsed JWT payload
let cachedToken = null;
let cachedDecodedUser = null;

// In-memory cache for full user profile (/auth/me)
let userProfileCache = null;
let userProfilePromise = null;

// In-memory cache for seller details (/seller/:id/details)
let sellerDetailsCache = null;
let sellerDetailsPromise = null;

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    // Invalidate cached user on new token
    cachedToken = null;
    cachedDecodedUser = null;
    userProfileCache = null;
    sellerDetailsCache = null;
}

export function getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || token === "null" || token === "undefined") return null;
    return token;
}

export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    cachedToken = null;
    cachedDecodedUser = null;
    userProfileCache = null;
    userProfilePromise = null;
    sellerDetailsCache = null;
    sellerDetailsPromise = null;
}

/**
 * Returns the decoded user from JWT, caching the parsed object in memory
 * so jwtDecode is not re-executed repeatedly on every render.
 */
export function getCurrentUser() {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        logout();
        return null;
    }

    if (cachedToken === token && cachedDecodedUser) {
        return cachedDecodedUser;
    }

    try {
        cachedDecodedUser = jwtDecode(token);
        cachedToken = token;
        return cachedDecodedUser;
    } catch {
        logout();
        return null;
    }
}

export function isAuthenticated() {
    return !!getToken() && !isTokenExpired(getToken());
}

export function hasRole(role) {
    const user = getCurrentUser();
    return user?.role === role;
}

/**
 * Fetches the user profile (/auth/me) with in-memory caching.
 * Prevents redundant network requests across pages/components.
 *
 * @param {boolean} forceRefresh - If true, bypasses cache.
 */
export async function fetchUserProfile(forceRefresh = false) {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        logout();
        return null;
    }

    if (userProfileCache && !forceRefresh) {
        return userProfileCache;
    }

    if (userProfilePromise && !forceRefresh) {
        return userProfilePromise;
    }

    userProfilePromise = getMe()
        .then((res) => {
            const data = res.data;
            userProfileCache = data;
            return data;
        })
        .catch((err) => {
            if (err.response?.status === 401) {
                logout();
                return null;
            }
            console.error("Failed to fetch user profile:", err);
            throw err;
        })
        .finally(() => {
            userProfilePromise = null;
        });

    return userProfilePromise;
}

export function invalidateUserProfileCache() {
    userProfileCache = null;
    userProfilePromise = null;
}

/**
 * Fetches seller details (/seller/:id/details) with in-memory caching.
 * Prevents redundant fetches across re-renders and route changes.
 */
export async function fetchSellerDetails(sellerId, forceRefresh = false) {
    if (!sellerId) return null;
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        logout();
        return null;
    }

    if (sellerDetailsCache && !forceRefresh) {
        return sellerDetailsCache;
    }

    if (sellerDetailsPromise && !forceRefresh) {
        return sellerDetailsPromise;
    }

    sellerDetailsPromise = getSellerDetails(sellerId)
        .then((res) => {
            const data = res.data;
            sellerDetailsCache = data;
            return data;
        })
        .catch((err) => {
            if (err.response?.status === 401) {
                logout();
                return null;
            }
            console.error("Failed to fetch seller details:", err);
            throw err;
        })
        .finally(() => {
            sellerDetailsPromise = null;
        });

    return sellerDetailsPromise;
}

export function invalidateSellerDetailsCache() {
    sellerDetailsCache = null;
    sellerDetailsPromise = null;
}