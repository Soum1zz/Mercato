import { useNavigate } from "react-router-dom";
import "../styles/productForm.css";
import toast from "react-hot-toast";
import { createSellerProduct } from "../api/sellerApi";
import { uploadToCloudinary } from "../api/uploadApi";

export default function ProductForm() {
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Personal Care",
    "Books",
  ];
  const navigate = useNavigate();
  return (
    <div className="add-form-div">
      <div style={{ fontSize: "39px" }}>Add your product</div>
      <form
        className="add-form"
        onSubmit={async (e) => {
          e.preventDefault();

          const form = e.currentTarget;
          const rawFormData = new FormData(form);
          let imageUrl = null;

          const file = form.querySelector('input[type="file"]').files[0];

          if (file) {
            try {
              imageUrl = await uploadToCloudinary(file);
            } catch (e) {
              console.error("Image upload failed", e);
            }
          }
          const ProductData = {
            name: rawFormData.get("name"),
            description: rawFormData.get("description"),
            price: parseFloat(rawFormData.get("price")) || 0,
            brand: rawFormData.get("brand"),
            category: rawFormData.get("category"),
            stock: parseInt(rawFormData.get("stock"), 10) || 0,
            date: rawFormData.get("date"),
            imgUrl: imageUrl
          };
          try {
            const response = await createSellerProduct(ProductData);
            console.log("Success:", response.data);
            toast.success("Product added!");
            form.reset();
            navigate("/seller");
          } catch (e) {
            console.error("Network Error:", e);
            toast.error("Product not added!");
          }
        }}
      >
        <label>
          Product Name:
          <input type="text" name="name" required />
        </label>
        <br />
        <label>
          Product Desc:
          <input type="text" name="description" required />
        </label>
        <br />
        <label>
          Product Price:
          <input type="number" name="price" step="0.01" min="0" required />
        </label>
        <br />
        <label>
          Product Brand:
          <input type="text" name="brand" required />
        </label>
        <br />
        <label>
          Product Category:
          <select name="category" defaultValue={categories[0]}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Product Stock:
          <input type="number" step="1" min="0" name="stock" />
        </label>
        <br />
        <label>
          Release Date:
          <input type="date" name="date" />
        </label>
        <br />
        <label>
          Image of the product:
          <input type="file" name="image" />
        </label>
        <br />

        <button className="add-submit-btn">Submit</button>
      </form>
    </div>
  );
}
