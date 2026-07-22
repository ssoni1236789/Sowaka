import React from 'react';
import { twMerge } from 'tailwind-merge';

const VARIANTS = {
  COMPLETED: { bg: 'bg-[#F9EBE1]', text: 'text-sowaka-primary' },
  PENDING: { bg: 'bg-[#FDECEC]', text: 'text-[#C04C4C]' },
  ON_TRACK: { bg: 'bg-green-100', text: 'text-green-700' },
  DELAYED: { bg: 'bg-[#FDECEC]', text: 'text-sowaka-primary' },
  STEADY: { bg: 'bg-[#F5F1EB]', text: 'text-sowaka-textMuted' },
  NEUTRAL: { bg: 'bg-gray-100', text: 'text-gray-600' }
};

const StatusBadge = ({ status, variant = 'NEUTRAL', className }) => {
  const styles = VARIANTS[variant] || VARIANTS.NEUTRAL;

  return (
    <span className={twMerge(
      "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
      styles.bg,
      styles.text,
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
