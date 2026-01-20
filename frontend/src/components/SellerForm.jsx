import { useEffect, } from "react";
import { getToken } from "../auth/authService";
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
        <div style={{ marginBottom: "30px", fontSize: "40px" }}>
          Seller verification form
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            let imgUrl=null;
            const form = e.currentTarget;
            const rawFormData = new FormData(form);
            const file = rawFormData.get("cert");
            if (!file) return;
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "Mercato");
            data.append("cloud_name", "dp5zhfxsl");

            try {
              const res = await fetch(
                "https://api.cloudinary.com/v1_1/dp5zhfxsl/image/upload",
                {
                  method: "POST",
                  body: data,
                },
              );

              const jsonData = await res.json();
              imgUrl= jsonData.secure_url;
              try {
                await fetch(
                  `http://localhost:8080/api/user/${user.userId}/image`,
                  {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({imgUrl: imgUrl}),
                  },
                );
              } catch (e) {
                console.error(e);
              }

            } catch (e) {
              console.error("Image upload failed", e);
            }

            const userData = {
              taxId: rawFormData.get("taxId"),
              description: rawFormData.get("desc"),
              imgUrl: imgUrl
            };

            try {
              const response = await fetch(
                `http://localhost:8080/seller/${user.userId}/details`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${getToken()}`,
                  },
                  body: JSON.stringify(userData),
                },
              );
              if (response.ok) {
                alert("sucessfully updated");
              } else {
                alert(response.status);
              }
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <label>Business description :</label>
          <input name="desc" type="text" defaultValue={sellDet?.description} />

          <label>Tax id :</label>
          <input name="taxId" type="text" defaultValue={sellDet?.taxId} />

          <label>Upload your tax certificate</label>
          <input
            name="cert"
            type="file"
            style={{ border: "none", background: "none", width: "200px" }}
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
