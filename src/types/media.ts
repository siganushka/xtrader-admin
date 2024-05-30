import type { Pagination, Timestampable } from './interface';

export interface Media extends Timestampable {
  hash: string;
  url: string;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  sizeStr: string;
  width: number | null;
  height: number | null;
  image: boolean;
}

export interface MediaPagination extends Pagination {
  items: Media[];
}

export type MediaChannel = 'generic' | 'product_img' | 'product_variant_img' | 'product_option_value_img';

export type MediaFormData = { channel: MediaChannel; file: File };
