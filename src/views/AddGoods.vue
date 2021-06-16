<template>
  <div class="addGoods-container" v-if="cateList">
    <h2 style="text-align: center">
      {{ $route.params.id ? "商品修改" : "商品新增" }}
    </h2>
    <a-form-model
      :model="formData"
      ref="ruleForm"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 13 }"
    >
      <!-- 标题 -->
      <a-form-model-item label="标题" prop="title" required>
        <a-input v-model.lazy="formData.title" placeholder="必填" />
      </a-form-model-item>
      <!-- 商品描述 -->
      <a-form-model-item label="商品描述" prop="desc" required>
        <a-input v-model.lazy="formData.desc" placeholder="必填" />
      </a-form-model-item>
      <!-- 商品分类 -->
      <a-form-model-item label="商品分类" prop="category" required>
        <a-select v-model.number="formData.category">
          <a-select-option
            v-for="item in cateList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 商品标签 -->
      <a-form-model-item label="商品标签" prop="tags" required>
        <a-select
          mode="tags"
          placeholder="必填"
          :default-value="['全国包邮']"
          v-model="formData.tags"
        >
          <a-select-option value="全国包邮">全国包邮</a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 商品售价 -->
      <a-form-model-item label="商品售价" prop="price" required>
        <a-input v-model.number="formData.price" placeholder="必填" />
      </a-form-model-item>
      <!-- 折扣价格 -->
      <a-form-model-item label="折扣价格" prop="price_off">
        <a-input v-model.number="formData.price_off" placeholder="选填" />
      </a-form-model-item>
      <!-- 商品库存 -->
      <a-form-model-item label="商品库存" prop="inventory" required>
        <a-input v-model.number="formData.inventory" placeholder="必填" />
      </a-form-model-item>
      <!-- 计量单位 -->
      <a-form-model-item label="计量单位" prop="unit" required>
        <a-input v-model.lazy="formData.unit" placeholder="必填" />
      </a-form-model-item>
      <!-- 上架状态 -->
      <a-form-model-item label="上架状态" required>
        <a-radio-group v-model.number="formData.status">
          <a-radio :value="1"> 上架 </a-radio>
          <a-radio :value="0"> 下架 </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <!-- 商品图片 -->
      <a-form-model-item label="商品图片" prop="images">
        <a-upload
          :action="
            'http://mallapi.duyiedu.com/upload/images?appkey=' + formData.appkey
          "
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
          name="avatar"
        >
          <div v-if="fileList.length < 8">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-model-item>

      <!-- 提交 -->
      <div class="submit">
        <a-button @click="onSubmit" type="primary">提交</a-button>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import { getCategory, addGoods, editGoods, getDetail } from "@/api/goods";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  data() {
    return {
      rules: {},
      previewVisible: false,
      previewImage: "",
      fileList: [],
      cateList: [],
      formData: {
        appkey: "",
        title: "",
        desc: "",
        category: "", //Number
        tags: [],
        price: "",
        price_off: "",
        inventory: "",
        unit: "g",
        status: 1,
        images: [],
      },
    };
  },
  async created() {
    const { id } = this.$route.params;
    if (id) {
      //判断 url有没有id值
      const resp = await getDetail(id);
      this.formData = resp.data.data;
    }
    // 将获取到的商品图片赋值给this.formData.images
    if (this.formData.images.length > 0) {
      this.fileList = this.formData.images.map((item, index) => ({
        uid: index,
        name: `image-${index}.png`,
        status: "done",
        url: item,
      }));
    }
    const resp = await getCategory();
    this.cateList = resp.data.data.data;
    this.formData.appkey = resp.data.data.data[0].appkey;
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ file, fileList }) {
      if (file.status === "done") {
        this.formData.images.push(file.response.data.url);
      } else if (file.status === "removed") {
        const { url } = file;
        this.formData.images = this.formData.images.filter((item) => item !== url);}
        this.fileList = fileList;
    },
    // 提交
    onSubmit() {
      // 修改商品
      if (this.$route.params.id) {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const resp = await editGoods(this.formData);
            if (resp.data.status === "success") {
              this.$message.success("修改成功");
              this.$router.push({ name: "GoodsList" });
              return;
            }
            this.$message.error(resp.data.msg);
          }
        });
      } else {
        // 新增数据
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const resp = await addGoods(this.formData);
            if (resp.data.status === "success") {
              this.$message.success(resp.data.msg);
              this.$router.push({ name: "GoodsList" });
              return true;
            }
            this.$message.error(resp.data.msg);
          }
        });
      }
    },
  },
};
</script>
<style scoped lang='less'>
.addGoods-container {
  padding-top: 20px;
  .submit {
    margin-bottom: 30px;
    text-align: center;
  }
}
</style>
