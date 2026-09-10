import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchAllProducts } from "../services/productService";

export default function Products() {
    const location = useLocation();
    const search = location.state?.search || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("All Products");

    // Fetch all products once on mount (uses in-memory cache if already fetched)
    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchAllProducts();
                if (isMounted) {
                    setProducts(data || []);
                }
            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    // useMemo: memoize costly in-memory filtering across products, categories, and search
    // Prevents redundant re-filtering on unrelated renders and avoids fetching backend on every category switch
    const filteredProducts = useMemo(() => {
        if (!products || products.length === 0) return [];

        const normalizedSearch = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                content === "All Products" ||
                product.category?.trim().toLowerCase() === content.trim().toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                product.name?.toLowerCase().includes(normalizedSearch) ||
                product.description?.toLowerCase().includes(normalizedSearch) ||
                product.brand?.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [products, content, search]);

    return (
        <div className="prods-div">
            <div className="prods-nav">
                <div style={{ fontSize: "30px", marginBottom: "1rem" }}>
                    Categories
                </div>
                <div className="prod-nav-sub">
                    <div
                        onClick={() => { setContent("All Products"); }}
                        className={`prod-nav-sub-cat ${content === "All Products" ? "active" : ""}`}
                    >
                        <p>All Products</p>
                    </div>
                    <div
                        onClick={() => { setContent("Fashion"); }}
                        className={`prod-nav-sub-cat ${content === "Fashion" ? "active" : ""}`}
                    >
                        <p>Fashion</p>
                    </div>
                    <div
                        onClick={() => { setContent("Electronics"); }}
                        className={`prod-nav-sub-cat ${content === "Electronics" ? "active" : ""}`}
                    >
                        <p>Electronics</p>
                    </div>
                    <div
                        onClick={() => { setContent("Home & Living"); }}
                        className={`prod-nav-sub-cat ${content === "Home & Living" ? "active" : ""}`}
                    >
                        <p>Home & Living</p>
                    </div>
                    <div
                        onClick={() => { setContent("Beauty & Personal Care"); }}
                        className={`prod-nav-sub-cat ${content === "Beauty & Personal Care" ? "active" : ""}`}
                    >
                        <p>Beauty & Personal Care</p>
                    </div>
                    <div
                        onClick={() => { setContent("Books"); }}
                        className={`prod-nav-sub-cat ${content === "Books" ? "active" : ""}`}
                    >
                        <p>Books</p>
                    </div>
                </div>
            </div>
            <div className="prod-right">
                <h2>{content}</h2>
                {loading ? (
                    <div className="prod-loader">
                        <Loader className="inline-loader" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        No products available.
                    </div>
                ) : (
                    <div className="all-prods">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
