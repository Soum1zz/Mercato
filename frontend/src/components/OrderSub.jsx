export default function OrderSub(){
    return(
        <div className="order-row order-data">
            <span>id</span>
            <span>date</span>

            <span className="status">
                status
            </span>

            <span>total</span>
            <button className="view-btn">View Order</button>
        </div>
    )
}