import { useEffect } from "react";
import { submitSellerDetails } from "../api/sellerApi";
import { uploadToCloudinary } from "../api/uploadApi";

export default function SellerForm({ sellDet, onClose, user }) {
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-title">
          Seller verification form
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            let imgUrl = null;
            const form = e.currentTarget;
            const rawFormData = new FormData(form);
            const file = rawFormData.get("cert");
            if (!file) return;

            try {
              imgUrl = await uploadToCloudinary(file);
            } catch (e) {
              console.error("Image upload failed", e);
            }

            const userData = {
              taxId: rawFormData.get("taxId"),
              description: rawFormData.get("desc"),
              imgUrl: imgUrl,
            };

            try {
              await submitSellerDetails(user.userId, userData);
              alert("sucessfully updated");
            } catch (e) {
              console.log(e);
              alert(e.response?.status || "Update failed");
            }
          }}
        >
          <label htmlFor="seller-desc">Business description</label>
          <input id="seller-desc" name="desc" type="text" defaultValue={sellDet?.description} />

          <label htmlFor="seller-tax-id">Tax ID</label>
          <input id="seller-tax-id" name="taxId" type="text" defaultValue={sellDet?.taxId} />

          <label htmlFor="seller-cert">Tax certificate</label>
          <input
            id="seller-cert"
            name="cert"
            type="file"
            className="file-input"
          />

          <div className="modal-actions">
            <button className="modal-btn" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-btn" type="submit">
              Submit your details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
