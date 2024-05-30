import { ref } from 'vue';

export default function useForm<T>(initData: T) {
  const data = ref<T>(initData);
  const errors = ref<Record<string, any>>({});

  const setErrors = (formErrors: any) => {
    errors.value = formErrors;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  return {
    data,
    errors,
    setErrors,
    clearErrors,
  };
}
