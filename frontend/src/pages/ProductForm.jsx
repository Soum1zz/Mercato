import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/productForm.css'
import { getCurrentUser, getToken } from '../auth/authService';
import toast from 'react-hot-toast';
export default function ProductForm() {
    const state= useLocation();
    const categories = [
        "Electronics", "Fashion", "Home & Living",
        "Beauty & Personal Care", "Books"
    ];
    const navigate = useNavigate();
    return (<div className='add-form-div'>
        <div style={{ fontSize: "39px" }}>Add your product</div>
        <form className='add-form'
            onSubmit={async (e) => {
                e.preventDefault();

                const form = e.currentTarget;
                const rawFormData = new FormData(form);
                const ProductData = {
                    name: rawFormData.get("name"),
                    description: rawFormData.get("description"),
                    price: parseFloat(rawFormData.get("price")) || 0,
                    brand: rawFormData.get("brand"),
                    category: rawFormData.get("category"),
                    stock: parseInt(rawFormData.get("stock"), 10) || 0,
                    date: rawFormData.get("date")
                };

                const dataToSend = new FormData();

                dataToSend.append(
                    "request",
                    new Blob([JSON.stringify(ProductData)], { type: "application/json" }),
                    "product.json"
                );

                const imageFile = form.querySelector('input[type="file"]').files[0];

                if (imageFile) {
                    dataToSend.append("image", imageFile);
                }
                try {
                    const response = await fetch("http://localhost:8080/seller/products",
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${getToken()}`,
                            },
                            body: dataToSend,
                        });

                    if (response.ok) {
                        const result = await response.json();
                        console.log("Success:", result);
                        toast.success("Product added!");
                        form.reset();
                        navigate("/seller")
                    } else {
                        const errorText = await response.text();
                        console.error("Server Error Status:", response.status, "Message:", errorText);
                        toast.error("Product not added!");
                    }
                } catch (e) {
                    console.error("Network Error:", e);
                }

            }}>
            <label>Product Name:
                <input type="text" name="name" required />

            </label><br />
            <label>Product Desc:
                <input type="text" name="description" required />
            </label><br />
            <label>Product Price:
                <input type="number" name="price" step="0.01" min="0" required />
            </label><br />
            <label>Product Brand:
                <input type="text" name="brand" required />
            </label><br />
            <label>Product Category:
                <select name="category" defaultValue={categories[0]}>
                    {
                        categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))
                    }

                </select>
            </label><br />
            <label>Product Stock:
                <input type="number" step="1" min="0" name="stock" />
            </label><br />
            <label>Release Date:
                <input type="date" name="date" />
            </label><br />
            <label>Image of the product:
                <input type="file" name="image" />
            </label><br />

            <button className='add-submit-btn'>Submit</button>
        </form>
    </div>)
}