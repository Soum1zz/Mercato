import { useState } from "react";
import { IoStar } from "react-icons/io5";
import { getUserImageUrl } from "../api/customerApi";

export default function CommentBody({ comment, isOwnReview = false, onEdit = null }) {
  const name = comment.userName?.charAt(0).toUpperCase() || "U";
  const [imgError, setImgError] = useState(false);
  const cusImg = getUserImageUrl(comment.userId);

  // Format date if available
  let formattedDate = "";
  if (comment.creationDate) {
    try {
      const d = new Date(comment.creationDate);
      formattedDate = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      formattedDate = comment.creationDate;
    }
  }

  return (
    <div className={`review-card ${isOwnReview ? "own-review-card" : ""}`}>
      <div className="review-card-header">
        <div className="review-user-info">
          {!imgError ? (
            <img
              src={cusImg}
              alt={comment.userName || "User"}
              className="review-avatar-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="review-avatar-fallback">{name}</div>
          )}

          <div className="review-user-meta">
            <div className="review-user-name-row">
              <span className="review-user-name">{comment.userName || "Customer"}</span>
              {isOwnReview && <span className="review-own-badge">Your Review</span>}
            </div>

            <div className="review-rating-row">
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <IoStar
                    key={n}
                    className={`review-star-icon ${n <= (comment.rating || 0) ? "filled" : "empty"}`}
                  />
                ))}
              </div>
              <span className="review-rating-score">
                {Number(comment.rating || 0).toFixed(1)}
              </span>
              {formattedDate && (
                <span className="review-date">• {formattedDate}</span>
              )}
            </div>
          </div>
        </div>

        {isOwnReview && onEdit && (
          <button type="button" className="review-edit-action-btn" onClick={onEdit}>
            Edit Review
          </button>
        )}
      </div>

      {comment.desc && (
        <p className="review-content-body">{comment.desc}</p>
      )}

      {comment.imageUrl && (
        <div className="review-attachment-wrap">
          <img
            src={comment.imageUrl}
            alt="Review attachment"
            className="review-attachment-img"
            onClick={() => window.open(comment.imageUrl, "_blank", "noopener,noreferrer")}
            title="Click to view full image"
          />
        </div>
      )}
    </div>
  );
}
