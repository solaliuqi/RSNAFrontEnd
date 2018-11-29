// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '用户',
    icon: 'user-circle',
    children: [
      { path: '/demo/page1', title: '页面1' },
      { path: '/demo/page2', title: '页面2' },
    ]
  }
]
