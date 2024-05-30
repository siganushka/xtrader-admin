import axios from 'axios';
import type { RequestQuery } from '@/types/interface';
import type { Product, ProductFormData, ProductPagination, ProductVariantFormData } from '@/types/product';

export function getProductList(params?: RequestQuery) {
  return axios.get<null, ProductPagination>('/api/products', { params });
}

export function postProducts(data: ProductFormData) {
  return axios.post<null, Product>('/api/products', data);
}

export function getProduct(id: string | number) {
  return axios.get<null, Product>(`/api/products/${id}`);
}

export function putProduct(id: string | number, data: ProductFormData) {
  return axios.put<null, Product>(`/api/products/${id}`, data);
}

export function putProductVariants(id: string | number, variants: ProductVariantFormData[]) {
  return axios.put<null, Product>(`/api/products/${id}/variants`, { variants });
}
