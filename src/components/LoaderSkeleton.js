import "./LoaderSkeleton.css";

export default function LoaderSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-text short" />
          <div className="skeleton-text long" />
        </div>
      ))}
    </div>
  );
}
