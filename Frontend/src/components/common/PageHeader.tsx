import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:mb-6 sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}