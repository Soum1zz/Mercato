import { getProducts } from "../api/productApi";

let productsCache = null;
let productsFetchPromise = null;

/**
 * Fetches all products from the backend with in-memory caching.
 * Prevents redundant network requests across page navigations.
 *
 * @param {boolean} forceRefresh - If true, bypasses cache and fetches fresh data.
 * @returns {Promise<Array>} List of all products.
 */
export async function fetchAllProducts(forceRefresh = false) {
    if (productsCache && !forceRefresh) {
        return productsCache;
    }

    if (productsFetchPromise && !forceRefresh) {
        return productsFetchPromise;
    }

    productsFetchPromise = getProducts()
        .then((response) => {
            const data = response.data;
            productsCache = Array.isArray(data) ? data : [];
            return productsCache;
        })
        .catch((err) => {
            console.error("Error fetching all products:", err);
            throw err;
        })
        .finally(() => {
            productsFetchPromise = null;
        });

    return productsFetchPromise;
}

/**
 * Returns cached products synchronously if already loaded.
 */
export function getCachedProducts() {
    return productsCache;
}

/**
 * Clears the products cache so the next call fetches fresh data from backend.
 * Call this when a product is created, edited, or deleted.
 */
export function invalidateProductsCache() {
    productsCache = null;
    productsFetchPromise = null;
}
