import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import themeClasses from '../../lib/theme-utils';

export interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    description: string;
    image: string;
    registrationRequired: boolean;
    registrationDeadline?: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className={`bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col border ${themeClasses.borderPrimary} hover:shadow-lg transition-shadow ${themeClasses.hoverBorderAccentYellow}`}>
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary} text-xs font-semibold px-2 py-1`}>
            {event.category}
          </span>
          {event.registrationRequired && (
            <span className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 font-medium text-destructive">
              Registration Required
            </span>
          )}
        </div>
        <h3 className={`mb-2 ${themeClasses.textPrimary}`}>{event.title}</h3>
        <div className="flex items-center text-muted-foreground mb-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        {event.registrationRequired && event.registrationDeadline && (
          <p className="text-muted mb-4">
            Registration deadline: {event.registrationDeadline}
          </p>
        )}
        <div className="flex space-x-2">
          <Button variant="outline" className={themeClasses.outlineButton} asChild>
            <Link to={`/events/${event.id}`}>View Details</Link>
          </Button>
          {event.registrationRequired && (
            <Button className={themeClasses.primaryButton} asChild>
              <Link to={`/events/${event.id}/register`}>Register</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
