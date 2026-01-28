// const categoryHandler=async(category="All Products")=>{
//                 

//           }
// useEffect(()=>{
//     categoryHandler();
// },[]);

import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard";
import "../styles/products.css"
import { useLocation } from "react-router-dom";
import Loader  from "../components/Loader"
export default function Products() {
    const location = useLocation();
    const search = location.state?.search || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("All Products");
    
    useEffect(() => {

            const categoryHandler = async () => {
                setLoading(true);
                let url = "http://localhost:8080/api/product";
                if(search&&content ==="All Products"){
                    url = `http://localhost:8080/api/product/search?keyword=${encodeURIComponent(search)}`;
                }

                else if (!search&&content !== "All Products") {
                    url = `http://localhost:8080/api/product/category/${encodeURIComponent(content)}`;
                }

                else if(search&&content!=="All Products"){
                    url = `http://localhost:8080/api/product/search?keyword=${encodeURIComponent(search)}&category=${encodeURIComponent(content)}`;

                }
                try {
                    const fetchedProduct = await fetch(url);
                    if (fetchedProduct.ok) {
                        const data = await fetchedProduct.json();
                        setProducts(data);
                    }
                } catch (e) {
                    console.error("Fetch error:", e);

                }
                finally {
                    setLoading(false);
                }
            }
            categoryHandler();
        
    }, [content,search]
    );
    if (loading) return <Loader></Loader>
    console.log(products);
    return (
        <div className="prods-div">
            <div className='prods-nav'>
                <div
                    style={{ fontSize: "30px" }}
                >Categories</div>
                <div className='prod-nav-sub'>
                    <div onClick={() => { setContent("All Products") }} className={`prod-nav-sub-cat ${content === "All Products" ? "active" : ''}`} >
                        <p>All Products</p>
                    </div>
                    <div onClick={() => { setContent("Fashion") }} className={`prod-nav-sub-cat ${content === "Fashion" ? "active" : ''}`} >
                        <p>Fashion</p>
                    </div>
                    <div onClick={() => { setContent("Electronics") }} className={`prod-nav-sub-cat ${content === "Electronics" ? "active" : ''}`}>
                        <p>Electronics</p>
                    </div>
                    <div onClick={() => { setContent("Home & Living") }} className={`prod-nav-sub-cat ${content === "Home & Living" ? "active" : ''}`}>
                        <p>Home & Living</p>
                    </div>
                    <div onClick={() => { setContent("Beauty & Personal Care") }} className={`prod-nav-sub-cat ${content === "Beauty & Personal Care" ? "active" : ''}`}>
                        <p>Beauty & Personal Care</p>
                    </div>
                    <div onClick={() => { setContent("Books") }} className={`prod-nav-sub-cat ${content === "Books" ? "active" : ''}`}>
                        <p>Books</p>
                    </div>
                </div>
            </div>
            <div className="prod-right">

                <h2> {content}</h2>
                <div className="all-prods">
                    {
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            </div>

        </div>
    )
}