import { useEffect, useState, useMemo } from 'react';
import SellerReq from '../components/SellerReq';
import '../styles/adminDash.css';
import { getAdminStats, getSellerRequests } from '../api/adminApi';

export default function AdminDash() {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalSellers: 0,
        pendingSellerRequests: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const res = await getAdminStats();
                setStats(res.data);
            } catch (e) {
                console.error("Error fetching admin stats:", e);
            } finally {
                setLoadingStats(false);
            }
        };

        const fetchReq = async () => {
            try {
                const req = await getSellerRequests();
                setRequests(Array.isArray(req.data) ? req.data : []);
            } catch (e) {
                console.error("Error fetching seller requests:", e);
            }
        };

        fetchStats();
        fetchReq();
    }, []);

    // useMemo: memoize stat cards layout to avoid unnecessary re-calculations on renders
    const statCards = useMemo(() => [
        {
            label: "Number of Users",
            value: stats.totalUsers,
            bgColor: "#C89B92",
        },
        {
            label: "Number of Orders",
            value: stats.totalOrders,
            bgColor: "#A8C892",
        },
        {
            label: "Number of Sellers",
            value: stats.totalSellers,
            bgColor: "#92A9C8",
        },
    ], [stats]);

    return (
        <div className="admin-div">
            <h1>Hello Mr. Admin</h1>

            <div className="stat-div">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="stat-sub"
                        style={{
                            backgroundColor: card.bgColor,
                            flexDirection: "column",
                            gap: "0.25rem",
                            padding: "1rem",
                        }}
                    >
                        <span style={{ fontSize: "36px", fontWeight: "bold", lineHeight: 1.1 }}>
                            {loadingStats ? "..." : card.value}
                        </span>
                        <p style={{ margin: 0, fontSize: "18px", opacity: 0.95 }}>
                            {card.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="sell-auth-div">
                <h2>Seller Verification Requests:</h2>
                <div>
                    {requests.length === 0 ? (
                        <div style={{ fontSize: "16px", color: "gray", padding: "1rem 0" }}>
                            No pending seller verification requests.
                        </div>
                    ) : (
                        requests.map((req) => (
                            <SellerReq key={req.id || req.userId} request={req} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}