<template>
  <a-drawer
    v-if="model"
    v-model:visible="isVisible"
    width="50%"
    ok-text="确认并保存"
    :title="model.name"
    @before-ok="handleOk"
  >
    <a-form :model="data" layout="vertical">
      <a-row
        v-for="(variant, index) in data"
        :key="index"
        :gutter="10"
        :style="{ marginTop: index > 0 ? '10px' : '0px' }"
      >
        <a-col flex="42px">
          <a-form-item
            :validate-status="errors?.[index]?.children.img?.errors.length ? 'error' : 'success'"
            :help="errors?.[index]?.children.img?.errors.length ? errors?.[index]?.children.img?.errors[0].message : ''"
            label="#"
            :hide-label="index > 0"
          >
            <Uploader v-model="variant.img!" channel="product_variant_img" width="32px" height="32px" />
          </a-form-item>
        </a-col>
        <a-col v-if="variant.choiceLabel" flex="auto">
          <a-form-item :label="$t('product_variant.option_values')" :hide-label="index > 0">
            <a-input :default-value="variant.choiceLabel" disabled />
          </a-form-item>
        </a-col>
        <a-col :flex="2">
          <a-form-item
            :validate-status="errors?.[index]?.children.price?.errors.length ? 'error' : 'success'"
            :help="
              errors?.[index]?.children.price?.errors.length ? errors?.[index]?.children.price?.errors[0].message : ''
            "
            :label="$t('product_variant.price')"
            :hide-label="index > 0"
          >
            <a-input-number v-model="variant.price" :step="0.01" :precision="2" />
          </a-form-item>
        </a-col>
        <a-col :flex="2">
          <a-form-item
            :validate-status="errors?.[index]?.children.inventory?.errors.length ? 'error' : 'success'"
            :help="
              errors?.[index]?.children.inventory?.errors.length
                ? errors?.[index]?.children.inventory?.errors[0].message
                : ''
            "
            :label="$t('product_variant.inventory')"
            :hide-label="index > 0"
          >
            <a-input-number v-model="variant.inventory!" />
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-form-item label="#" :hide-label="index > 0">
            <a-popconfirm
              type="error"
              position="left"
              content="操作不可恢复，确定要删除吗？"
              :ok-button-props="{ status: 'danger' }"
              @ok="data.splice(index, 1)"
            >
              <a-button type="dashed" size="small" status="danger">
                <template #icon>
                  <icon-close />
                </template>
              </a-button>
            </a-popconfirm>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { computed, watchEffect } from 'vue';
  import { omit, pick } from 'lodash';
  import currency from 'currency.js';
  import { Message } from '@arco-design/web-vue';
  import useForm from '@/hooks/form';
  import Uploader from '@/views/media/components/uploader.vue';
  import { putProductVariants } from '@/api/product';
  import type { Product, ProductVariantFormData } from '@/types/product';

  const model = defineModel<Product>();
  const { data, errors, setErrors, clearErrors } = useForm<ProductVariantFormData[]>([]);

  const isVisible = computed({
    get: () => undefined !== model.value,
    set: (newValue: boolean) => {
      if (!newValue) {
        clearErrors();
        model.value = undefined;
      }
    },
  });

  const emit = defineEmits<{
    success: [data: Product];
    fail: [err: any];
  }>();

  const handleOk = (done: (closed: boolean) => void) => {
    const product = model.value as Product;
    // remove choiceLabel from variant
    const variants = data.value.map((variant) => omit(variant, 'choiceLabel'));

    putProductVariants(product.id, variants)
      .then((res) => {
        Message.success('保存成功！');
        clearErrors();
        emit('success', res);
        done(true);
      })
      .catch((err) => {
        setErrors(err.errors?.variants.children);
        emit('fail', err);
        done(false);
      });
  };

  const money = (value?: number): number => {
    return currency(value || 0, { fromCents: true, symbol: '' }).value;
  };

  watchEffect(() => {
    if (model.value) {
      const { variants, choices } = model.value;

      if (choices.length === 0) {
        choices.push({ value: null, label: null });
      }

      data.value = choices.map((item) => {
        const find = variants.find((variant) => variant.choiceValue === item.value);
        if (find) {
          return { price: money(find.price), ...pick(find, 'inventory', 'img', 'choiceLabel') };
        }

        return { choiceLabel: item.label };
      });
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'ProductVariants',
  };
</script>

<style lang="less" scoped>
  .arco-form-item {
    margin: 0;
  }
</style>
