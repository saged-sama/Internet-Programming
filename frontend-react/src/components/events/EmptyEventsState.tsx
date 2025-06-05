import { Button } from '../ui/button';
import themeClasses from '../../lib/theme-utils';

interface EmptyEventsStateProps {
  onReset: () => void;
}

export default function EmptyEventsState({ onReset }: EmptyEventsStateProps) {
  return (
    <div className="text-center py-12">
      <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className={`mt-2 ${themeClasses.textPrimary}`}>No events found</h3>
      <p className="mt-1 text-muted-foreground">Try changing your search or filter criteria.</p>
      <div className="mt-6">
        <Button onClick={onReset} className={themeClasses.primaryButton}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
