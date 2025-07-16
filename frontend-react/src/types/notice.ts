export type NoticeCategory = 
  | "All"
  | "Academic"
  | "Administrative"
  | "General"
  | "Research";

export interface Notice {
  id: number;
  title: string;
  notice_date: string;
  category: string;
  description: string;
  is_important: boolean;
}

export interface NoticeFilterOptions {
  category?: string;
  skip?: number;
  limit?: number;
}

export interface NoticeApiResponse {
  items: Notice[];
  total: number;
}

export interface NoticeCreateRequest {
  title: string;
  category: string;
  description: string;
  is_important?: boolean;
}

export interface NoticeUpdateRequest {
  title?: string;
  category?: string;
  description?: string;
  is_important?: boolean;
}
