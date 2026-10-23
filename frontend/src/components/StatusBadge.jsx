import React from 'react';
import { REGISTRATION_STATUSES } from '../data/mockData';

export default function StatusBadge({ status, className = '' }) {
  let badgeClass = 'badge-draft';
  let label = status || 'Draft';

  switch (status) {
    case REGISTRATION_STATUSES.DRAFT:
      badgeClass = 'badge-draft';
      label = 'Draft (Belum Dikirim)';
      break;
    case REGISTRATION_STATUSES.SUBMITTED:
      badgeClass = 'badge-submitted';
      label = 'Submitted (Dikirim)';
      break;
    case REGISTRATION_STATUSES.UNDER_REVIEW:
      badgeClass = 'badge-under-review';
      label = 'Under Review (Sedang Diverifikasi)';
      break;
    case REGISTRATION_STATUSES.NEEDS_REVISION:
      badgeClass = 'badge-needs-revision';
      label = 'Needs Revision (Perlu Perbaikan)';
      break;
    case REGISTRATION_STATUSES.VERIFIED:
      badgeClass = 'badge-verified';
      label = 'Verified (Terverifikasi)';
      break;
    case REGISTRATION_STATUSES.ACCEPTED:
      badgeClass = 'badge-accepted';
      label = 'Accepted (Diterima)';
      break;
    case REGISTRATION_STATUSES.NOT_ACCEPTED:
      badgeClass = 'badge-not-accepted';
      label = 'Not Accepted (Belum Diterima)';
      break;
    default:
      badgeClass = 'badge-draft';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <span className="badge-dot"></span>
      <span>{label}</span>
    </span>
  );
}
