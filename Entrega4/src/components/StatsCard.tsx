import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  trend?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'default',
  trend 
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-gradient-to-br from-card to-card',
    success: 'bg-gradient-to-br from-success/10 to-success/5',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5',
    destructive: 'bg-gradient-to-br from-destructive/10 to-destructive/5',
  };

  const iconStyles = {
    default: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-destructive bg-destructive/10',
  };

  return (
    <Card className={cn('border-0 shadow-md', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
          </div>
          <div className={cn('rounded-lg p-3', iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
