<template>
  <a-upload :custom-request="handleUpload" :disabled="loading" :show-file-list="false">
    <template #upload-button>
      <div class="arco-upload-list-item" style="margin: 0">
        <div v-if="loading" class="arco-upload-picture-card" :style="style">
          <div class="arco-upload-picture-card-text">
            <icon-sync spin />
          </div>
        </div>
        <div v-else-if="model" class="arco-upload-list-picture" :style="style">
          <img :src="model" />
          <div class="arco-upload-list-picture-mask" style="line-height: inherit">
            <icon-edit />
          </div>
        </div>
        <div v-else class="arco-upload-picture-card" :style="style">
          <div class="arco-upload-picture-card-text">
            <icon-plus />
          </div>
        </div>
      </div>
    </template>
  </a-upload>
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import useLoading from '@/hooks/loading';
  import { postMedia } from '@/api/media';
  import type { RequestOption, UploadRequest } from '@arco-design/web-vue';
  import type { MediaChannel, MediaFormData } from '@/types/media';

  const { loading, toggle } = useLoading(false);
  const model = defineModel<string>();

  const props = defineProps({
    channel: {
      type: String as PropType<MediaChannel>,
      required: true,
    },
    width: {
      type: String,
      default: '100px',
    },
    height: {
      type: String,
      default: '100px',
    },
  });

  const style = computed((): string => {
    return `width: ${props.width}; height: ${props.height}; line-height: ${props.height}; min-width: ${props.width}; margin: 0`;
  });

  const emit = defineEmits<{
    success: [mediaUrl: string];
    fail: [err: any];
  }>();

  const handleUpload = (option: RequestOption): UploadRequest => {
    const { onSuccess, onError, fileItem } = option;
    const abort = () => undefined;

    if (!fileItem.file) return { abort };

    const data: MediaFormData = {
      channel: props.channel,
      file: fileItem.file,
    };

    // toggle loading...
    toggle();

    postMedia(data)
      .then((res) => {
        model.value = `${res.url}?hash=${res.hash}`;
        onSuccess(model.value);
        emit('success', model.value);
      })
      .catch((err) => {
        onError(err);
        emit('fail', err);
      })
      .finally(() => toggle());

    return { abort };
  };
</script>
