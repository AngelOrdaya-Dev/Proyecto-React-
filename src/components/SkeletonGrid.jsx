import React from 'react';

// Componente reutilizable de Skeleton Shimmer — Dark Theme
const SkeletonCard = () => (
    <div className="col-md-6 col-lg-4 mb-4">
        <div className="skeleton-card">
            <div className="d-flex align-items-center gap-3 mb-4">
                <div className="skeleton skeleton-avatar" style={{borderRadius: '18px'}}></div>
                <div className="d-flex flex-column gap-2 flex-grow-1">
                    <div className="skeleton skeleton-line-lg"></div>
                    <div className="skeleton skeleton-line-md"></div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="skeleton skeleton-badge"></div>
                <div className="d-flex gap-2">
                    <div className="skeleton skeleton-btn"></div>
                    <div className="skeleton skeleton-btn"></div>
                </div>
            </div>
        </div>
    </div>
);

const SkeletonGrid = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </>
);

export default SkeletonGrid;
