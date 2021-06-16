<template>
  <div class="login-container">
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit.prevent="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            {
              rules: [{ required: true, message: '请输入你的邮箱!' }],
            },
          ]"
          placeholder="请输入邮箱"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码！' }] },
          ]"
          type="password"
          placeholder="密码"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true,
            },
          ]"
        >
          记住我
        </a-checkbox>
        <RouterLink class="login-form-forgot" :to="{name:'FindBack'}">忘记密码</RouterLink>
        <a-button type="primary" html-type="submit" class="login-form-button" :disabled='loading'>
          {{loading? '登 录 中...':'登 录'}}
        </a-button>
        <RouterLink :to="{ name: 'Register' }">去注册！</RouterLink>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  computed:{
    ...mapState('userInfo',['loading']),
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    handleSubmit() {
      this.form.validateFields( async (err, values) => {
        if (!err) {
          const resp = await this.$store.dispatch('userInfo/login',values);
          if (resp.data.status === "success") {
            if(this.$route.query.returnurl){//如果有returnurl则登录后跳到returnurl
              this.$router.push(this.$route.query.returnurl);
            }else{
              this.$router.push({ name: "Compute" });
            }
          }
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
@import "~@/styles/mixin";
.login-container {
  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
  .center();
  width: 400px;
  height: 300px;
}
</style>
