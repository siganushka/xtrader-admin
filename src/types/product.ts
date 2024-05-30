import type { Pagination, Resource, Timestampable } from './interface';

export interface ProductVariantChoice {
  label: string | null;
  value: string | null;
}

export interface ProductOptionValue extends Resource {
  text: string;
  note: string | null;
  img: string | null;
}

export interface ProductOption extends Resource {
  name: string;
  values: ProductOptionValue[];
}

export interface ProductVariant extends Resource {
  price: number;
  inventory: number | null;
  img: string | null;
  choiceValue: string | null;
  choiceLabel: string | null;
  outOfStock: boolean;
}

export interface Product extends Resource, Timestampable {
  name: string;
  img: string;
  options: ProductOption[];
  variants: ProductVariant[];
  choices: ProductVariantChoice[];
}

export interface ProductPagination extends Pagination {
  items: Product[];
}

export type ProductOptionValueFormData = Pick<ProductOptionValue, 'img' | 'text' | 'note'>;

export type ProductOptionFormData = Pick<ProductOption, 'name'> & { values: ProductOptionValueFormData[] };

export type ProductOptionSimpleFormData = Partial<Pick<ProductOption, 'name'> & { values: string }>;

export type ProductVariantFormData = Partial<Pick<ProductVariant, 'price' | 'inventory' | 'img' | 'choiceLabel'>>;

export type ProductFormData = Partial<Pick<Product, 'name' | 'img'>> & { options: ProductOptionSimpleFormData[] };
