
import toast from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import { getToken } from "../auth/authService";
export default function CartItem({ cartItem, setCart }) {
    const imageUrl = `http://localhost:8080/api/product/${cartItem.productId}/image`

    const deleteCartHandler = async () => {
        try{const res = await fetch(`http://localhost:8080/api/me/cart/items/${cartItem.productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        )

        if(!res.ok){
            toast.error("Cart can't be updated");
        }
            toast.success("Cart updated");
            setCart((prev)=>({
                ...prev,
                items: prev.items.filter(
                    (item)=>item.productId!== cartItem.productId
                ),
                totalPrice: (prev.totalPrice-cartItem.totalPrice)
            }));

    }
        catch(e){
            console.log(e);
        }
    }


    return (
        <div className="cart-sub-div">
            <img src={imageUrl} width={100} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "30px", width: "40%" }}>
                <div>{cartItem?.productName}</div>
                <div style={{ fontSize: "15px" }}>Quantity: {cartItem?.quantity}</div>
            </div>
            <div style={{ color: "#6b1d4d", fontWeight: "bolder", width: "10%" }}>₹ {cartItem?.totalPrice}</div>
            <div

                style={{ color: "#641d4d", fontSize: "30px" }}
                onClick={deleteCartHandler}
            ><RiDeleteBinLine /></div>
        </div>
    )
}