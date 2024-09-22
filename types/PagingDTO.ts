export interface PagingDto<E> {
  data: E;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
