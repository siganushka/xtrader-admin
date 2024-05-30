<template>
  <div class="container">
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
      <template #number="{ record }">
        <a-typography-text copyable code>{{ record.number }}</a-typography-text>
      </template>
      <template #items="{ record }">
        <p v-for="item in record.items" :key="item.id" class="order-items">
          {{ item.variant.product.name }}
          <small>&times;{{ item.quantity }}</small>
          <template v-if="item.variant.choiceLabel">
            <br /><small>{{ item.variant.choiceLabel }}</small>
          </template>
        </p>
      </template>
      <template #itemsTotal="{ record }">
        {{ $filters.money(record.itemsTotal) }}
      </template>
      <template #adjustmentsTotal="{ record }">
        {{ $filters.money(record.adjustmentsTotal) }}
      </template>
      <template #total="{ record }">
        {{ $filters.money(record.total) }}
      </template>
      <template #createdAt="{ record }">
        {{ $filters.datetime(record.createdAt) }}
      </template>
      <template #action>-</template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { getOrderList } from '@/api/order';
  import type { PaginationProps } from '@arco-design/web-vue';
  import type { RequestQuery } from '@/types/interface';
  import type { Order } from '@/types/order';

  const { t } = useI18n();

  const columns = [
    {
      title: t('order.number'),
      dataIndex: 'number',
      slotName: 'number',
      width: 180,
    },
    {
      title: t('order.items'),
      dataIndex: 'items',
      slotName: 'items',
      width: 280,
    },
    {
      title: t('order.itemsTotal'),
      dataIndex: 'itemsTotal',
      slotName: 'itemsTotal',
      width: 100,
    },
    {
      title: t('order.adjustmentsTotal'),
      dataIndex: 'adjustmentsTotal',
      slotName: 'adjustmentsTotal',
      width: 100,
    },
    {
      title: t('order.total'),
      dataIndex: 'total',
      slotName: 'total',
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
      width: 100,
    },
  ];

  const { loading, toggle } = useLoading(false);

  const loadPage = async (page?: number) => {
    const params: RequestQuery = {};
    params.page = page || 1;

    // toggle loading...
    toggle();

    const { currentPageNumber, itemsPerPage, totalCount, items } = await getOrderList(params);

    // toggle loading...
    toggle();

    data.value = items;
    pagination.value = { total: totalCount, current: currentPageNumber, pageSize: itemsPerPage };
  };

  const data = ref<Order[]>([]);
  const pagination = ref<PaginationProps>();

  onMounted(() => loadPage());
</script>

<script lang="ts">
  export default {
    name: 'Order',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;

    .order-items {
      line-height: 1.25;
      margin: 0 0 8px 0;

      small {
        color: var(--color-text-3);
      }

      &:last-child {
        margin: 0;
      }
    }
  }
</style>
