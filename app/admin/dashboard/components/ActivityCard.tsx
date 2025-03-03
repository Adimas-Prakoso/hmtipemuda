interface ActivityItem {
  type: 'register' | 'event' | 'report';
  title: string;
  time: string;
}

interface ActivityCardProps {
  activities: ActivityItem[];
}

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'register':
      return {
        dot: 'from-blue-500 to-blue-600',
        bg: 'from-blue-500/5 to-blue-600/5 dark:from-blue-400/10 dark:to-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400'
      };
    case 'event':
      return {
        dot: 'from-green-500 to-green-600',
        bg: 'from-green-500/5 to-green-600/5 dark:from-green-400/10 dark:to-green-500/10',
        text: 'text-green-600 dark:text-green-400'
      };
    case 'report':
      return {
        dot: 'from-purple-500 to-purple-600',
        bg: 'from-purple-500/5 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400'
      };
  }
};

export default function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg shadow-blue-900/5 transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800 dark:shadow-none">
      <div className="flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-lg font-semibold text-transparent dark:from-blue-400 dark:to-indigo-400">
          Recent Activities
        </h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View all →
        </a>
      </div>
      <div className="mt-4 space-y-4">
        {activities.map((activity, index) => {
          const colors = getActivityColor(activity.type);
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: 'rgb(255 255 255 / 0.01)' }}
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${colors.dot} group-hover:animate-pulse`} />
                <div className="flex-1">
                  <p className={`font-medium transition-colors group-hover:${colors.text}`}>
                    {activity.title}
                  </p>
                  <p className="text-sm text-blue-900/60 dark:text-white/60">{activity.time}</p>
                </div>
                <div className={`shrink-0 text-sm ${colors.text} opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100`}>
                  View details
                </div>
              </div>

              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/5 group-hover:animate-shimmer" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
