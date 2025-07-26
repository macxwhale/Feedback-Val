
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
}

export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

export interface SelectOption {
  label: string;
  value: string;
}
