<template>
  <div class="container">
    <Breadcrumb :items="['menu.product']" />
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" href="/product/new">
              <template #icon>
                <icon-plus />
              </template>
              添加
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button type="primary" status="danger">
            <template #icon>
              <icon-download />
            </template>
            导出
          </a-button>
        </a-col>
      </a-row>

      <a-table
        page-position="bottom"
        :pagination="pagination"
        :columns="columns"
        :data="data"
        :scroll="{ x: '100%' }"
        :loading="loading"
        :bordered="false"
        :scrollbar="true"
        @page-change="(page: number) => loadPage(page)"
      >
        <template #img="{ record }">
          <a-image width="50" height="50" :src="record.img" />
        </template>
        <template #name="{ record }">
          <p class="product-name">{{ record.name }}</p>
          <a-tag v-for="option in record.options" :key="option.id" size="small" color="arcoblue" checkable>
            {{ option.name }}
          </a-tag>
        </template>
        <template #variants="{ record }">
          <a-tag :color="record.variants.length < (record.choices.length || 1) ? '#f53f3f' : '#00b42a'">
            {{ record.variants.length }}/{{ record.choices.length || 1 }}
          </a-tag>
        </template>
        <template #createdAt="{ record }">
          {{ $filters.datetime(record.createdAt) }}
        </template>
        <template #action="{ record }">
          <a-link @click="variantsData = record">库存</a-link>
          <a-link :href="`/product/${record.id}/edit`">编辑</a-link>
          <a-link :href="`/product/${record.id}/delete`">删除</a-link>
        </template>
      </a-table>
    </a-card>

    <Variants v-model="variantsData" @success="handleVariantsSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { getProductList } from '@/api/product';
  import type { PaginationProps } from '@arco-design/web-vue';
  import type { Product } from '@/types/product';
  import type { RequestQuery } from '@/types/interface';
  import Variants from './components/variants.vue';

  const { t } = useI18n();

  const columns = [
    {
      title: t('generic.resource'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: t('product.img'),
      dataIndex: 'img',
      slotName: 'img',
      width: 100,
    },
    {
      title: t('product.name'),
      dataIndex: 'name',
      slotName: 'name',
      width: 320,
    },
    {
      title: t('product.variants'),
      dataIndex: 'variants',
      slotName: 'variants',
      width: 100,
    },
    {
      title: t('generic.createdAt'),
      dataIndex: 'createdAt',
      slotName: 'createdAt',
      width: 160,
    },
    {
      title: t('generic.action'),
      slotName: 'action',
      width: 150,
    },
  ];

  const { loading, toggle } = useLoading(false);
  const data = ref<Product[]>([]);
  const pagination = ref<PaginationProps>();
  const variantsData = ref<Product>();

  const loadPage = async (page?: number) => {
    const params: RequestQuery = {};
    params.page = page || 1;

    // toggle loading...
    toggle();

    const { currentPageNumber, itemsPerPage, totalCount, items } = await getProductList(params);

    // toggle loading...
    toggle();

    data.value = items;
    pagination.value = { total: totalCount, current: currentPageNumber, pageSize: itemsPerPage };
  };

  const handleVariantsSuccess = (product: Product) => {
    const index = data.value.findIndex((item) => item.id === product.id);
    if (index > -1) data.value[index] = product;
  };

  onMounted(() => loadPage());
</script>

<script lang="ts">
  export default {
    name: 'ProductList',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;

    .product-name {
      margin: 0 0 5px 0;
    }

    .arco-tag {
      margin: 0 10px 0 0;
    }
  }
</style>
