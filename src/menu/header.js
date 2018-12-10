// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '用户',
    icon: 'user-circle',
    children: [
      {path: '/user/profile', title: '个人中心'},
      {path: '/user/history', title: '历史信息'},
    ]
  }
]
