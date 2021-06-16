import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store';//导入仓库
Vue.use(VueRouter)

let pathStr = location.hostname.includes('localhost') ? '/' : '/missfresh_b' ;
const routes = [
  {
    name: 'Home',
    path: pathStr,
    component: Home,
    redirect: '/compute',//首次加载定向到统计页
    children:[
      {
        name:"Compute",
        path:'compute',
        component:()=>import('@/views/Compute.vue'),
        meta:{auth:true},
      },
      {
        name:"GoodsList",
        path:'goodslist',
        component:()=> import('@/views/GoodsList.vue'),
        meta:{auth:true},
      },
      {
        name:"AddGoods",
        path:'addgoods',
        component:()=>import('@/views/AddGoods.vue'),
        meta:{auth:true},
      },
      {
        name:"EditGoods",
        path:'addgoods/edit/:id',
        component:()=>import ('@/views/AddGoods.vue'),
        meta:{auth:true},
      },
    ]
  },
  {
    name:'Login',
    path:'/login',
    component:()=>import ('@/views/Login.vue'),
  },
  {
    name:'Register',
    path:'/register',
    component:()=>import ('@/views/Register.vue'),
  },
  {
    name:'FindBack',
    path:'/findback',
    component:()=> import ('@/views/FindBack.vue'),
  },
  {
    name:'NotFound',
    path:'*',
    component:()=> import ('@/views/NotFound.vue'),
  }
]


const router = new VueRouter({
  routes,
  mode:"history"
});

// 路由卫士
router.beforeEach((to,from,next)=>{
  const status = store.getters['userInfo/status'];
  if(to.meta.auth){
    // 未登录
    if(status === "unlogin"){
      alert("请登录再访问");
      next({name:'Login',query:{returnurl:to.fullPath} });//保存要访问的to.fullPath
    }else if(status === "loading"){
       // 登录中
       next({query:{returnurl:to.fullPath}});
    }else{
      next();
    }
  }else{
    // 无需鉴权
    next();
  }
})

export default router;
