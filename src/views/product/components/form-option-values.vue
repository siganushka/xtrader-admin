<template>
  <a-input-tag :default-value="valuesTag" :unique-value="true" @change="handleChange">
    <template #prefix>选项值</template>
  </a-input-tag>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { TagData } from '@arco-design/web-vue';

  const model = defineModel<string>();

  const valuesTag = computed(() => {
    return model.value ? model.value.split(',') : [];
  });

  const handleChange = (value: (string | number | TagData)[]) => {
    model.value = value.join(',');
  };
</script>

<script lang="ts">
  export default {
    name: 'ProductFormOptionValues',
  };
</script>
