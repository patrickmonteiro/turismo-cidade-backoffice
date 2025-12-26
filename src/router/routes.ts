import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'workspaces',
        component: () => import('pages/workspace/WorkspaceIndex.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'workspaces/novo',
        component: () => import('pages/workspace/WorkspaceForm.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'workspaces/:id',
        component: () => import('pages/workspace/WorkspaceForm.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        component: () => import('pages/user/UserIndex.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users/novo',
        component: () => import('pages/user/UserForm.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users/:id',
        component: () => import('pages/user/UserForm.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { requiresAuth: false },
  },
];

export default routes;
