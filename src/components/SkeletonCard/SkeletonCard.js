import "./SkeletonCard.css";

const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-badge"></div>
            <div className="skeleton-poster"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle">
                <div className="skeleton-type"></div>
                <div className="skeleton-date"></div>
            </div>
        </div>
    );
};

// Helper component to render multiple skeleton cards
export const SkeletonGrid = ({ count = 20 }) => {
    return (
        <div className="trending skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonCard;
