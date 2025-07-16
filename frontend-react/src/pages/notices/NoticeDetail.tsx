import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getNoticeById } from "../../lib/noticeApi";
import type { NoticeCategory } from "../../types/notice";
import themeClasses from "../../lib/theme-utils";

interface NoticeDetail {
  id: number;
  title: string;
  date: string;
  category: Exclude<NoticeCategory, "All">;
  description: string;
  isImportant: boolean;
}

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const noticeData = await getNoticeById(parseInt(id));
        
        setNotice({
          id: noticeData.id,
          title: noticeData.title,
          date: new Date(noticeData.notice_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          category: noticeData.category as Exclude<NoticeCategory, "All">,
          description: noticeData.description,
          isImportant: noticeData.is_important
        });
      } catch (err) {
        console.error("Failed to fetch notice details:", err);
        setError("Failed to load notice details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-red-600">{error || "Notice not found"}</p>
          <Link to="/notices" className="text-blue-600 hover:underline mt-2 inline-block">
            Return to notices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/notices" className="flex items-center gap-1">
          <ArrowLeft size={16} />
          Back to Notices
        </Link>
      </Button>

      <div className="bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{notice.title}</h1>
          <span className="text-gray-500 text-lg mt-2 md:mt-0">{notice.date}</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${themeClasses.bgPrimary} ${themeClasses.textAccentYellow}`}>
            {notice.category}
          </span>
          {notice.isImportant && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`}>
              Important
            </span>
          )}
        </div>

        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed">{notice.description}</p>
        </div>
      </div>
    </div>
  );
}
