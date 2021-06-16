<template>
  <div class="register-container">
    <a-form :form="form" @submit.prevent="handleSubmit">
      <a-form-item v-bind="formItemLayout" label="E-mail">
        <a-input
          v-decorator="[
            'email',
            {
              rules: [
                {
                  type: 'email',
                  message: '输入的电子邮件无效!',
                },
                {
                  required: true,
                  message: '请输入邮箱',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="密码" has-feedback>
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: '请输入密码!',
                },
                {
                  validator: validateToNextPassword,
                },
              ],
            },
          ]"
          type="password"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="确认密码" has-feedback>
        <a-input
          v-decorator="[
            'confirm',
            {
              rules: [
                {
                  required: true,
                  message: '请确认你的密码!',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            },
          ]"
          type="password"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">
          用户名&nbsp;
          <a-tooltip title="What do you want others to call you?">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="[
            'nickname',
            {
              rules: [
                {
                  required: true,
                  message: '请输入用户名!',
                  whitespace: true,
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="验证码">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input
              v-decorator="[
                'captcha',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码!',
                    },
                  ],
                },
              ]"
            />
          </a-col>
          <a-col :span="12">
            <a-button @click="handleCaptcha"  :disabled='showCount'
              >获取验证码 <span v-if="showCount">({{ count }})</span></a-button
            >
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit" :disabled="loading">
          {{ loading ? "注 册 中 ..." : "注 册" }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { alertMessage } from "@/utils";
import { mapState } from "vuex";
import { getCode } from "@/api/user";
export default {
  computed: {
    ...mapState("userInfo", ["loading"]),
  },
  data() {
    return {
      count: 60,
      showCount: false,
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    // 获取验证码
    async handleCaptcha() {
      const resp = await getCode(this.form.getFieldValue("email"));
      if (resp.data.status === "success") {
        this.showCount = true;
        const timer = setInterval(() => {
          this.count--;
          if (this.count < 0) {
            clearInterval(timer);
            this.count = 60;
            this.showCount = false;
          }
        }, 1000);
      }
    },
    // 注册
    handleSubmit() {
      this.form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          const resp = await this.$store.dispatch("userInfo/register", values);
          if (resp.data.status === "success") {
            alertMessage({ content: resp.data.msg, type: resp.data.status });
            this.$router.push({ name: "Login" });
          }
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("您输入的两个密码不一致!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
  },
};
</script>
<style lang='less' scoped>
@import "~@/styles/mixin";
.register-container {
  .center();
  width: 500px;
}
</style>