import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'Order',
  redirect: '/order/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.order',
    requiresAuth: true,
    icon: 'icon-gift',
    order: 1,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/list.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Order',
      },
    },
  ],
};

export default ORDER;
