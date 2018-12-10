// 菜单 侧边栏
export default [
    {path: '/index', title: '首页', icon: 'home'},
    {
        title: '用户',
        icon: 'user-circle',
        children: [
            {path: '/user/profile', title: '个人信息'},
          {path: '/user/history', title: '历史信息'}]
    }
]
