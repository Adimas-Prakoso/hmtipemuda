import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: string | number;
    text: string;
  };
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900/60 dark:text-white/60">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</h3>
            {trend && (
              <p className="mt-2 flex items-center text-sm text-blue-900/60 dark:text-white/60">
                {trend.value} {trend.text}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-3 dark:from-blue-400/10 dark:to-blue-500/10">
            <Icon className="h-full w-full text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/5 group-hover:animate-shimmer" />
    </div>
  );
}
