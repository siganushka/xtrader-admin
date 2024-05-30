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
      <template #name="{ record }">
        <span :title="record.name">
          <icon-file-image v-if="record.image" size="16" />
          <icon-file-pdf v-else-if="record.extension === 'pdf'" size="16" />
          <icon-file v-else size="16" />
          {{ record.name }}
        </span>
      </template>
      <template #pixel="{ record }">
        {{ record.width && record.height ? `${record.width}*${record.width}` : '-' }}
      </template>
      <template #createdAt="{ record }">
        {{ $filters.datetime(record.createdAt) }}
      </template>
      <template #action="{ record }">
        <a-link @click="drawerData = record">查看</a-link>
        <a-popconfirm
          type="error"
          position="left"
          content="操作不可恢复，确定要删除吗？"
          :ok-button-props="{ status: 'danger' }"
          @before-ok="(done) => handleDelete(record, done)"
        >
          <a-link status="danger">删除</a-link>
        </a-popconfirm>
      </template>
    </a-table>

    <a-drawer
      v-if="drawerData"
      v-model:visible="drawerDataVisible"
      title="查看"
      width="38.2%"
      :drawer-style="{ minWidth: '320px' }"
      :footer="false"
    >
      <a-descriptions :column="1" :align="{ label: 'right' }">
        <template v-if="drawerData.image" #title>
          <div style="text-align: center">
            <img :src="drawerData.url" :title="drawerData.name" style="max-width: 100%; vertical-align: middle" />
          </div>
        </template>

        <a-descriptions-item :label="t('media.hash')">
          <a-typography-text copyable code>{{ drawerData.hash }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item :label="t('media.name')">
          <a-link :href="drawerData.url" target="_blank" icon>{{ drawerData.name }}</a-link>
        </a-descriptions-item>
        <a-descriptions-item :label="t('media.extension')">{{ drawerData.extension }}</a-descriptions-item>
        <a-descriptions-item :label="t('media.mimeType')">{{ drawerData.mimeType }}</a-descriptions-item>
        <a-descriptions-item :label="t('media.size')">{{ drawerData.sizeStr }}</a-descriptions-item>
        <a-descriptions-item :label="t('media.pixel')">
          {{ drawerData.width && drawerData.height ? `${drawerData.width}*${drawerData.height}` : '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('media.image')">
          <a-tag v-if="drawerData.image" color="#00b42a">是</a-tag>
          <a-tag v-else color="#86909c">否</a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="t('generic.updatedAt')">
          {{ $filters.datetime(drawerData.updatedAt) }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('generic.createdAt')">
          {{ $filters.datetime(drawerData.createdAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { getMediaList, deleteMedia } from '@/api/media';
  import { Message, type PaginationProps } from '@arco-design/web-vue';
  import type { RequestQuery } from '@/types/interface';
  import type { Media } from '@/types/media';

  const { t } = useI18n();

  const { loading, toggle } = useLoading(false);
  const data = ref<Media[]>([]);
  const pagination = ref<PaginationProps>();
  const columns = [
    {
      title: t('media.name'),
      dataIndex: 'name',
      slotName: 'name',
      ellipsis: true,
      width: 240,
    },
    {
      title: t('media.extension'),
      dataIndex: 'extension',
      width: 80,
    },
    {
      title: t('media.mimeType'),
      dataIndex: 'mimeType',
      width: 140,
    },
    {
      title: t('media.size'),
      dataIndex: 'sizeStr',
      width: 100,
    },
    {
      title: t('media.pixel'),
      dataIndex: 'pixel',
      slotName: 'pixel',
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
      dataIndex: 'action',
      slotName: 'action',
      fixed: 'right' as const,
      width: 120,
    },
  ];

  const loadPage = async (page?: number) => {
    const params: RequestQuery = {};
    params.page = page || 1;

    // toggle loading...
    toggle();

    const { currentPageNumber, itemsPerPage, totalCount, items } = await getMediaList(params);

    // toggle loading...
    toggle();

    data.value = items;
    pagination.value = { total: totalCount, current: currentPageNumber, pageSize: itemsPerPage };
  };

  const drawerData = ref<Media>();
  const drawerDataVisible = computed({
    get: () => !!(drawerData.value && drawerData.value.hash),
    set: (newValue: boolean) => {
      if (!newValue) drawerData.value = undefined;
    },
  });

  const handleDelete = (media: Media, done: (closed: boolean) => void) => {
    deleteMedia(media.hash)
      .then(() => {
        Message.success('删除成功！');
        loadPage();
      })
      .finally(() => done(true));
  };

  onMounted(() => loadPage());
</script>

<script lang="ts">
  export default {
    name: 'Media',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
  }
</style>
