import { useNavigate, Link } from "react-router-dom";
import { TbShoppingBagX, TbHome, TbShoppingBag, TbArrowLeft, TbLockX } from "react-icons/tb";
import { isAuthenticated } from "../auth/authService";
import "../styles/notFound.css";

export default function NotFound({ type }) {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const isUnauthorized = type === "unauthorized";

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon-wrap">
          {isUnauthorized ? <TbLockX /> : <TbShoppingBagX />}
        </div>

        <span className="not-found-badge">
          {isUnauthorized ? "404 • Access Denied" : "404 • Error"}
        </span>

        <h1 className="not-found-title">
          {isUnauthorized ? "Restricted Area" : "Page Not Found"}
        </h1>

        <p className="not-found-desc">
          {isUnauthorized
            ? "The page you're trying to reach requires special permissions or doesn't exist. Please ensure you are logged into the right account or head back to the marketplace."
            : "We searched high and low, but couldn't find the page you're looking for. It may have been moved, renamed, or never existed in our catalogue."}
        </p>

        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-btn primary"
            onClick={() => navigate("/")}
          >
            <TbHome size={20} />
            Back to Home
          </button>

          <button
            type="button"
            className="not-found-btn secondary"
            onClick={() => navigate("/products")}
          >
            <TbShoppingBag size={20} />
            Browse Products
          </button>

          {!authenticated && (
            <button
              type="button"
              className="not-found-btn primary"
              style={{ backgroundColor: "#1f2937" }}
              onClick={() => navigate("/auth")}
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            className="not-found-btn ghost"
            onClick={() => navigate(-1)}
          >
            <TbArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="not-found-suggestions">
          <p>Popular Destinations</p>
          <div className="not-found-links">
            <Link to="/products" className="not-found-link-pill">
              All Products
            </Link>
            <Link to="/cart" className="not-found-link-pill">
              Your Cart
            </Link>
            <Link to="/auth" className="not-found-link-pill">
              Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
