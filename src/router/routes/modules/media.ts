import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MEDIA: AppRouteRecordRaw = {
  path: '/media',
  name: 'Media',
  redirect: '/media/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.media',
    requiresAuth: true,
    icon: 'icon-gift',
    order: 2,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'MediaList',
      component: () => import('@/views/media/list.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Media',
      },
    },
  ],
};

export default MEDIA;
