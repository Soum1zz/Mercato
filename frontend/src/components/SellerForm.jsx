import { useEffect, useState } from "react"
import { getToken } from "../auth/authService";
export default function SellerForm({sellDet, onClose, user }) {
    
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto"
        };
    }, [])

    
    return (
        <div className="modal-backdrop">
            <div className="modal-card">
                <div
                    style={{ marginBottom: "30px", fontSize: "40px" }}
                >Seller verification form</div>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const dataToSend = new FormData();
                        const rawFormData = new FormData(form);

                        const userData = {
                            taxId: rawFormData.get("taxId"),
                            description: rawFormData.get("desc")
                        }

                        dataToSend.append(
                            "seller",
                            new Blob([JSON.stringify(userData)], { type: "application/json" })

                        );
                        const imgFile = rawFormData.get("cert");
                        if (imgFile)
                            dataToSend.append("image", imgFile);
                        try {
                            const response = await fetch(`http://localhost:8080/seller/${user.userId}/details`, {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                },
                                body: dataToSend
                            });
                            if (response.ok) {
                                alert("sucessfully updated")
                            } else {
                                alert(response.status);
                            }

                        } catch (e) {
                            console.log(e);
                        }
                    }}

                >
                    <label>
                        Business description :</label>
                    <input name="desc" type="text" defaultValue={sellDet?.description} />

                    <label >
                        Tax id :</label>
                    <input name="taxId" type="text" defaultValue={sellDet?.taxId} />


                    <label>
                        Upload your tax certificate</label>
                    <input name="cert" type="file"
                        style={{ border: "none", background: "none", width: "200px" }}
                    />

                    <div className="modal-actions">
                        <button className="modal-btn" type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="modal-btn"
                            type="submit"
                        >Submit your details</button>
                    </div>

                </form>
            </div>
        </div>
    )
}