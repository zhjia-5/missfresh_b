import { login, register, findBack, whoAmI } from '@/api/user';
import { alertMessage } from '@/utils';
export default {
  namespaced: true,
  state: {
    user: null,//用户对象
    loading: false,
  },
  getters: {
    status(state) {
      return state.loading ? "loading" : (state.user ? "login" : "unlogin");
    }
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    // 注册
    async register(ctx, payload) {
      ctx.commit('setLoading', true);
      const resp = await register(payload);
      ctx.commit('setLoading', false);//无论是否成功都设为false
      alertMessage({ content: resp.data.msg, type: resp.data.status });
      return resp;
    },
    // 找回密码 忘记密码
    async findBack(ctx, payload) {
      ctx.commit('setLoading', true);
      const resp = await findBack(payload);
      ctx.commit('setLoading', false);
      alertMessage({ content: resp.data.msg, type: resp.data.status });
      return resp;
    },
    // 登录
    async login(ctx, payload) {
      ctx.commit('setLoading', true);
      const resp = await login(payload);
      if(resp.data.status === 'success'){
        const {appkey} = resp.data.data;
        ctx.commit("setUser", resp.data.data)//设置用户对象
        // 如果用户点记住则将密码保存到本地
        localStorage.setItem('appkey',JSON.stringify(appkey));
        if (payload.remember) {
          localStorage.setItem('user', JSON.stringify(payload));
        }
      }
      ctx.commit("setLoading", false);
      return resp;
    },
    // 刷新重新登录  whoAmI
    async whoAmI(ctx) {
      ctx.commit('setLoading', true);
      const resp = await whoAmI();
      if (resp.data.status === 'success') {
        ctx.commit('setUser', resp.data.data);
        localStorage.setItem('appkey',JSON.stringify(resp.data.data.appkey));
      }
      ctx.commit('setLoading', false);
    }
  },

}
