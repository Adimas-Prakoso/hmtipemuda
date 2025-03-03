interface Event {
  title: string;
  datetime: string;
  type: string;
  participants: number;
  status?: 'upcoming' | 'in-progress' | 'completed';
}

interface EventCardProps {
  events: Event[];
}

const getStatusColor = (status: Event['status'] = 'upcoming') => {
  switch (status) {
    case 'upcoming':
      return {
        bg: 'from-blue-500/5 to-blue-600/5 dark:from-blue-400/10 dark:to-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
      };
    case 'in-progress':
      return {
        bg: 'from-green-500/5 to-green-600/5 dark:from-green-400/10 dark:to-green-500/10',
        text: 'text-green-600 dark:text-green-400',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      };
    case 'completed':
      return {
        bg: 'from-gray-500/5 to-gray-600/5 dark:from-gray-400/10 dark:to-gray-500/10',
        text: 'text-gray-600 dark:text-gray-400',
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      };
  }
};

const getEventTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'workshop':
      return {
        bg: 'from-purple-500/5 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
      };
    case 'seminar':
      return {
        bg: 'from-orange-500/5 to-orange-600/5 dark:from-orange-400/10 dark:to-orange-500/10',
        text: 'text-orange-600 dark:text-orange-400',
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
      };
    default:
      return getStatusColor('upcoming');
  }
};

export default function EventCard({ events }: EventCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg shadow-blue-900/5 transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800 dark:shadow-none">
      <div className="flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-lg font-semibold text-transparent dark:from-blue-400 dark:to-indigo-400">
          Upcoming Events
        </h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View all →
        </a>
      </div>
      <div className="mt-4 space-y-4">
        {events.map((event, index) => {
          const typeColors = getEventTypeColor(event.type);
          const statusColors = event.status ? getStatusColor(event.status) : undefined;
          
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-blue-900/5 bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/5"
              style={{ backgroundColor: 'rgb(255 255 255 / 0.01)' }}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-blue-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {event.title}
                    </h3>
                    <p className="text-sm text-blue-900/60 dark:text-white/60">{event.datetime}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${typeColors.badge}`}>
                        {event.type}
                      </span>
                      <span className="text-sm text-blue-900/60 dark:text-white/60">
                        {event.participants} participants
                      </span>
                    </div>
                  </div>
                  {event.status && (
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors?.badge}`}>
                      {event.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${typeColors.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/5 group-hover:animate-shimmer" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
