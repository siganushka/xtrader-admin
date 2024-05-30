import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PRODUCT: AppRouteRecordRaw = {
  path: '/product',
  name: 'Product',
  redirect: '/product/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.product',
    requiresAuth: true,
    icon: 'icon-gift',
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'ProductList',
      component: () => import('@/views/product/list.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Product',
      },
    },
    {
      path: 'new',
      name: 'ProductNew',
      component: () => import('@/views/product/new.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Product',
      },
    },
    {
      path: ':id/edit',
      name: 'ProductEdit',
      component: () => import('@/views/product/edit.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Product',
      },
    },
  ],
};

export default PRODUCT;
