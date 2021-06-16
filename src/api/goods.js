import axios from './axios';

// 获取所有商品列表 
export async function getGoods() {
  return await axios.get('/products/all');
}

// 获取商品分类
export async function getCategory() {
  return await axios.get('/category/all')
}

// 新增商品
export async function addGoods(data) {
  return await axios.post(`/products/add`, data)
}

// 编辑商品
export async function editGoods(data) {
  return await axios.put(`/products/edit`, data);
}

// 通过id获取商品详情
export async function getDetail(id){
  return await axios.get(`/products/${id}`);
}

// 删除商品
export async function removeGoods(id) {
   return await axios.delete(`/products/${id}`);
}



