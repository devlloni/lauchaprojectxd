import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-700' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-700' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700' },
};

export function StatsCard({ title, value, icon: Icon, color = 'blue' }: StatsCardProps) {
  const colors = colorMap[color];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={cn('text-3xl font-bold mt-1', colors.value)}>{value}</p>
          </div>
          <div className={cn('p-3 rounded-full', colors.bg)}>
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
