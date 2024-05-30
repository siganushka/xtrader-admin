export interface Resource {
  id: number;
}

export interface Timestampable {
  updatedAt: string | null;
  createdAt: string;
}

export interface Pagination {
  currentPageNumber: number;
  itemsPerPage: number;
  totalCount: number;
}

export interface RequestQuery {
  page?: number;
  size?: number;
  _attrbutes?: string[];
}
