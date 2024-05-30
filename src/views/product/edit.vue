<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', 'product.edit']" />
    <a-card>
      <a-result v-if="submittedData" status="success">
        <template #title>商品已修改成功！</template>
        <template #extra>
          <a-space>
            <a-button type="primary" :href="`/product/list`">返回列表</a-button>
          </a-space>
        </template>
      </a-result>
      <Form v-else :model-value="data" @success="handleSuccess" @fail="handleFail" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getProduct } from '@/api/product';
  import type { Product } from '@/types/product';
  import Form from './components/form.vue';

  const route = useRoute();
  const productId = route.params.id as string;

  const data = ref<Product>();
  const submittedData = ref<Product>();

  const handleSuccess = (res: Product) => {
    console.log('handleSuccess...', res);
    submittedData.value = res;
  };

  const handleFail = (err: any) => {
    console.log('handleFail...', err);
  };

  onMounted(async () => {
    data.value = await getProduct(productId);
  });
</script>

<script lang="ts">
  export default {
    name: 'ProductEdit',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
