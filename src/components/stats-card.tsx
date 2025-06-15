'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100 border-blue-200',
}: StatsCardProps) {
  return (
    <Card className="text-center transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-3 ${iconBgColor} dark:bg-blue-900 dark:border-blue-700`}
        >
          <Icon className={`h-6 w-6 ${iconColor} dark:text-blue-400`} />
        </div>
        <div className="text-2xl font-bold mb-1 text-stone-800 dark:text-stone-200">{value}</div>
        <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      </CardContent>
    </Card>
  );
}
