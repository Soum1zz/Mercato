
export default function OrderItemSub({order}){

    return(
        <div className="order-row order-data">
            <span>{order.productName}</span>
            <span>{order.productQuantity}</span>
            <span>₹{order.price}</span>

        </div>
    )
}