import axios from 'axios';
import type { RequestQuery } from '@/types/interface';
import type { Order, OrderPagination } from '@/types/order';

export function getOrderList(params?: RequestQuery) {
  return axios.get<null, OrderPagination>('/api/orders', { params });
}

export function getOrder(number: number) {
  return axios.get<null, Order>(`/api/orders/${number}`);
}
