import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'zh-Hans', // 简体中文
      'zh',      // 繁体中文
      'en',      // 英文
      'ja',      // 日文
      'ko',      // 韩文
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log('Strapi Admin App initialized with i18n support');
  },
};
