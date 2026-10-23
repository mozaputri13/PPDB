import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-xs)', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-container" style={{ padding: '16px' }}>
      <Skeleton height="32px" width="100%" style={{ marginBottom: '16px' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height="22px" width={`${100 / cols}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <Skeleton height="24px" width="40%" style={{ marginBottom: '12px' }} />
      <Skeleton height="16px" width="80%" style={{ marginBottom: '8px' }} />
      <Skeleton height="16px" width="60%" style={{ marginBottom: '16px' }} />
      <Skeleton height="40px" width="100%" />
    </div>
  );
}
