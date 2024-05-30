<template>
  <a-row :gutter="10">
    <a-col :span="6">
      <a-form-item
        :validate-status="errors.name?.errors.length ? 'error' : 'success'"
        :help="errors.name?.errors.length ? errors.name?.errors[0].message : ''"
        hide-label
      >
        <a-input v-model="model.name">
          <template #prefix>选项名称</template>
        </a-input>
        <template v-if="errors.name?.errors.length" #help>{{ errors.name?.errors[0].message }}</template>
      </a-form-item>
    </a-col>
    <a-col :span="removable ? 16 : 18">
      <a-form-item
        :validate-status="errors.values?.errors.length ? 'error' : 'success'"
        :help="errors.values?.errors.length ? errors.values?.errors[0].message : ''"
        hide-label
      >
        <FormOptionValues v-model="model.values" />
      </a-form-item>
    </a-col>
    <a-col v-show="removable" :span="2">
      <a-popconfirm
        type="error"
        position="left"
        content="确定要删除吗？"
        :ok-button-props="{ status: 'danger' }"
        @ok="$emit('remove', model)"
      >
        <a-button type="dashed" size="small" status="danger">
          <template #icon>
            <icon-close />
          </template>
        </a-button>
      </a-popconfirm>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import type { ProductOptionSimpleFormData } from '@/types/product';
  import FormOptionValues from './form-option-values.vue';

  const model = defineModel<ProductOptionSimpleFormData>({ default: {} });

  defineProps({
    errors: {
      type: Object as PropType<Record<string, any>>,
      default: () => {
        return {};
      },
    },
    removable: {
      type: Boolean,
      default: true,
    },
  });

  defineEmits<{
    remove: [value: ProductOptionSimpleFormData];
  }>();
</script>

<script lang="ts">
  export default {
    name: 'ProductFormOption',
  };
</script>

<style lang="less" scoped>
  .arco-form-item {
    margin: 0;
  }
</style>
