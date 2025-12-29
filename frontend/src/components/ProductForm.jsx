export default function ProductForm() {
    const categories=[
        "Electronics", "Fashion", "Home & Living", 
        "Beauty & Personal Care", "Books"
    ];
    return (<div>
        <form
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
                    status: rawFormData.get("status"),
                    date: rawFormData.get("date"),

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
                    const response = await fetch("http://localhost:8080/api/products",
                        {
                            method: "POST",
                            body: dataToSend,
                        });

                    if (response.ok) {
                        const result = await response.json();
                        console.log("Success:", result);
                        alert("Product added!");
                        form.reset();
                    } else {
                        const errorText = await response.text();
                        console.error("Server Error Status:", response.status, "Message:", errorText);
                        alert(`Failed with status ${response.status}. Check backend logs.`);
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
                        categories.map((cat)=>(
                            <option key={cat} value={cat}>{cat}</option>
                        ))
                    }

                </select>
            </label><br />
            <label>Product Stock:
                <input type="number" step="1" min="0" name="stock" />
            </label><br />
            <label>Product Status:
                <input type="text" name="status" />
            </label><br />
            <label>Release Date:
                <input type="date" name="date" />
            </label><br />
            <label>image:
                <input type="file" name="image" />
            </label><br />

            <button >Submit</button>
        </form>
    </div>)
}