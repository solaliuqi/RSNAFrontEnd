import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

export default {
  path: '/user',
  name: 'user',
  meta,
  redirect: { name: 'user-profile' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'profile', name: `${pre}profile`, component: () => import('@/pages/user/userProfile'), meta: { meta, title: '个人中心' } },
    { path: 'history', name: `${pre}history`, component: () => import('@/pages/user/userHistory'), meta: { meta, title: '历史记录' } },
    // { path: 'page3', name: `${pre}page3`, component: () => import('@/pages/demo/page3'), meta: { meta, title: '页面 3' } }
  ])('user-')
}
