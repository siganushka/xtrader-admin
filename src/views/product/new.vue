<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', 'product.new']" />
    <a-card>
      <a-result v-if="submittedData" status="success">
        <template #title>商品已添加成功！</template>
        <template #extra>
          <a-space>
            <a-button type="primary" :href="`/product/list`">返回列表</a-button>
            <a-button type="secondary" :href="`/product/${submittedData.id}/edit`"> 编辑 </a-button>
          </a-space>
        </template>
      </a-result>
      <Form v-else @success="handleSuccess" @fail="handleFail" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Product } from '@/types/product';
  import Form from './components/form.vue';

  const submittedData = ref<Product>();

  const handleSuccess = (res: Product) => {
    console.log('handleSuccess...', res);
    submittedData.value = res;
  };

  const handleFail = (err: any) => {
    console.log('handleFail...', err);
  };
</script>

<script lang="ts">
  export default {
    name: 'ProductNew',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
