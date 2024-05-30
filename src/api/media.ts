import axios from 'axios';
import type { RequestQuery } from '@/types/interface';
import type { Media, MediaFormData, MediaPagination } from '@/types/media';

export function getMediaList(params?: RequestQuery) {
  return axios.get<null, MediaPagination>('/api/media', { params });
}

export function postMedia(data: MediaFormData) {
  const $data = new FormData();
  $data.append('channel', data.channel);
  $data.append('file', data.file);

  return axios.post<null, Media>('/api/media', $data);
}

export function deleteMedia(hash: string) {
  return axios.delete<null, Media>(`/api/media/${hash}`);
}
