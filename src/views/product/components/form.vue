<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-form
      :model="formData"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
      @submit-success="handleSubmit"
    >
      <a-form-item :label="$t('product.name')" :validate-status="formErrors.name?.errors.length ? 'error' : 'success'">
        <a-input v-model="formData.name" />
        <template v-if="formErrors.name?.errors.length" #help>{{ formErrors.name?.errors[0].message }}</template>
      </a-form-item>
      <a-form-item :label="$t('product.img')" :validate-status="formErrors.img?.errors.length ? 'error' : 'success'">
        <Uploader v-model="formData.img" channel="product_img" />
        <template v-if="formErrors.img?.errors.length" #help>{{ formErrors.img?.errors[0].message }}</template>
      </a-form-item>
      <a-form-item
        :label="$t('product.options')"
        :validate-status="formErrors.options?.errors.length ? 'error' : 'success'"
        :content-flex="false"
      >
        <a-button
          :disabled="!!(model && model.id) || formData.options.length >= 3"
          type="primary"
          style="margin-bottom: 10px"
          @click="formData.options.push({ name: undefined, values: undefined })"
        >
          添加
        </a-button>
        （{{ formData.options.length }}/3）
        <template v-for="(_, index) in formData.options" :key="index">
          <FormOption
            v-model="formData.options[index]"
            :errors="formErrors.options?.children?.[index]?.children"
            :removable="!(model && model.id)"
            @update:model-value="(modelValue) => console.log(modelValue)"
            @remove="formData.options.splice(index, 1)"
          />
        </template>
        <template v-if="formErrors.options?.errors.length" #help>{{ formErrors.options?.errors[0].message }}</template>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
  import { watchEffect } from 'vue';
  import { pick } from 'lodash';
  import useForm from '@/hooks/form';
  import useLoading from '@/hooks/loading';
  import { postProducts, putProduct } from '@/api/product';
  import type { Product, ProductFormData } from '@/types/product';
  import Uploader from '@/views/media/components/uploader.vue';
  import FormOption from './form-option.vue';

  const model = defineModel<Product>();

  const { loading, toggle } = useLoading(false);
  const { data: formData, errors: formErrors, setErrors, clearErrors } = useForm<ProductFormData>({ options: [] });

  const emit = defineEmits<{
    success: [data: Product];
    fail: [err: any];
  }>();

  const handleSubmit = async (values: any) => {
    const data: ProductFormData = pick(values, 'name', 'img', 'options');
    const request = model.value && model.value.id ? putProduct(model.value.id, data) : postProducts(data);

    // toggle loading...
    toggle();

    request
      .then((res) => {
        clearErrors();
        emit('success', res);
      })
      .catch((err) => {
        setErrors(err.errors || {});
        emit('fail', err);
      })
      .finally(() => toggle());
  };

  watchEffect(() => {
    if (model.value) {
      const options = model.value.options.map((option) => {
        const values = option.values.map((value) => value.text).join(',');
        return { name: option.name, values };
      });

      formData.value = { ...pick(model.value, 'name', 'img', 'variants'), options };
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'ProductForm',
  };
</script>
