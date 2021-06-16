<template>
  <div class="findback-container">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout" label="邮箱">
        <a-input
          v-decorator="[
            'email',
            {
              rules: [
                {
                  type: 'email',
                  message: '这不是一个有效的邮箱!',
                },
                {
                  required: true,
                  message: '请输入邮箱!',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="新密码" has-feedback>
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: '请输入你的密码',
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
                  message: '请确认密码!',
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

      <a-form-item v-bind="formItemLayout" label="验证码 ">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input
              v-decorator="[
                'captcha',
                {
                  rules: [{ required: true, message: '请输入您得到的验证码!' }],
                },
              ]"
            />
          </a-col>
          <a-col :span="12">
            <a-button @click="handleCaptcha" :disabled="showCount"
              >获取验证码
              <span v-if="showCount">({{ count }})</span>
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit" :disabled="loading"
          >{{ loading ? "提交修改中..." : "提交修改" }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {  getCode } from "@/api/user";
import { mapState } from "vuex";
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
    // 提交修改
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          const resp = await this.$store.dispatch('userInfo/findBack',values);
          if (resp.data.status === "success") {
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
<style lang="less" scoped>
@import "~@/styles/mixin.less";
.findback-container {
  .center();
  width: 400px;
  height: 300px;
}
</style>
