import { useEffect } from "react"

export default function SellerForm({onClose}){


    useEffect(()=>{
        document.body.style.overflow= "hidden";

        return()=>{
            document.body.style.overflow= "auto"
        };
    }, [])
    return (
        <div className="modal-backdrop">
             <div className="modal-card">
                <div
                style={{marginBottom:"30px", fontSize:"40px"}}
                >Seller verification form</div>

                <form>
                    <label>
                        Business description :</label>
                        <input type="text"/>
                    
                    <label>
                        Tax id :</label>
                        <input type="text"/>
                    

                    <label>
                        Upload your tax certificate</label>
                        <input type="file"
                            style={{border: "none", background:"none", width:"200px"}}
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