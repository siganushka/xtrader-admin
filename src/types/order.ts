import type { Pagination, Timestampable } from './interface';
import type { ProductVariant } from './product';

export interface OrderItem {
  variant: ProductVariant;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAdjustment {
  amount: number;
}

export interface Order extends Timestampable {
  number: string;
  itemsTotal: number;
  adjustmentsTotal: number;
  total: number;
  items: OrderItem[];
  adjustments: OrderAdjustment[];
}

export interface OrderPagination extends Pagination {
  items: Order[];
}
