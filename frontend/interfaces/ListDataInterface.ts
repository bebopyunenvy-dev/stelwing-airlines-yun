import { ContactItem } from "@/interfaces/ContactItem";

export interface ListDataInterface {
  success: boolean;
  data: ContactItem[];
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
    limit: number;
  };
}