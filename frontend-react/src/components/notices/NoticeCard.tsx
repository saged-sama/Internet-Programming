import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';

export interface NoticeCardProps {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  isImportant?: boolean;
}

export default function NoticeCard({ id, title, date, category, description, isImportant }: NoticeCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
        isImportant ? themeClasses.borderAccentYellow : themeClasses.borderPrimary
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${themeClasses.bgPrimaryLight} ${themeClasses.textPrimary}`}>
              {category}
            </span>
            {isImportant && (
              <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellow} px-2.5 py-0.5 ${themeClasses.textPrimary}`}>
                Important
              </span>
            )}
          </div>
          <h3 className={themeClasses.textPrimary}>{title}</h3>
          <p>{description}</p>
          <Button variant="link" className={themeClasses.textAccentYellow} asChild>
            <Link to={`/notices/${id}`}>Read more</Link>
          </Button>
        </div>
        <span className={themeClasses.textPrimaryLight}>{date}</span>
      </div>
    </div>
  );
}
