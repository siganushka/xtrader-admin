import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import currency from 'currency.js';
import dayjs from 'dayjs';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/api/interceptor';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.config.globalProperties.$filters = {
  datetime(value?: string, format?: string): string {
    if (!value) return '-';
    return dayjs(value).format(format || 'YYYY-MM-DD HH:mm');
  },
  money(value?: number): string {
    return currency(value || 0, { fromCents: true, symbol: '' }).toString();
  },
};

app.mount('#app');
